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

    /* 1. Делаем контейнеры Tilda прозрачными, кроме первого блока и блоков с классом .uc-keep-bg */
    .t-records,
    #allrecords,
    .t-records > .r:not(:first-of-type):not(.uc-keep-bg),
    .t-records > .r:not(:first-of-type):not(.uc-keep-bg) .t396__artboard:not(.uc-keep-bg),
    .t-records > .r:not(:first-of-type):not(.uc-keep-bg) .t396__carrier {
      background-color: transparent !important;
      background-image: none !important;
    }

    /* 2. Принудительно задаем первому экрану (Hero) фоновый цвет сайта */
    .t-records > .r:first-of-type,
    .t-records > .r:first-of-type .t396__artboard,
    .t-records > .r:first-of-type .t396__carrier {
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

    const getBlockSeed = (id) => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const NS = 'http://www.w3.org/2000/svg';
    function SE(tag, attrs) {
      const e = document.createElementNS(NS, tag);
      for (const [k,v] of Object.entries(attrs)) {
        if (k==='style') for (const [sk,sv] of Object.entries(v)) e.style[sk]=sv;
        else e.setAttribute(k,v);
      }
      return e;
    }

    const crossPath = 'M24 18C24 21.3137 26.6863 24 30 24H34V25H30C26.6863 25 24 27.6863 24 31V35H23V31C23 27.6863 20.3137 25 17 25H13V24H17C20.3137 24 23 21.3137 23 18V14H24V18Z';
    function badge(bx, by) {
      const wrap = D({position:'absolute',left:bx+'px',top:by+'px',width:'47px',height:'47px',zIndex:'4'}, grid);
      const svg = SE('svg',{width:'47',height:'47',viewBox:'0 0 47 47',fill:'none'});
      svg.appendChild(SE('path',{d:crossPath,fill:'var(--heat-100)','fill-opacity':'1'}));
      svg.appendChild(SE('circle',{cx:'23.5',cy:'23.5',r:'23',stroke:'#EDEDED','stroke-opacity':'1'}));
      wrap.appendChild(svg);
    }

    const buildGrid = (gridH, s) => {
      grid.innerHTML = '';
      
      const blocks = Array.from(allrecords.querySelectorAll('.r'));
      const blockMargin = 70; // Отступ 70px для сетки внутри блоков

      const blocksData = [];

      // 1. РАССЧИТЫВАЕМ ДИАПАЗОНЫ СЕТКИ ДЛЯ КАЖДОГО БЛОКА (без масштабирования, s = 1)
      const validBlocks = blocks.filter(block => block.id !== 'global-grid-bg' && !block.classList.contains('site-technical-background'));
      
      validBlocks.forEach((block, index) => {
        const rect = block.getBoundingClientRect();
        const blockTopScaled = rect.top + window.scrollY;
        const blockHeightScaled = rect.height;
        const blockBottomScaled = blockTopScaled + blockHeightScaled;
        
        if (index === 0) {
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
        
        if (B.top - A.bottom < 150) {
          const mid = (A.bottom + B.top) / 2;
          A.yEnd = mid - 50;   // Сетка верхнего блока кончается за 50px до центра стыка
          B.yStart = mid + 50;  // Сетка нижнего блока начинается через 50px после центра стыка
        }
      }

      // Фиксированные колонки, которые идут через все блоки и стыки
      // Они в точности продолжают вертикальные линии первого экрана:
      // 0 и 1314 (внешняя рамка), 202 и 1112 (средняя), 505 и 809 (внутренняя)
      const activeCols = [0, 202, 505, 809, 1112, 1314];

      // 3. РИСУЕМ СЕТКУ И ТОЧКИ ДЛЯ КАЖДОГО БЛОКА
      blocksData.forEach(bData => {
        if (bData.isHero) return;

        const seed = getBlockSeed(bData.id);

        // 3.1. Отрисовка длинных вертикальных линий (проходят от yStart до yEnd)
        activeCols.forEach(col => {
          D({
            position: 'absolute',
            top: bData.yStart + 'px',
            left: (G + col) + 'px',
            width: '1px',
            height: (bData.yEnd - bData.yStart) + 'px',
            borderLeft: '1px solid var(--border-faint)'
          }, grid);
        });

        // 3.2. Верхняя и нижняя горизонтальные границы
        D({
          position: 'absolute',
          top: bData.yStart + 'px',
          left: G + 'px',
          width: GRID_W + 'px',
          height: '1px',
          background: 'var(--border-faint)'
        }, grid);

        D({
          position: 'absolute',
          top: bData.yEnd + 'px',
          left: G + 'px',
          width: GRID_W + 'px',
          height: '1px',
          background: 'var(--border-faint)'
        }, grid);

        // 3.3. Паттерн в начале блока (вторая горизонтальная линия на расстоянии 101px)
        // Рисуем ее короткими сегментами (слева от G до G+303, справа от G+1011 до G+1314)
        const topPatternEndY = bData.yStart + 101;
        
        // Левый сегмент горизонтальной линии
        D({
          position: 'absolute',
          top: topPatternEndY + 'px',
          left: G + 'px',
          width: '303px',
          height: '1px',
          background: 'var(--border-faint)'
        }, grid);

        // Правый сегмент горизонтальной линии
        D({
          position: 'absolute',
          top: topPatternEndY + 'px',
          left: (G + 1011) + 'px',
          width: '303px',
          height: '1px',
          background: 'var(--border-faint)'
        }, grid);

        // 3.4. Короткие вертикальные линии внутри стартового паттерна
        // Левая короткая вертикальная линия (на 101px от края)
        D({
          position: 'absolute',
          top: bData.yStart + 'px',
          left: (G + 101) + 'px',
          width: '1px',
          height: '101px',
          borderLeft: '1px solid var(--border-faint)'
        }, grid);

        // Правая короткая вертикальная линия (на 101px от правого края)
        D({
          position: 'absolute',
          top: bData.yStart + 'px',
          left: (G + 1213) + 'px',
          width: '1px',
          height: '101px',
          borderLeft: '1px solid var(--border-faint)'
        }, grid);

        // 3.5. Внутренние горизонтальные линии с большим шагом (404px) для длинных блоков
        const horizSpacing = 404;
        const horizLinesY = [];
        let yHoriz = bData.yStart + 101 + horizSpacing;
        while (yHoriz <= bData.yEnd - 150) {
          D({
            position: 'absolute',
            top: yHoriz + 'px',
            left: G + 'px',
            width: GRID_W + 'px',
            height: '1px',
            background: 'var(--border-faint)'
          }, grid);
          horizLinesY.push(yHoriz);
          yHoriz += horizSpacing;
        }

        // --- Узлы, акценты и подписи координат ---

        // Точки пересечения в начале блока (левый и правый сегменты паттерна)
        const leftXs = [0, 101, 202, 303].map(x => G + x);
        const rightXs = [1011, 1112, 1213, 1314].map(x => G + x);
        const startXCoords = leftXs.concat(rightXs);
        const startYCoords = [bData.yStart, topPatternEndY];

        // Детерминированно выбираем индексы для акцентов на основе сида блока
        const badgeIdx = seed % startXCoords.length;
        const pulseIdx1 = (seed + 2) % startXCoords.length;
        const pulseIdx2 = (seed + 5) % startXCoords.length;
        const coordIdx = (seed + 7) % startXCoords.length;

        startXCoords.forEach((x, colIdx) => {
          startYCoords.forEach((y, rowIdx) => {
            const isBadge = (colIdx === badgeIdx && rowIdx === 0);
            const isPulsing = ((colIdx === pulseIdx1 || colIdx === pulseIdx2) && rowIdx === 1);
            const isCoord = (colIdx === coordIdx && rowIdx === 0);

            if (isBadge) {
              badge(x - 23.5, y - 23.5);
            } else {
              let bg = 'rgba(203, 213, 225, 0.7)';
              if (isPulsing || isCoord) {
                bg = 'var(--heat-100)';
              }

              const nodeEl = D({
                position: 'absolute',
                left: (x - 1.5) + 'px',
                top: (y - 1.5) + 'px',
                width: '3px',
                height: '3px',
                background: bg,
                borderRadius: '50%',
                zIndex: '3',
                transformOrigin: 'center'
              }, grid);

              if (isPulsing) {
                nodeEl.classList.add('pulse-orange-node');
                const seedVal = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
                const randomDelay = (seedVal - Math.floor(seedVal)) * 3.0;
                nodeEl.style.animationDelay = randomDelay + 's';
              }
            }

            if (isCoord) {
              const lbl = document.createElement('div');
              lbl.className = 'tech-label-local';
              lbl.style.left = (x + 6) + 'px';
              lbl.style.top = (y - 11) + 'px';
              
              const gridX = Math.round((x - G) / 101) * 102;
              const gridY = Math.round(y / 101) * 102;
              lbl.textContent = `[x:${gridX} / y:${gridY}]`;
              grid.appendChild(lbl);
            }
          });
        });

        // Деликатные мелкие серые точки на пересечениях внутри длинных блоков
        const bodyYCoords = [bData.yEnd].concat(horizLinesY);
        activeCols.forEach(x => {
          bodyYCoords.forEach(y => {
            D({
              position: 'absolute',
              left: (G + x - 1) + 'px',
              top: (y - 1) + 'px',
              width: '2px',
              height: '2px',
              background: 'rgba(203, 213, 225, 0.65)',
              borderRadius: '50%',
              zIndex: '3'
            }, grid);
          });
        });
      });

      // 4. СОЕДИНЯЕМ СМЕЖНЫЕ БЛОКИ ВСЕМИ 6-Ю ВЕРТИКАЛЬНЫМИ ЛИНИЯМИ В ПРОМЕЖУТКАХ
      const allSortedBlocks = [...blocksData].sort((a, b) => a.top - b.top);
      for (let i = 0; i < allSortedBlocks.length - 1; i++) {
        const A = allSortedBlocks[i];
        const B = allSortedBlocks[i + 1];
        
        const yA = A.isHero ? A.bottom : A.yEnd;
        const yB = B.yStart;
        
        if (B.top - A.bottom < 350) { // Порог стыка увеличен до 350px
          activeCols.forEach(col => {
            D({
              position: 'absolute',
              top: yA + 'px',
              left: (G + col) + 'px',
              width: '1px',
              height: (yB - yA) + 'px',
              borderLeft: '1px solid var(--border-faint)'
            }, grid);
          });
        }
      }
    };

    const resize = () => {
      // Исключаем масштабирование s = 1, чтобы глобальная сетка совпадала с первым экраном
      const s = 1; 
      const margin = 120; // Отступ 120px для симметрии краев
      
      // Находим первый блок на странице динамически (Hero блок)
      const allSorted = Array.from(allrecords.querySelectorAll('.r'))
        .filter(block => block.id !== 'global-grid-bg' && !block.classList.contains('site-technical-background'))
        .sort((a, b) => {
          const rA = a.getBoundingClientRect();
          const rB = b.getBoundingClientRect();
          return (rA.top + window.scrollY) - (rB.top + window.scrollY);
        });
      const heroBlock = allSorted[0];
      
      if (heroBlock) {
        const heroWrapper = heroBlock.firstChild;
        if (heroWrapper && heroWrapper.style) {
          heroWrapper.style.clipPath = `inset(0px 0px ${margin}px 0px)`;
        }
      }
      
      const h = Math.max(
          document.body.scrollHeight, 
          document.body.offsetHeight, 
          document.documentElement.clientHeight, 
          document.documentElement.scrollHeight, 
          document.documentElement.offsetHeight
      );
      
      bgContainer.style.height = `${h}px`;
      
      grid.style.transform = 'none';
      grid.style.width = BASE_W + 'px';
      grid.style.position = 'absolute';
      grid.style.left = '50%';
      grid.style.marginLeft = (-BASE_W / 2) + 'px';
      grid.style.top = '0';
      grid.style.height = h + 'px';

      buildGrid(h, s);
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
