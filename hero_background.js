(() => {
  // Захватываем текущий элемент скрипта в момент его выполнения
  const currentScript = document.currentScript;

  const initBackground = () => {
    // Находим ближайший родительский блок Tilda
    const targetBlock = currentScript ? (currentScript.closest('.t-rec') || currentScript.closest('.r') || currentScript.parentElement) : null;
    if (!targetBlock) {
      setTimeout(initBackground, 100);
      return;
    }

    if (targetBlock.dataset.gridBgInitialized) return;
    targetBlock.dataset.gridBgInitialized = 'true';

    const blockId = targetBlock.id || 'rec2458600001';

    // Внедряем стили CSS динамически для текущего блока
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --border-faint: #E2E8F0;
        --heat-100: #FF7200;
        --bg: #FBFBFB;
      }
      @keyframes nodePulse {
        0% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(2.0); opacity: 1; }
        100% { transform: scale(1); opacity: 0.4; }
      }
      .pulse-orange-node { 
        animation: nodePulse 2.5s infinite ease-in-out; 
      }

      /* Автоматически сжимаем контейнер кода до 0 на живом сайте, */
      /* чтобы он не мешал кликать по кнопкам и ссылкам */
      #${blockId} [data-elem-id="1783748685453"] {
        width: 0px !important;
        height: 0px !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    // Находим контейнер артборда или обертку блока

    const container = targetBlock.querySelector('.t396__artboard') || 
                      targetBlock.querySelector('.t-cover__carrier') ||
                      targetBlock.querySelector('.t-cover') ||
                      targetBlock;

    if (container) {
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === 'static') {
        container.style.position = 'relative';
      }
      
      const carrier = container.querySelector('.t396__carrier');
      if (carrier) {
        carrier.style.background = 'transparent';
        carrier.style.backgroundImage = 'none';
      }
    }

    // Применяем настройки к главному блоку Tilda
    targetBlock.style.backgroundColor = 'var(--bg)';
    targetBlock.style.position = 'relative';
    targetBlock.style.overflow = 'visible'; // Позволяет фону выходить вверх и вниз

    // Создаем обертку для интерактивного фона
    const bgWrapper = document.createElement('div');
    Object.assign(bgWrapper.style, {
      position: 'absolute',
      left: '0',
      width: '100%',
      overflow: 'hidden', // Обрезает сетку по бокам, предотвращая горизонтальный скролл
      pointerEvents: 'none',
      zIndex: '0' 
    });

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '1'
    });

    const grid = document.createElement('div');
    Object.assign(grid.style, {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '2'
    });

    bgWrapper.appendChild(canvas);
    bgWrapper.appendChild(grid);

    // Вставляем фон в самое начало контейнера Zero Block
    if (container) {
      container.insertBefore(bgWrapper, container.firstChild);
    }

    const NS = 'http://www.w3.org/2000/svg';
    const BASE_W = 1335, GRID_W = 1314, G = (BASE_W - GRID_W) / 2, TOP = 100, SQ = 102;
    const ctx = canvas.getContext('2d');

    if (!ctx.roundRect) ctx.roundRect = function(x,y,w,h,r) {
      if (typeof r==='number') r={tl:r,tr:r,br:r,bl:r};
      ctx.moveTo(x+r.tl,y);ctx.lineTo(x+w-r.tr,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r.tr);
      ctx.lineTo(x+w,y+h-r.br);ctx.quadraticCurveTo(x+w,y+h,x+w-r.br,y+h);
      ctx.lineTo(x+r.bl,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r.bl);
      ctx.lineTo(x,y+r.tl);ctx.quadraticCurveTo(x,y,x+r.tl,y);ctx.closePath();
    };

    function D(style, parent) {
      const d = document.createElement('div');
      for (const [k,v] of Object.entries(style)) d.style[k]=v;
      if (parent) parent.appendChild(d);
      return d;
    }
    
    function SE(tag, attrs) {
      const e = document.createElementNS(NS, tag);
      for (const [k,v] of Object.entries(attrs)) {
        if (k==='style') for (const [sk,sv] of Object.entries(v)) e.style[sk]=sv;
        else e.setAttribute(k,v);
      }
      return e;
    }

    function curvy(x, y, w, h, corners) {
      D({position:'absolute',left:x+'px',top:y+'px',width:w+'px',height:h+'px',pointerEvents:'none'}, grid);
    }

    const l910 = G+(GRID_W-910)/2, l708 = G+(GRID_W-708)/2;
    const CHARS = '0123456789abcdefABCDEF{}[]();:<>+*/@#.';

    function makeAnim(type, gx, gy) {
      const x=gx+4, y=gy+4, w2=94, h2=94, b={type,x,y,w:w2,h:h2,t:0};
      switch(type) {
        case 'chars': {
          const phrases = [
            'поиск документов',
            'анализ чертежей',
            'написание инструкций',
            'сканирование архива',
            'поиск файлов',
            'сверка данных',
            'импорт таблиц',
            'экспорт отчетов'
          ];
          const idx = Math.floor(Math.random() * phrases.length);
          const startMode = Math.random() < 0.4 ? 'type' : (Math.random() < 0.5 ? 'hold' : 'delete');
          const startCharIdx = startMode === 'hold' ? phrases[idx].length : Math.floor(Math.random() * phrases[idx].length);
          return {
            ...b,
            phrases: phrases,
            phraseIdx: idx,
            charIdx: startCharIdx,
            mode: startMode,
            delay: Math.floor(Math.random() * 60),
            cursorBlink: Math.random() * 10,
            isGrey: false
          };
        }
        case 'doc': {
          return{...b,type: 'doc',timer:0,scanY:10,scanDir:1};
        }
        case 'dots': {
          const p=[];
          for(let r=0;r<3;r++) {
            for(let c=0;c<3;c++) {
              p.push({cx:25+c*22,cy:25+r*22,ph:Math.random()*Math.PI*2,sp:0.02+Math.random()*0.03});
            }
          }
          return{...b,dots:p};
        }
        case 'flow': {
          const p=[];
          for(let i=0;i<2;i++) {
            p.push({cx:10+Math.random()*70,cy:30+i*30,sp:0.4+Math.random()*0.5,size:1.5+Math.random()*1,ph:Math.random()*Math.PI});
          }
          return{...b,particles:p};
        }
        case 'morph': {
          const sqs = [];
          for (let i = 0; i < 12; i++) {
            sqs.push({
              cx: 15 + Math.random() * 64,
              cy: 15 + Math.random() * 64,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8,
              isOrange: Math.random() < 0.35,
              size: 4 + Math.random() * 3
            });
          }
          return {...b, type: 'morph', timer: Math.random() * 12, runSquares: sqs};
        }
        case 'staticDot': {
          return {...b, type: 'staticDot', ph: Math.random() * Math.PI * 2};
        }
        case 'runningSqs': {
          const sqs = [];
          for (let i = 0; i < 12; i++) {
            sqs.push({
              cx: 15 + Math.random() * 64,
              cy: 15 + Math.random() * 64,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8,
              isOrange: Math.random() < 0.35,
              size: 4 + Math.random() * 3
            });
          }
          return {...b, type: 'runningSqs', runSquares: sqs};
        }
        default: return b;
      }
    }

    let anims = [];
    function drawAnims(dt) {
      for (const a of anims) {
        const {x, y, w, h} = a;
        a.t += dt;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4);
        ctx.clip();
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'rgba(226,232,240,0.45)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, w, h);

        switch(a.type) {
          case 'chars': {
            a.cursorBlink += dt * 0.05;
            const showCursor = Math.sin(a.cursorBlink) > 0;
            a.delay += dt;
            const currentPhrase = a.phrases[a.phraseIdx];
            
            if (a.mode === 'type') {
              if (a.delay >= 8) {
                a.delay = 0;
                a.charIdx++;
                if (a.charIdx >= currentPhrase.length) {
                  a.mode = 'hold';
                  a.charIdx = currentPhrase.length;
                }
              }
            } else if (a.mode === 'hold') {
              if (a.delay >= 90) {
                a.delay = 0;
                a.mode = 'delete';
              }
            } else if (a.mode === 'delete') {
              if (a.delay >= 4) {
                a.delay = 0;
                a.charIdx--;
                if (a.charIdx <= 0) {
                  a.charIdx = 0;
                  a.mode = 'type';
                  a.phraseIdx = (a.phraseIdx + 1) % a.phrases.length;
                }
              }
            }
            
            const typedText = '>' + currentPhrase.substring(0, a.charIdx) + (showCursor ? '_' : ' ');
            ctx.font = '8px monospace';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.fillStyle = a.isGrey ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 114, 0, 0.85)';
            ctx.fillText(typedText, x + 8, y + h / 2);
            break;
          }
          case 'doc': {
            const dx = x + 30, dy = y + 20, dw = 34, dh = 54;
            a.timer += (dt / 60);
            if (a.timer >= 12) a.timer = 0;
            
            const phase = Math.floor(a.timer / 3);
            const phaseTime = a.timer % 3;
            
            let alpha = 1;
            if (phaseTime < 0.5) {
              alpha = phaseTime / 0.5;
            } else if (phaseTime > 2.5) {
              alpha = (3 - phaseTime) / 0.5;
            }
            alpha = Math.max(0, Math.min(1, alpha));

            ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dx, dy);
            ctx.lineTo(dx + dw - 8, dy);
            ctx.lineTo(dx + dw, dy + 8);
            ctx.lineTo(dx + dw, dy + dh);
            ctx.lineTo(dx, dy + dh);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(dx + dw - 8, dy);
            ctx.lineTo(dx + dw - 8, dy + 8);
            ctx.lineTo(dx + dw, dy + 8);
            ctx.stroke();

            if (phase === 1) {
              ctx.strokeStyle = `rgba(255, 114, 0, ${alpha * 0.45})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 18); ctx.lineTo(dx + dw - 6, dy + 18); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 28); ctx.lineTo(dx + dw - 12, dy + 28); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 38); ctx.lineTo(dx + dw - 8, dy + 38); ctx.stroke();
            } else if (phase === 2) {
              ctx.strokeStyle = `rgba(255, 114, 0, ${alpha * 0.65})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 18); ctx.lineTo(dx + dw - 6, dy + 18); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 28); ctx.lineTo(dx + dw - 12, dy + 28); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 38); ctx.lineTo(dx + dw - 8, dy + 38); ctx.stroke();

              a.scanY += a.scanDir * dt * 0.45;
              if (a.scanY > dh - 8) a.scanDir = -1;
              if (a.scanY < 8) a.scanDir = 1;
              
              const sy = dy + a.scanY;
              ctx.strokeStyle = `rgba(255, 114, 0, ${alpha * 0.6})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(dx + 3, sy);
              ctx.lineTo(dx + dw - 3, sy);
              ctx.stroke();
            } else if (phase === 3) {
              ctx.strokeStyle = `rgba(255, 114, 0, ${alpha * 0.3})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 18); ctx.lineTo(dx + dw - 6, dy + 18); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 28); ctx.lineTo(dx + dw - 12, dy + 28); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(dx + 6, dy + 38); ctx.lineTo(dx + dw - 8, dy + 38); ctx.stroke();

              ctx.strokeStyle = `rgba(255, 114, 0, ${alpha * 0.85})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(dx + 11, dy + 30);
              ctx.lineTo(dx + 16, dy + 35);
              ctx.lineTo(dx + 24, dy + 23);
              ctx.stroke();
            }
            break;
          }
          case 'dots':
            for(const d of a.dots){
              d.ph+=d.sp*dt;
              const op=0.2+Math.max(0,Math.sin(d.ph))*0.45;
              ctx.fillStyle=`rgba(255,114,0,${op})`;ctx.beginPath();ctx.arc(x+d.cx,y+d.cy,2,0,Math.PI*2);ctx.fill();
            }
            break;
          case 'flow':
            ctx.strokeStyle='rgba(226,232,240,0.5)';ctx.lineWidth=0.5;
            ctx.beginPath();ctx.moveTo(x+10,y+30);ctx.lineTo(x+w-10,y+30);ctx.stroke();
            ctx.beginPath();ctx.moveTo(x+10,y+60);ctx.lineTo(x+w-10,y+60);ctx.stroke();
            for(const p of a.particles){
              p.cx+=p.sp*dt;
              if(p.cx>w-10){p.cx=10;p.cy=30+(Math.random()>0.5?0:30);}
              const alpha=Math.sin((p.cx-10)/(w-20)*Math.PI)*0.6;
              ctx.fillStyle=`rgba(255,114,0,${Math.max(0,alpha)})`;
              ctx.beginPath();ctx.arc(x+p.cx,y+p.cy,p.size,0,Math.PI*2);ctx.fill();
            }
            break;
          case 'morph': {
            a.timer += (dt / 60);
            if (a.timer >= 12) a.timer = 0;
            
            const cx = x + w / 2;
            const cy = y + h / 2;
            const phase = Math.floor(a.timer / 3);
            const phaseTime = a.timer % 3;
            
            let alpha = 1;
            if (phaseTime < 0.5) {
              alpha = phaseTime / 0.5;
            } else if (phaseTime > 2.5) {
              alpha = (3 - phaseTime) / 0.5;
            }
            alpha = Math.max(0, Math.min(1, alpha));
            
            if (phase === 0 || phase === 3) {
              const scale = 1 + Math.sin(a.t * 0.08) * 0.25;
              const rad = 4 * scale;
              ctx.fillStyle = `rgba(203, 213, 225, ${alpha * 0.85})`;
              ctx.beginPath();
              ctx.arc(cx, cy, rad, 0, Math.PI * 2);
              ctx.fill();
            } else if (phase === 1) {
              ctx.fillStyle = `rgba(203, 213, 225, ${alpha * 0.85})`;
              const sSize = 16;
              const offset = 12;
              ctx.fillRect(cx - offset - sSize/2, cy - offset - sSize/2, sSize, sSize);
              ctx.fillRect(cx + offset - sSize/2, cy - offset - sSize/2, sSize, sSize);
              ctx.fillRect(cx - offset - sSize/2, cy + offset - sSize/2, sSize, sSize);
              ctx.fillRect(cx + offset - sSize/2, cy + offset - sSize/2, sSize, sSize);
            } else if (phase === 2) {
              for (const sq of a.runSquares) {
                sq.cx += sq.vx * dt;
                sq.cy += sq.vy * dt;
                
                const pad = sq.size / 2;
                if (sq.cx < pad || sq.cx > w - pad) sq.vx *= -1;
                if (sq.cy < pad || sq.cy > h - pad) sq.vy *= -1;
                
                sq.cx = Math.max(pad, Math.min(w - pad, sq.cx));
                sq.cy = Math.max(pad, Math.min(h - pad, sq.cy));
                
                ctx.fillStyle = sq.isOrange ? `rgba(255, 114, 0, ${alpha * 0.8})` : `rgba(226, 232, 240, ${alpha * 0.8})`;
                ctx.fillRect(x + sq.cx - sq.size/2, y + sq.cy - sq.size/2, sq.size, sq.size);
              }
            }
            break;
          }
          case 'staticDot': {
            a.ph += 0.03 * dt;
            const scale = 1 + Math.sin(a.ph) * 0.25;
            const rad = 4 * scale;
            const alpha = 0.35 + Math.max(0, Math.sin(a.ph)) * 0.4;
            ctx.fillStyle = `rgba(203, 213, 225, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, rad, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'runningSqs': {
            for (const sq of a.runSquares) {
              sq.cx += sq.vx * dt;
              sq.cy += sq.vy * dt;
              
              const pad = sq.size / 2;
              if (sq.cx < pad || sq.cx > w - pad) sq.vx *= -1;
              if (sq.cy < pad || sq.cy > h - pad) sq.vy *= -1;
              
              sq.cx = Math.max(pad, Math.min(w - pad, sq.cx));
              sq.cy = Math.max(pad, Math.min(h - pad, sq.cy));
              
              ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
              ctx.fillRect(x + sq.cx - sq.size/2, y + sq.cy - sq.size/2, sq.size, sq.size);
            }
            break;
          }
        }
        ctx.restore();
      }
    }

    function build(gridH) {
      grid.innerHTML = '';
      const BOT = TOP + gridH;

      D({position:'absolute',top:TOP+'px',left:G+'px',width:GRID_W+'px',height:gridH+'px',
         border:'1px solid var(--border-faint)'}, grid);

      [1314,1112,910,708].forEach(w => {
        const L = G+(GRID_W-w)/2;
        D({position:'absolute',top:TOP+'px',left:L+'px',width:w+'px',height:gridH+'px',
           borderLeft:'1px solid var(--border-faint)',borderRight:'1px solid var(--border-faint)'}, grid);
      });

      [506,304,102].forEach(w => {
        const L = G+(GRID_W-w)/2;
        D({position:'absolute',top:TOP+'px',left:L+'px',width:w+'px',height:'203px',
           borderLeft:'1px solid var(--border-faint)',borderRight:'1px solid var(--border-faint)'}, grid);
        D({position:'absolute',top:(BOT-203)+'px',left:L+'px',width:w+'px',height:'203px',
           borderLeft:'1px solid var(--border-faint)',borderRight:'1px solid var(--border-faint)'}, grid);
      });

      [0,101,202,303,404,505].forEach(relY => {
        const yTop = TOP + relY;
        D({position:'absolute',top:yTop+'px',left:G+'px',width:'404px',height:'1px',background:'var(--border-faint)'}, grid);
        D({position:'absolute',top:yTop+'px',right:G+'px',width:'404px',height:'1px',background:'var(--border-faint)'}, grid);

        const yBot = BOT - relY;
        D({position:'absolute',top:yBot+'px',left:G+'px',width:'404px',height:'1px',background:'var(--border-faint)'}, grid);
        D({position:'absolute',top:yBot+'px',right:G+'px',width:'404px',height:'1px',background:'var(--border-faint)'}, grid);
      });

      D({position:'absolute',top:(TOP+101)+'px',left:G+'px',width:GRID_W+'px',height:'1px',background:'var(--border-faint)'}, grid);
      D({position:'absolute',top:(TOP+202)+'px',left:G+'px',width:GRID_W+'px',height:'1px',background:'var(--border-faint)'}, grid);
      D({position:'absolute',top:(BOT-101)+'px',left:G+'px',width:GRID_W+'px',height:'1px',background:'var(--border-faint)'}, grid);
      D({position:'absolute',top:(BOT-202)+'px',left:G+'px',width:GRID_W+'px',height:'1px',background:'var(--border-faint)'}, grid);

      curvy(G-101, TOP, 101, gridH, ['br']);
      curvy(G+GRID_W, TOP, 101, gridH, ['bl']);

      const allSquares = [];

      const maxRows = Math.floor(gridH / 101);
      const halfRows = Math.min(6, Math.floor(maxRows / 2));
      const topRows = [];
      for (let i = 0; i < halfRows; i++) {
        topRows.push(i * 101);
      }

      topRows.forEach(relY => {
        const rowIdx = Math.round(relY / 101);
        
        curvy(G-1, TOP+relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G-1,y:TOP+relY});
        curvy(G+GRID_W-101, TOP+relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+GRID_W-101,y:TOP+relY});
        curvy(G-1, BOT-SQ-relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G-1,y:BOT-SQ-relY});
        curvy(G+GRID_W-101, BOT-SQ-relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+GRID_W-101,y:BOT-SQ-relY});

        if (rowIdx >= 2) {
          curvy(G+101, TOP+relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+101,y:TOP+relY});
          curvy(G+GRID_W-203, TOP+relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+GRID_W-203,y:TOP+relY});
          curvy(G+101, BOT-SQ-relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+101,y:BOT-SQ-relY});
          curvy(G+GRID_W-203, BOT-SQ-relY, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+GRID_W-203,y:BOT-SQ-relY});
        } else {
          curvy(G+101, TOP+relY, SQ, SQ, ['tl','bl']);
          curvy(G+GRID_W-203, TOP+relY, SQ, SQ, ['tr','br']);
          curvy(G+101, BOT-SQ-relY, SQ, SQ, ['tl','bl']);
          curvy(G+GRID_W-203, BOT-SQ-relY, SQ, SQ, ['tr','br']);
        }
      });

      // Ограничиваем отрисовку боковых декоративных рамок по высоте блока
      if (halfRows >= 2) {
        curvy(G-1, TOP, SQ, 203, ['tl','tr','bl','br']);
        curvy(G+GRID_W-101, TOP, SQ, 203, ['tl','tr','bl','br']);
        curvy(G-1, BOT-203, SQ, 203, ['tl','tr','bl','br']);
        curvy(G+GRID_W-101, BOT-203, SQ, 203, ['tl','tr','bl','br']);
      }

      curvy(l910, TOP, 910, gridH, ['bl','br']);
      curvy(l708, TOP, 708, gridH, ['bl','br']);

      [TOP, TOP+101].forEach(y => {
        curvy(G+202, y, SQ, SQ, ['tl','tr','br']); allSquares.push({x:G+202,y:y});
        curvy(G+GRID_W-304, y, SQ, SQ, ['tl','tr','bl']); allSquares.push({x:G+GRID_W-304,y:y});
        [303,404,505,606,707].forEach(ox => {
          curvy(G+ox, y, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+ox,y:y});
          curvy(G+GRID_W-ox-102, y, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+GRID_W-ox-102,y:y});
        });
      });

      [BOT - SQ, BOT - SQ - 101].forEach(y => {
        curvy(G+202, y, SQ, SQ, ['tl','tr','br']); allSquares.push({x:G+202,y:y});
        curvy(G+GRID_W-304, y, SQ, SQ, ['tl','tr','bl']); allSquares.push({x:G+GRID_W-304,y:y});
        [303,404,505,606,707].forEach(ox => {
          curvy(G+ox, y, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+ox,y:y});
          curvy(G+GRID_W-ox-102, y, SQ, SQ, ['tl','tr','bl','br']); allSquares.push({x:G+GRID_W-ox-102,y:y});
        });
      });

      const gridLinesX = [0, 101, 202, 303, 404, 505, 606, 708, 809, 910, 1011, 1112, 1213, 1314];
      const snapX = (x) => {
        const offset = x - G;
        let closest = gridLinesX[0];
        let minDist = Math.abs(offset - closest);
        for (let i = 1; i < gridLinesX.length; i++) {
          const dist = Math.abs(offset - gridLinesX[i]);
          if (dist < minDist) {
            minDist = dist;
            closest = gridLinesX[i];
          }
        }
        return G + closest;
      };
      const snapY = (y) => {
        if (Math.abs(y - TOP) < Math.abs(y - BOT)) {
          return TOP + Math.round((y - TOP) / 101) * 101;
        } else {
          return BOT - Math.round((BOT - y) / 101) * 101;
        }
      };

      const nodesSet = new Set();
      allSquares.forEach(sq => {
        nodesSet.add(`${snapX(sq.x)},${snapY(sq.y)}`);
        nodesSet.add(`${snapX(sq.x + 101)},${snapY(sq.y)}`);
        nodesSet.add(`${snapX(sq.x)},${snapY(sq.y + 101)}`);
        nodesSet.add(`${snapX(sq.x + 101)},${snapY(sq.y + 101)}`);
      });
      
      nodesSet.add(`${snapX(l708)},${snapY(TOP+202)}`);
      nodesSet.add(`${snapX(l708+708)},${snapY(TOP+202)}`);
      nodesSet.add(`${snapX(l708)},${snapY(BOT-202)}`);
      nodesSet.add(`${snapX(l708+708)},${snapY(BOT-202)}`);

      nodesSet.forEach(coord => {
        const [nx, ny] = coord.split(',').map(Number);
        const hash = Math.abs(nx * 17 + ny * 31) % 100;
        
        let bg = '#CBD5E1';
        let isOrange = false;
        let isPulsing = false;
        
        if (hash < 10) {
          bg = 'var(--heat-100)';
          isOrange = true;
          isPulsing = true;
        } else if (hash < 20) {
          bg = 'var(--heat-100)';
          isOrange = true;
        }
        
        const nodeEl = D({
          position: 'absolute',
          left: (nx - 1.5) + 'px',
          top: (ny - 1.5) + 'px',
          width: '3px',
          height: '3px',
          background: bg,
          borderRadius: '50%',
          zIndex: '3',
          transformOrigin: 'center'
        }, grid);
        
        if (isPulsing) {
          nodeEl.classList.add('pulse-orange-node');
          nodeEl.style.animationDelay = ((Math.abs(nx * 7 + ny * 13) % 25) / 10) + 's';
        }
      });

      const crossPath = 'M24 18C24 21.3137 26.6863 24 30 24H34V25H30C26.6863 25 24 27.6863 24 31V35H23V31C23 27.6863 20.3137 25 17 25H13V24H17C20.3137 24 23 21.3137 23 18V14H24V18Z';
      function badge(bx, by) {
        const wrap = D({position:'absolute',left:bx+'px',top:by+'px',width:'47px',height:'47px',zIndex:'4'}, grid);
        const svg = SE('svg',{width:'47',height:'47',viewBox:'0 0 47 47',fill:'none'});
        svg.appendChild(SE('path',{d:crossPath,fill:'var(--heat-100)','fill-opacity':'1'}));
        svg.appendChild(SE('circle',{cx:'23.5',cy:'23.5',r:'23',stroke:'#EDEDED','stroke-opacity':'1'}));
        wrap.appendChild(svg);
      }
      
      badge(l708-24, TOP+179);
      badge(l708+708-23, TOP+179);
      badge(l708+708-23, BOT-225);

      const selectedAnims = [];
      let firstMorph = null;
      for (const sq of allSquares) {
        const col = Math.round((sq.x - (G-1)) / 101);
        const isTop = sq.y < (TOP + gridH / 2);
        const row = isTop ? Math.round((sq.y - TOP) / 101) : -1;
        const rowBot = !isTop ? Math.round((BOT - SQ - sq.y) / 101) : -1;
        
        let match = false;
        let animType = '';
        
        if (isTop) {
          if (col === 0 && row === 0) { match = true; animType = 'chars'; }
          if (col === 10 && row === 1) { match = true; animType = 'doc'; }
          if (col === 2 && row === 4) { match = true; animType = 'dots'; }
          if (col === 4 && row === 0) { match = true; animType = 'flow'; }
          if (col === 12 && row === 4) { match = true; animType = 'runningSqs'; }
          
          if (col === 1 && row === 1) { match = true; animType = 'staticDot'; }
          if (col === 11 && row === 0) { match = true; animType = 'staticDot'; }
          if (col === 0 && row === 3) { match = true; animType = 'staticDot'; }
        } else {
          if (col === 12 && rowBot === 0) { match = true; animType = 'chars'; }
          if (col === 1 && rowBot === 1) { match = true; animType = 'doc'; }
          if (col === 11 && rowBot === 3) { match = true; animType = 'morph'; }
          if (col === 0 && rowBot === 2) { match = true; animType = 'morph'; }
          
          if (col === 2 && rowBot === 0) { match = true; animType = 'staticDot'; }
          if (col === 10 && rowBot === 2) { match = true; animType = 'staticDot'; }
          
          if (col === 2 && rowBot === 1) {
            const aObj = makeAnim('chars', sq.x, sq.y);
            aObj.isGrey = true;
            selectedAnims.push(aObj);
          }
        }
        
        if (match) {
          const aObj = makeAnim(animType, sq.x, sq.y);
          if (animType === 'morph') {
            if (!firstMorph) {
              aObj.timer = Math.random() * 12;
              firstMorph = aObj;
            } else {
              aObj.timer = (firstMorph.timer + 3) % 12;
            }
          }
          selectedAnims.push(aObj);
        }
      }

      const seen = new Set();
      const uniqueAnims = [];
      for (const a of selectedAnims) {
        const key = `${a.x},${a.y}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueAnims.push(a);
        }
      }
      anims = uniqueAnims;
    }

    let lt = performance.now();
    function loop(now) { 
      const dt = Math.min((now - lt) / 16.667, 3); 
      lt = now; 
      ctx.clearRect(0, 0, BASE_W, 3000); 
      drawAnims(dt); 
      requestAnimationFrame(loop); 
    }

    function resize() {
      // Измеряем высоту контейнера, так как фон находится внутри него
      const vh = container.clientHeight;
      
      // Отключаем растягивание (масштабирование), фиксируем s = 1
      const s = 1; 
      
      const gH = Math.max(1010, Math.ceil((vh - TOP - 100) / 101) * 101);
      const dpr = 2, ch = TOP + gH + 100;
      canvas.width = BASE_W * dpr; canvas.height = ch * dpr; canvas.style.width = BASE_W + 'px'; canvas.style.height = ch + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.transform = 'none'; canvas.style.left = '50%'; canvas.style.marginLeft = (-BASE_W / 2) + 'px';
      grid.style.transform = 'none'; grid.style.width = BASE_W + 'px';
      grid.style.position = 'absolute'; grid.style.left = '50%'; grid.style.marginLeft = (-BASE_W / 2) + 'px'; grid.style.top = '0'; grid.style.height = ch + 'px';
      
      // Смещаем фон чуть выше (-TOP), чтобы он заходил на меню сверху
      const offsetTop = -TOP;
      bgWrapper.style.top = offsetTop + 'px';
      // Задаем обертке высоту, которая полностью покроет сетку вместе со смещением
      bgWrapper.style.height = ch + 'px';
      
      // Динамически настраиваем маску для плавного затухания opacity к низу контейнера
      const fadeStart = TOP + vh * 0.6;
      const fadeEnd = TOP + vh;
      bgWrapper.style.webkitMaskImage = `linear-gradient(to bottom, #000 ${fadeStart}px, transparent ${fadeEnd}px)`;
      bgWrapper.style.maskImage = `linear-gradient(to bottom, #000 ${fadeStart}px, transparent ${fadeEnd}px)`;
      
      build(gH);
    }
    
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(loop);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
  } else {
    initBackground();
  }
})();
