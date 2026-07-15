(() => {
    // Находим текущий тег script, чтобы определить место внедрения в Tilda
    const currentScript = document.currentScript || (() => {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    // Находим наш контейнер
    const container = currentScript.closest('.tilda-symbols-bg-wrapper');
    if (!container) return;

    // Автоматически настраиваем абсолютное позиционирование родительского Zero Block
    const parentArtboard = container.closest('.t396__artboard') || container.closest('.r');
    if (parentArtboard) {
        const style = window.getComputedStyle(parentArtboard);
        if (style.position === 'static') {
            parentArtboard.style.position = 'relative';
        }
        // Вставляем контейнер в начало родительского блока, чтобы он был фоном
        if (container.parentElement !== parentArtboard) {
            parentArtboard.insertBefore(container, parentArtboard.firstChild);
        }
    }

    const state1El = container.querySelector('.state-1');
    const state2El = container.querySelector('.state-2');
    const state3El = container.querySelector('.state-3');
    const overlayPath = container.querySelector('.v-overlay-path');

    // Функция генерации случайной строки с органичными проплешинами
    function generateRandomLine(length) {
        const symbols = ['.', '.', ':', ':', '-', '-', '=', '=', '+', 'X', '•'];
        let result = '';
        
        while (result.length < length) {
            const clusterLength = Math.floor(Math.random() * 9) + 4;
            for (let i = 0; i < clusterLength; i++) {
                result += symbols[Math.floor(Math.random() * symbols.length)];
            }
            if (result.length >= length) break;

            const spaceLength = Math.floor(Math.random() * 7) + 3;
            result += ' '.repeat(spaceLength);
        }
        return result.substring(0, length);
    }

    function generateRows() {
        const rect = container.getBoundingClientRect();
        const width = rect.width || container.offsetWidth || window.innerWidth;
        const height = rect.height || container.offsetHeight || window.innerHeight;
        
        // Считываем параметры шрифта и настройки выреза из CSS-переменных (для гибкой настройки из Tilda)
        const style = getComputedStyle(document.documentElement);
        const fontSize = parseFloat(style.getPropertyValue('--symbols-font-size')) || 10;
        const letterSpacing = parseFloat(style.getPropertyValue('--symbols-letter-spacing')) || 2.6;
        const lineHeight = parseInt(style.getPropertyValue('--symbols-line-height')) || 15;
        
        // Настройки V-выреза (считываются из CSS переменных или берутся по умолчанию)
        const vTopPercent = parseFloat(style.getPropertyValue('--v-cutout-top')) || 35;
        const vBottomPercent = parseFloat(style.getPropertyValue('--v-cutout-bottom')) || 65;
        const vCenterWidthPercent = parseFloat(style.getPropertyValue('--v-cutout-width')) || 20;

        // 1. Расчет V-образной маскирующей плашки в пикселях
        const yTop = height * (vTopPercent / 100);
        const yBottom = height * (vBottomPercent / 100);
        const xLeftFlat = width * (0.5 - vCenterWidthPercent / 200);
        const xRightFlat = width * (0.5 + vCenterWidthPercent / 200);
        
        // Контрольные точки сглаживания изгиба V-выреза
        const cp1x = width * 0.82;
        const cp1y = yTop + (yBottom - yTop) * 0.33;
        const cp2x = width * 0.70;
        const cp2y = yBottom;
        
        const cp3x = width * 0.30;
        const cp3y = yBottom;
        const cp4x = width * 0.18;
        const cp4y = yTop + (yBottom - yTop) * 0.33;

        // Устанавливаем цвет заливки V-маски под цвет фона из CSS
        const bgVal = style.getPropertyValue('--bg-color').trim() || '#FBFBFB';
        overlayPath.setAttribute('fill', bgVal);

        // Путь маски (V-образный срез сверху)
        const pathD = `M 0,0 L ${width},0 L ${width},${yTop} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${xRightFlat},${yBottom} L ${xLeftFlat},${yBottom} C ${cp3x},${cp3y} ${cp4x},${cp4y} 0,${yTop} Z`;
        overlayPath.setAttribute('d', pathD);
        
        // 2. Генерация строк символов под ширину контейнера
        const charWidth = fontSize + letterSpacing;
        const charsNeeded = Math.max(350, Math.ceil(width / charWidth) + 15);
        const rowsCount = Math.ceil(height / lineHeight) + 12;

        function fillState(element) {
            if (!element) return;
            element.innerHTML = '';
            
            // Генерируем 12 уникальных случайных строк для бесшовного сдвига
            const rowTexts = [];
            for (let j = 0; j < 12; j++) {
                rowTexts.push(generateRandomLine(charsNeeded));
            }
            
            for (let i = 0; i < rowsCount; i++) {
                const row = document.createElement('div');
                row.className = 'symbol-row';
                row.textContent = rowTexts[i % 12];
                element.appendChild(row);
            }
        }

        fillState(state1El);
        fillState(state2El);
        fillState(state3El);
    }

    // Следим за ресайзом блока
    const resizeObserver = new ResizeObserver(() => {
        generateRows();
    });
    resizeObserver.observe(container);
})();
