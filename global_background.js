(() => {
  // Внедряем стили CSS динамически
  const style = document.createElement('style');
  style.innerHTML = `
    /* Подключаем Source Code Pro для координат */
    @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

    :root { 
      --border-faint: #E2E8F0; 
      --heat-100: #FF7200; 
      --bg: #FBFBFB; 
    }

    /* Глобальный контейнер фона */
    .site-technical-background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: -999;
    }

    /* Анимация пульсации оранжевых узлов */
    @keyframes nodePulse {
      0% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(2.2); opacity: 1; }
      100% { transform: scale(1); opacity: 0.3; }
    }

    .pulse-orange-node {
      animation: nodePulse 2.5s infinite ease-in-out;
    }

    /* Стилизация координат */
    .tech-label-local {
      position: absolute;
      font-family: 'Source Code Pro', monospace;
      font-size: 7.5px;
      color: #94A3B8;
      opacity: 0.55;
      pointer-events: none;
      white-space: nowrap;
      letter-spacing: 0.5px;
    }

    /* 1. Делаем контейнеры Tilda прозрачными */
    .t-records,
    #allrecords,
    .t-records > .r,
    .t-records > .r .t396__artboard,
    .t-records > .r .t396__carrier {
      background-color: transparent !important;
      background-image: none !important;
    }

    /* 2. СПИСОК ИСКЛЮЧЕНИЙ */
    #rec2458600001 {
      background-color: var(--bg) !important;
    }
  `;
  document.head.appendChild(style);

  const initGlobalBg = () => {
    const allrecords = document.getElementById("allrecords");
    if (!allrecords) return;

    if (allrecords.dataset.globalGridBgInitialized) return;
    allrecords.dataset.globalGridBgInitialized = 'true';

    // Ищем или создаем контейнер фона
    let bgContainer = document.getElementById('global-grid-bg');
    if (!bgContainer) {
      bgContainer = document.createElement('div');
      bgContainer.className = 'site-technical-background';
      bgContainer.id = 'global-grid-bg';
      
      const lines = document.createElement('div');
      lines.id = 'global-grid-lines';
      Object.assign(lines.style, {
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: '2'
      });
      bgContainer.appendChild(lines);
    }

    // Вставляем контейнер в самое начало #allrecords
    allrecords.insertBefore(bgContainer, allrecords.firstChild);

    const grid = document.getElementById('global-grid-lines');
    const BASE_W = 1335, GRID_W = 1314, G = (BASE_W - GRID_W) / 2;

    function D(style, parent) {
      const d = document.createElement('div');
      for (const [k,v] of Object.entries(style)) d.style[k]=v;
      if (parent) parent.appendChild(d);
      return d;
    }

    // Вертикальные линии разреженной сетки
    const wVals = [1314, 910, 506, 102];
    
    // Сетка для расстановки точек
    const wDots = [1314, 1112, 910, 708, 506, 304, 102];

    const buildGrid = (gridH, s) => {
      grid.innerHTML = '';
      
      const blocks = Array.from(allrecords.querySelectorAll('.r'));
      const blockMargin = 70; // Сохраняем оригинальный отступ 70px для сетки внутри блоков

      const allDrawnHorizontalLines = [];
      const blocksData = [];

      // 1. РАССЧИТЫВАЕМ ДИАПАЗОНЫ СЕТКИ ДЛЯ КАЖДОГО БЛОКА С БАЗОВЫМ ОТСТУПОМ 70px
      blocks.forEach(block => {
        if (block.id === 'global-grid-bg' || block.classList.contains('site-technical-background')) return;
        
        const rect = block.getBoundingClientRect();
        const blockTopScaled = (rect.top + window.scrollY) / s;
        const blockHeightScaled = rect.height / s;
        const blockBottomScaled = blockTopScaled + blockHeightScaled;
        
        if (block.id === 'rec2458600001') {
          blocksData.push({ id: block.id, isHero: true, top: blockTopScaled, bottom: blockBottomScaled });
          return;
        }

        if (blockHeightScaled <= blockMargin * 2) return;

        blocksData.push({
          id: block.id,
          isHero: false,
          yStart: blockTopScaled + blockMargin,
          yEnd: blockBottomScaled - blockMargin,
          top: blockTopScaled,
          bottom: blockBottomScaled
        });
      });

      // 2. ДИНАМИЧЕСКИ КОРРЕКТИРУЕМ ГРАНИЦЫ НА СТЫКАХ ДЛЯ СОЗДАНИЯ РОВНОГО ОКНА В 100px
      const nonHeroBlocks = blocksData.filter(b => !b.isHero);
      nonHeroBlocks.sort((a, b) => a.top - b.top);

      for (let i = 0; i < nonHeroBlocks.length - 1; i++) {
        const A = nonHeroBlocks[i];
        const B = nonHeroBlocks[i + 1];
        
        // Если расстояние между блоками меньше 150px (с учетом Tilda-отступов)
        if (B.top - A.bottom < 150) {
          const mid = (A.bottom + B.top) / 2;
          A.yEnd = mid - 50;   // Сетка верхнего блока кончается ровно за 50px до центра стыка
          B.yStart = mid + 50;  // Сетка нижнего блока начинается ровно через 50px после центра стыка
        }
      }

      // 3. РИСУЕМ РАМКИ И СЕТКУ ДЛЯ КАЖДОГО БЛОКА ИНДИВИДУАЛЬНО
      blocksData.forEach(bData => {
        if (bData.isHero) return;

        // Рисуем верхнюю горизонтальную границу блока
        D({
          position: 'absolute',
          top: bData.yStart + 'px',
          left: G + 'px',
          width: GRID_W + 'px',
          height: '1px',
          background: 'var(--border-faint)'
        }, grid);
        allDrawnHorizontalLines.push(bData.yStart);

        // Рисуем нижнюю горизонтальную границу блока
        D({
          position: 'absolute',
          top: bData.yEnd + 'px',
          left: G + 'px',
          width: GRID_W + 'px',
          height: '1px',
          background: 'var(--border-faint)'
        }, grid);
        allDrawnHorizontalLines.push(bData.yEnd);

        // Рисуем внутренние горизонтальные линии (шаг 180px)
        // Строим линии относительно yStart, с безопасным отступом в 45px до нижней границы (yEnd)
        const step = 180;
        const minBottomPadding = 45;
        for (let y = bData.yStart + step; y <= bData.yEnd - minBottomPadding; y += step) {
          D({
            position: 'absolute',
            top: y + 'px',
            left: G + 'px',
            width: GRID_W + 'px',
            height: '1px',
            background: 'var(--border-faint)'
          }, grid);
          allDrawnHorizontalLines.push(y);
        }

        // Рисуем вертикальные линии СТРОГО от верхней до нижней границы (yStart -> yEnd)
        wVals.forEach(w => {
          const L = G + (GRID_W - w) / 2;
          const R = L + w;
          
          D({
            position: 'absolute',
            top: bData.yStart + 'px',
            left: L + 'px',
            width: '1px',
            height: (bData.yEnd - bData.yStart) + 'px',
            borderLeft: '1px solid var(--border-faint)'
          }, grid);
          
          D({
            position: 'absolute',
            top: bData.yStart + 'px',
            left: R + 'px',
            width: '1px',
            height: (bData.yEnd - bData.yStart) + 'px',
            borderLeft: '1px solid var(--border-faint)'
          }, grid);
        });
      });

      // 4. СОЕДИНЯЕМ СМЕЖНЫЕ БЛОКИ 4-МЯ ВЕРТИКАЛЬНЫМИ ЛИНИЯМИ В ПРОМЕЖУТКАХ
      for (let i = 0; i < nonHeroBlocks.length - 1; i++) {
        const A = nonHeroBlocks[i];
        const B = nonHeroBlocks[i + 1];
        
        if (B.top - A.bottom < 150) {
          const wConnect = [1314, 910]; // Две внешние пары вертикальных линий
          wConnect.forEach(w => {
            const L = G + (GRID_W - w) / 2;
            const R = L + w;
            
            // Левая линия
            D({
              position: 'absolute',
              top: A.yEnd + 'px',
              left: L + 'px',
              width: '1px',
              height: (B.yStart - A.yEnd) + 'px',
              borderLeft: '1px solid var(--border-faint)'
            }, grid);
            
            // Правая линия
            D({
              position: 'absolute',
              top: A.yEnd + 'px',
              left: R + 'px',
              width: '1px',
              height: (B.yStart - A.yEnd) + 'px',
              borderLeft: '1px solid var(--border-faint)'
            }, grid);
          });
        }
      }

      // 5. ТОЧКИ И КООРДИНАТЫ (рассыпаем по пересечениям нарисованных линий)
      const intersections = [];
      wDots.forEach(w => {
        const L = G + (GRID_W - w) / 2;
        const R = L + w;
        allDrawnHorizontalLines.forEach(y => {
          intersections.push({ x: L, y: y });
          intersections.push({ x: R, y: y });
        });
      });

      const uniqueIntersections = [];
      const seen = new Set();
      intersections.forEach(pt => {
        const key = `${Math.round(pt.x)},${Math.round(pt.y)}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueIntersections.push(pt);
        }
      });

      uniqueIntersections.forEach(pt => {
        const hash = Math.abs(Math.round(pt.x) * 17 + Math.round(pt.y) * 31) % 100;
        
        let bg = '#CBD5E1';
        let isOrange = false;
        let isPulsing = false;
        
        if (hash < 10) { // Пульсирующие оранжевые
          bg = 'var(--heat-100)';
          isOrange = true;
          isPulsing = true;
        } else if (hash < 18) { // Статичные оранжевые
          bg = 'var(--heat-100)';
          isOrange = true;
        }

        const nodeEl = D({
          position: 'absolute',
          left: (pt.x - 1.5) + 'px',
          top: (pt.y - 1.5) + 'px',
          width: '3px',
          height: '3px',
          background: bg,
          borderRadius: '50%',
          zIndex: '3',
          transformOrigin: 'center'
        }, grid);
        
        if (isPulsing) {
          nodeEl.classList.add('pulse-orange-node');
          const seed = Math.sin(pt.x * 12.9898 + pt.y * 78.233) * 43758.5453;
          const randomDelay = (seed - Math.floor(seed)) * 3.0;
          nodeEl.style.animationDelay = randomDelay + 's';
        }

        // Подписи координат (приподняты над линией на 11px)
        if (isOrange && hash < 6) {
          const lbl = document.createElement('div');
          lbl.className = 'tech-label-local';
          lbl.style.left = (pt.x + 6) + 'px';
          lbl.style.top = (pt.y - 11) + 'px';
          
          const gridX = Math.round((pt.x - G) / 101) * 102;
          const gridY = Math.round(pt.y / 101) * 102;
          lbl.textContent = `[x:${gridX} / y:${gridY}]`;
          grid.appendChild(lbl);
        }
      });
    };

    const resize = () => {
      const vw = document.documentElement.clientWidth;
      const s = vw / BASE_W;
      const margin = 120; // Отступ 120px для симметрии краев
      
      // Обрезаем фон первого экрана ровно на 120px, чтобы стык был идеально симметричным
      const heroBlock = document.getElementById('rec2458600001');
      if (heroBlock) {
        const heroWrapper = heroBlock.firstChild;
        if (heroWrapper && heroWrapper.style) {
          const pixelClip = margin * s;
          heroWrapper.style.clipPath = `inset(0px 0px ${pixelClip}px 0px)`;
        }
      }
      
      const h = Math.max(
          document.body.scrollHeight, 
          document.body.offsetHeight, 
          document.documentElement.clientHeight, 
          document.documentElement.scrollHeight, 
          document.documentElement.offsetHeight
      );
      
      const ch = h / s;
      
      bgContainer.style.height = `${h}px`;
      
      grid.style.transform = `scale(${s})`;
      grid.style.transformOrigin = 'top center';
      grid.style.width = BASE_W + 'px';
      grid.style.position = 'absolute';
      grid.style.left = '50%';
      grid.style.marginLeft = (-BASE_W / 2) + 'px';
      grid.style.top = '0';
      grid.style.height = ch + 'px';

      buildGrid(ch, s);
    };

    window.addEventListener('resize', resize);
    resize();
    
    window.addEventListener('load', () => {
        setTimeout(resize, 1000);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalBg);
  } else {
    initGlobalBg();
  }
})();
