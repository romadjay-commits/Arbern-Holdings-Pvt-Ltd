/**
 * Arbern Holdings Pvt Ltd - Realistic Architectural CAD Background Engine
 * Clean Light Architectural Studio Palette (Matching Official Arbern Letterhead)
 * Real-time Parallax Floor Plans, Perspective Building Wireframes & AutoCAD Crosshair
 */

(function () {
  'use strict';

  // State & Settings
  const state = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    scrollY: 0,
    targetScrollY: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    theme: 'realistic-light', // 'realistic-light' | 'dark-studio'
    showGrid: true,
    showDimensions: true,
    showStructural: true,
    showCrosshair: true,
    pulseTime: 0
  };

  // Color palettes matching Arbern Holdings Letterhead
  const themes = {
    'realistic-light': {
      bg: '#f8fafc',
      gridMajor: 'rgba(203, 213, 225, 0.55)',
      gridMinor: 'rgba(226, 232, 240, 0.45)',
      cadPrimary: '#16a34a',      // Arbern Green
      cadPrimaryGlow: 'rgba(22, 163, 74, 0.25)',
      cadSecondary: '#475569',    // Technical Slate
      cadMuted: 'rgba(100, 116, 139, 0.35)',
      wallFill: 'rgba(241, 245, 249, 0.65)',
      wallStroke: '#334155',     // Crisp Architectural Graphite
      dimColor: 'rgba(180, 83, 9, 0.75)', // Technical Ochre
      dimText: '#92400e',
      roomText: '#0f172a',
      crosshair: 'rgba(22, 163, 74, 0.45)',
      crosshairReticle: '#16a34a',
      highlight: 'rgba(34, 197, 94, 0.12)'
    },
    'dark-studio': {
      bg: '#0d131f',
      gridMajor: 'rgba(51, 65, 85, 0.4)',
      gridMinor: 'rgba(30, 41, 59, 0.3)',
      cadPrimary: '#22c55e',      // Vibrant Green
      cadPrimaryGlow: 'rgba(34, 197, 94, 0.3)',
      cadSecondary: '#94a3b8',
      cadMuted: 'rgba(148, 163, 184, 0.25)',
      wallFill: 'rgba(30, 41, 59, 0.5)',
      wallStroke: '#e2e8f0',
      dimColor: 'rgba(245, 158, 11, 0.7)',
      dimText: '#fbbf24',
      roomText: '#f8fafc',
      crosshair: 'rgba(34, 197, 94, 0.45)',
      crosshairReticle: '#22c55e',
      highlight: 'rgba(34, 197, 94, 0.18)'
    }
  };

  function getPalette() {
    return themes[state.theme] || themes['realistic-light'];
  }

  // Init Canvas
  function init() {
    const canvas = document.getElementById('cad-canvas');
    if (!canvas) return;

    state.canvas = canvas;
    state.ctx = canvas.getContext('2d');
    resize();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    state.scrollY = window.scrollY || window.pageYOffset;
    state.targetScrollY = state.scrollY;

    const observer = new MutationObserver(() => {
      const themeAttr = document.documentElement.getAttribute('data-theme') || 'realistic-light';
      state.theme = themeAttr;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    requestAnimationFrame(renderLoop);
  }

  function resize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;

    state.canvas.width = state.width * state.dpr;
    state.canvas.height = state.height * state.dpr;
    state.canvas.style.width = state.width + 'px';
    state.canvas.style.height = state.height + 'px';

    state.ctx.scale(state.dpr, state.dpr);
  }

  function onScroll() {
    state.targetScrollY = window.scrollY || window.pageYOffset;
  }

  function onMouseMove(e) {
    state.targetMouseX = e.clientX;
    state.targetMouseY = e.clientY;
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Main Render Loop
  function renderLoop(timestamp) {
    state.pulseTime = timestamp * 0.001;

    // Smooth camera interpolation
    state.scrollY = lerp(state.scrollY, state.targetScrollY, 0.08);
    state.mouseX = lerp(state.mouseX, state.targetMouseX, 0.14);
    state.mouseY = lerp(state.mouseY, state.targetMouseY, 0.14);

    const ctx = state.ctx;
    const width = state.width;
    const height = state.height;
    const p = getPalette();

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // 1. Draw Architectural Drafting Grid
    if (state.showGrid) {
      drawCADGrid(ctx, width, height, p);
    }

    // 2. Compute Scroll Progress
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      height * 3
    );
    const scrollMax = docHeight - height;
    const scrollFraction = scrollMax > 0 ? state.scrollY / scrollMax : 0;

    // 3. Draw Parallax Architectural Floor Plans & Realistic Perspective Lines
    drawArchitecturalPlans(ctx, width, height, scrollFraction, p);

    // 4. Draw AutoCAD Crosshair Cursor & Coordinates
    if (state.showCrosshair && state.mouseX > 0 && state.mouseY > 0) {
      drawCrosshair(ctx, width, height, p);
    }

    ctx.restore();
    updateHUD(scrollFraction);

    requestAnimationFrame(renderLoop);
  }

  // Draw Subtle Architectural Millimeter Grid
  function drawCADGrid(ctx, width, height, p) {
    const gridMajor = 90;
    const gridMinor = 18;
    const offsetX = (-state.mouseX * 0.02) % gridMajor;
    const offsetY = (-state.scrollY * 0.2) % gridMajor;

    ctx.lineWidth = 0.5;

    // Minor lines
    ctx.strokeStyle = p.gridMinor;
    ctx.beginPath();
    for (let x = offsetX; x < width; x += gridMinor) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += gridMinor) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Major lines
    ctx.strokeStyle = p.gridMajor;
    ctx.beginPath();
    for (let x = offsetX; x < width; x += gridMajor) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += gridMajor) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Subtle coordinate tick numbers
    ctx.fillStyle = p.cadSecondary;
    ctx.font = '9px "JetBrains Mono", monospace';
    for (let y = 50; y < height; y += 140) {
      const coordVal = Math.round((y + state.scrollY * 0.2) * 10);
      ctx.fillText(`+${coordVal}mm`, 12, y);
    }
  }

  // Draw Realistic Architectural Plates (Floor Plans & 3D Perspectives)
  function drawArchitecturalPlans(ctx, width, height, scrollFraction, p) {
    const scrollY = state.scrollY;

    // --- PLATE 1: RESIDENTIAL GROUND FLOOR PLAN & PERSPECTIVE ---
    // Smoothly positioned in the upper portion
    const p1Y = 160 - scrollY * 0.40;
    const p1X = width > 1024 ? width * 0.54 : width * 0.12;
    const p1Scale = width > 1200 ? 0.95 : width > 768 ? 0.78 : 0.58;

    if (p1Y + 680 * p1Scale > -100 && p1Y < height + 100) {
      ctx.save();
      ctx.translate(p1X, p1Y);
      ctx.scale(p1Scale, p1Scale);
      drawResidentialFloorPlan(ctx, p);
      ctx.restore();
    }

    // --- PLATE 2: ARCHITECTURAL 3D WIREFRAME PERSPECTIVE (Matching Letterhead) ---
    const p2Y = height * 0.95 + 400 - scrollY * 0.48;
    const p2X = width > 1024 ? width * 0.05 : width * 0.02;
    const p2Scale = width > 1200 ? 0.95 : width > 768 ? 0.75 : 0.55;

    if (p2Y + 700 * p2Scale > -100 && p2Y < height + 100) {
      ctx.save();
      ctx.translate(p2X, p2Y);
      ctx.scale(p2Scale, p2Scale);
      drawPerspectiveFacade(ctx, p);
      ctx.restore();
    }

    // --- PLATE 3: STRUCTURAL FOUNDATION & TIE BEAM GRID ---
    const p3Y = height * 2.0 + 650 - scrollY * 0.46;
    const p3X = width > 1024 ? width * 0.52 : width * 0.08;
    const p3Scale = width > 1200 ? 0.88 : width > 768 ? 0.7 : 0.52;

    if (p3Y + 700 * p3Scale > -100 && p3Y < height + 100) {
      ctx.save();
      ctx.translate(p3X, p3Y);
      ctx.scale(p3Scale, p3Scale);
      drawStructuralFoundationPlan(ctx, p);
      ctx.restore();
    }

    // --- PLATE 4: MASTER SITE PLAN & OFFICIAL ARBERN TITLE BLOCK ---
    const p4Y = height * 3.1 + 800 - scrollY * 0.45;
    const p4X = width > 1024 ? width * 0.12 : width * 0.04;
    const p4Scale = width > 1200 ? 0.85 : width > 768 ? 0.7 : 0.5;

    if (p4Y + 800 * p4Scale > -100 && p4Y < height + 100) {
      ctx.save();
      ctx.translate(p4X, p4Y);
      ctx.scale(p4Scale, p4Scale);
      drawSiteMasterPlan(ctx, p);
      ctx.restore();
    }
  }

  // PLATE 1: Detailed 2D Residential House Plan
  function drawResidentialFloorPlan(ctx, p) {
    ctx.lineWidth = 1.2;

    // Structural Column Lines
    if (state.showStructural) {
      ctx.setLineDash([8, 4, 2, 4]);
      ctx.strokeStyle = p.cadMuted;
      ctx.beginPath();
      const colsX = [0, 140, 320, 500, 640];
      colsX.forEach((cx) => {
        ctx.moveTo(cx, -35);
        ctx.lineTo(cx, 460);
      });
      const rowsY = [0, 130, 290, 420];
      rowsY.forEach((ry) => {
        ctx.moveTo(-35, ry);
        ctx.lineTo(675, ry);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      colsX.forEach((cx, idx) => {
        drawGridBubble(ctx, cx, -45, (idx + 1).toString(), p);
        drawGridBubble(ctx, cx, 470, (idx + 1).toString(), p);
      });
      const rowLabels = ['A', 'B', 'C', 'D'];
      rowsY.forEach((ry, idx) => {
        drawGridBubble(ctx, -45, ry, rowLabels[idx], p);
        drawGridBubble(ctx, 685, ry, rowLabels[idx], p);
      });
    }

    // Outer & Partition Walls
    ctx.strokeStyle = p.wallStroke;
    ctx.fillStyle = p.wallFill;
    ctx.lineWidth = 1.5;

    // Exterior Boundary
    ctx.fillRect(0, 0, 640, 420);
    ctx.strokeRect(0, 0, 640, 420);
    ctx.lineWidth = 0.8;
    ctx.strokeRect(14, 14, 612, 392); // Double line wall

    // Room Partitions
    ctx.lineWidth = 1.2;
    const partitions = [
      { x: 140, y: 14, w: 8, h: 276 },
      { x: 320, y: 14, w: 8, h: 276 },
      { x: 320, y: 290, w: 320, h: 8 },
      { x: 500, y: 14, w: 8, h: 160 },
      { x: 500, y: 174, w: 140, h: 8 },
      { x: 14, y: 290, w: 306, h: 8 },
      { x: 180, y: 298, w: 8, h: 122 }
    ];

    partitions.forEach(part => {
      ctx.fillRect(part.x, part.y, part.w, part.h);
      ctx.strokeRect(part.x, part.y, part.w, part.h);
    });

    // Solid RC Columns (Arbern Green)
    if (state.showStructural) {
      ctx.fillStyle = p.cadPrimary;
      const columns = [
        [0, 0], [140, 0], [320, 0], [500, 0], [640, 0],
        [0, 130], [140, 130], [320, 130], [500, 130], [640, 130],
        [0, 290], [140, 290], [320, 290], [500, 290], [640, 290],
        [0, 420], [140, 420], [320, 420], [500, 420], [640, 420]
      ];
      columns.forEach(([cx, cy]) => {
        ctx.fillRect(cx - 6, cy - 6, 12, 12);
        ctx.strokeRect(cx - 6, cy - 6, 12, 12);
      });
    }

    // Door Swings with Green Accents
    drawDoorSwing(ctx, 140, 80, 44, 0, p);
    drawDoorSwing(ctx, 320, 80, 44, 0, p);
    drawDoorSwing(ctx, 420, 290, 44, Math.PI / 2, p);
    drawDoorSwing(ctx, 500, 70, 38, 0, p);
    drawDoorSwing(ctx, 14, 200, 48, -Math.PI / 2, p);

    // Windows
    drawWindow(ctx, 70, 0, 70, true, p);
    drawWindow(ctx, 220, 0, 80, true, p);
    drawWindow(ctx, 400, 0, 80, true, p);
    drawWindow(ctx, 560, 0, 60, true, p);
    drawWindow(ctx, 640, 80, 70, false, p);
    drawWindow(ctx, 640, 340, 70, false, p);

    // Room Labels
    drawRoomTag(ctx, 70, 140, 'GRAND FOYER', '140 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 230, 140, 'LIVING & LOUNGE', '380 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 410, 140, 'FORMAL DINING', '220 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 570, 90, 'CHEF PANTRY', '160 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 480, 360, 'MASTER SUITE', '320 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 100, 360, 'POOL & TERRACE', 'WATER FEAT.', '▼ FFL -0.200m', p);

    // Swimming Pool with soft cyan/green water tint
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
    ctx.fillRect(28, 310, 140, 90);
    ctx.strokeRect(28, 310, 140, 90);
    ctx.strokeRect(34, 316, 128, 78);

    // Dimension Lines
    if (state.showDimensions) {
      drawCADDimension(ctx, 0, -22, 640, -22, '19,500 mm [64\'-0"]', p);
      drawCADDimension(ctx, 0, -8, 140, -8, '4,270 mm', p);
      drawCADDimension(ctx, 140, -8, 320, -8, '5,490 mm', p);
      drawCADDimension(ctx, 320, -8, 500, -8, '5,490 mm', p);
      drawCADDimension(ctx, 500, -8, 640, -8, '4,250 mm', p);

      drawCADVerticalDimension(ctx, -22, 0, -22, 420, '12,800 mm [42\'-0"]', p);
      drawCADVerticalDimension(ctx, -8, 0, -8, 290, '8,840 mm', p);
      drawCADVerticalDimension(ctx, -8, 290, -8, 420, '3,960 mm', p);
    }

    // Title Block
    drawTitlePlate(ctx, 380, 440, 'ARBERN LUXURY RESIDENCE', 'GROUND FLOOR PLAN', 'SCALE 1:50', 'DWG NO: ARB-RES-001', p);
    drawNorthArrow(ctx, 600, -65, p);
  }

  // PLATE 2: Architectural Perspective Facade (Matching Letterhead)
  function drawPerspectiveFacade(ctx, p) {
    ctx.save();
    ctx.lineWidth = 1;

    // Vanishing point perspective lines (inspired by the official letterhead)
    const vpX = 680;
    const vpY = 180;

    // Horizon line
    ctx.strokeStyle = p.cadMuted;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, vpY);
    ctx.lineTo(800, vpY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Perspective floor lines (expanding forward)
    ctx.strokeStyle = p.gridMinor;
    for (let x = 0; x <= 600; x += 60) {
      ctx.beginPath();
      ctx.moveTo(vpX, vpY);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }

    // Modern Building Facade Wireframe
    ctx.strokeStyle = p.wallStroke;
    ctx.lineWidth = 1.4;

    // Building Bay 1 to 6
    const bays = 7;
    for (let b = 0; b < bays; b++) {
      const x1 = 40 + b * 75;
      const x2 = x1 + 60;
      const topY = 40 + b * 15;
      const btmY = 380 - b * 18;

      ctx.strokeRect(x1, topY, 60, btmY - topY);

      // Floor dividers
      const floors = 4;
      const fH = (btmY - topY) / floors;
      for (let f = 1; f < floors; f++) {
        ctx.beginPath();
        ctx.moveTo(x1, topY + f * fH);
        ctx.lineTo(x2, topY + f * fH);
        ctx.stroke();
      }

      // Glass vertical mullions
      ctx.strokeStyle = p.cadMuted;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(x1 + 20, topY);
      ctx.lineTo(x1 + 20, btmY);
      ctx.moveTo(x1 + 40, topY);
      ctx.lineTo(x1 + 40, btmY);
      ctx.stroke();
      ctx.strokeStyle = p.wallStroke;
      ctx.lineWidth = 1.4;
    }

    // Top roof cantilever canopy
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 35);
    ctx.lineTo(580, 140);
    ctx.lineTo(560, 160);
    ctx.lineTo(20, 55);
    ctx.closePath();
    ctx.stroke();

    // Arbern Green accent perspective vector
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, 380);
    ctx.lineTo(580, 260);
    ctx.stroke();

    drawTitlePlate(ctx, 40, 420, 'ARBERN COMMERCIAL LANDMARK', 'ARCHITECTURAL PERSPECTIVE STUDY', 'SCALE N.T.S.', 'DWG NO: ARB-3D-004', p);
    ctx.restore();
  }

  // PLATE 3: Foundation Footings & Columns
  function drawStructuralFoundationPlan(ctx, p) {
    ctx.save();
    ctx.lineWidth = 1.1;

    const cols = 4;
    const rows = 3;
    const spacingX = 160;
    const spacingY = 150;

    // Grid centerlines
    ctx.setLineDash([8, 4, 2, 4]);
    ctx.strokeStyle = p.cadMuted;
    ctx.beginPath();
    for (let c = 0; c < cols; c++) {
      ctx.moveTo(c * spacingX, -25);
      ctx.lineTo(c * spacingX, (rows - 1) * spacingY + 25);
    }
    for (let r = 0; r < rows; r++) {
      ctx.moveTo(-25, r * spacingY);
      ctx.lineTo((cols - 1) * spacingX + 25, r * spacingY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    for (let c = 0; c < cols; c++) {
      drawGridBubble(ctx, c * spacingX, -35, (c + 1).toString(), p);
    }
    const rNames = ['X', 'Y', 'Z'];
    for (let r = 0; r < rows; r++) {
      drawGridBubble(ctx, -35, r * spacingY, rNames[r], p);
    }

    // Footings & Tie Beams
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * spacingX;
        const y = r * spacingY;

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = p.cadSecondary;
        ctx.strokeRect(x - 38, y - 38, 76, 76);
        ctx.setLineDash([]);

        // Column Pedestal (Arbern Green)
        ctx.fillStyle = p.cadPrimary;
        ctx.fillRect(x - 11, y - 11, 22, 22);
        ctx.strokeStyle = p.wallStroke;
        ctx.strokeRect(x - 11, y - 11, 22, 22);

        ctx.fillStyle = p.dimText;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`F-${c + 1}${r + 1}`, x, y + 52);

        if (c < cols - 1) {
          ctx.strokeStyle = p.wallStroke;
          ctx.strokeRect(x + 11, y - 6, spacingX - 22, 12);
        }
        if (r < rows - 1) {
          ctx.strokeStyle = p.wallStroke;
          ctx.strokeRect(x - 6, y + 11, 12, spacingY - 22);
        }
      }
    }

    drawTitlePlate(ctx, 100, (rows - 1) * spacingY + 60, 'ARBERN STRUCTURAL DIVISION', 'FOUNDATION & COLUMN TIE GRID', 'SCALE 1:75', 'DWG NO: ARB-FND-002', p);
    ctx.restore();
  }

  // PLATE 4: Master Site Plan & Official Arbern Title Block
  function drawSiteMasterPlan(ctx, p) {
    ctx.save();
    ctx.lineWidth = 1.1;

    // Property line
    ctx.strokeStyle = p.dimColor;
    ctx.setLineDash([12, 4, 3, 4]);
    ctx.strokeRect(0, 0, 700, 460);
    ctx.setLineDash([]);

    ctx.fillStyle = p.dimText;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SITE BOUNDARY LINE - 80.00 PERCHES [2,023 SQ.M] - KAHATHUDUWA', 350, -10);

    // Front road
    ctx.strokeStyle = p.cadSecondary;
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(700, 400);
    ctx.stroke();
    ctx.fillText('JAYAGATH MAWATHA - 30\'-0" WIDE ACCESS ROAD', 350, 435);

    // Building Footprint
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = 'rgba(22, 163, 74, 0.05)';
    ctx.fillRect(80, 50, 400, 270);
    ctx.strokeRect(80, 50, 400, 270);

    ctx.fillStyle = p.roomText;
    ctx.fillText('PROPOSED ARCHITECTURAL COMPLEX', 280, 185);

    // Full Title Block (Bottom Right)
    drawFullTitleBlock(ctx, 230, 335, 470, 115, p);
    ctx.restore();
  }

  // --- DRAWING PRIMITIVES ---

  function drawGridBubble(ctx, x, y, label, p) {
    ctx.save();
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = p.bg;
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.roomText;
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
    ctx.restore();
  }

  function drawDoorSwing(ctx, x, y, radius, angle, p) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();

    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = p.cadSecondary;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawWindow(ctx, x, y, len, isHorizontal, p) {
    ctx.save();
    ctx.strokeStyle = p.wallStroke;
    ctx.lineWidth = 1.1;
    if (isHorizontal) {
      ctx.beginPath();
      ctx.moveTo(x, y - 2);
      ctx.lineTo(x + len, y - 2);
      ctx.moveTo(x, y + 16);
      ctx.lineTo(x + len, y + 16);
      ctx.stroke();

      ctx.strokeStyle = p.cadPrimary;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y + 5);
      ctx.lineTo(x + len, y + 5);
      ctx.moveTo(x, y + 9);
      ctx.lineTo(x + len, y + 9);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(x - 2, y);
      ctx.lineTo(x - 2, y + len);
      ctx.moveTo(x + 16, y);
      ctx.lineTo(x + 16, y + len);
      ctx.stroke();

      ctx.strokeStyle = p.cadPrimary;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x + 5, y);
      ctx.lineTo(x + 5, y + len);
      ctx.moveTo(x + 9, y);
      ctx.lineTo(x + 9, y + len);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRoomTag(ctx, x, y, name, area, level, p) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = p.roomText;
    ctx.font = '600 11px "Space Grotesk", sans-serif';
    ctx.fillText(name, x, y - 8);

    ctx.fillStyle = p.cadSecondary;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(area, x, y + 5);
    ctx.fillText(level, x, y + 16);
    ctx.restore();
  }

  function drawCADDimension(ctx, x1, y1, x2, y2, text, p) {
    ctx.save();
    ctx.strokeStyle = p.dimColor;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const tick = 5;
    ctx.beginPath();
    ctx.moveTo(x1 - tick, y1 + tick);
    ctx.lineTo(x1 + tick, y1 - tick);
    ctx.moveTo(x2 - tick, y2 + tick);
    ctx.lineTo(x2 + tick, y2 - tick);
    ctx.stroke();

    ctx.fillStyle = p.dimText;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, (x1 + x2) / 2, y1 - 3);
    ctx.restore();
  }

  function drawCADVerticalDimension(ctx, x1, y1, x2, y2, text, p) {
    ctx.save();
    ctx.strokeStyle = p.dimColor;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const tick = 5;
    ctx.beginPath();
    ctx.moveTo(x1 - tick, y1 + tick);
    ctx.lineTo(x1 + tick, y1 - tick);
    ctx.moveTo(x2 - tick, y2 + tick);
    ctx.lineTo(x2 + tick, y2 - tick);
    ctx.stroke();

    ctx.save();
    ctx.translate(x1 - 5, (y1 + y2) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = p.dimText;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, 0, 0);
    ctx.restore();
    ctx.restore();
  }

  function drawNorthArrow(ctx, x, y, p) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = p.cadPrimary;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(6, 8);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-6, 8);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.stroke();

    ctx.font = 'bold 11px "Space Grotesk", sans-serif';
    ctx.fillStyle = p.cadPrimary;
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -26);
    ctx.restore();
  }

  function drawTitlePlate(ctx, x, y, proj, title, scale, dwg, p) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, 260, 52);
    ctx.strokeRect(0, 0, 260, 52);

    ctx.fillStyle = p.cadSecondary;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`PROJECT: ${proj}`, 10, 15);

    ctx.fillStyle = p.cadPrimary;
    ctx.font = 'bold 11px "Space Grotesk", sans-serif';
    ctx.fillText(title, 10, 30);

    ctx.fillStyle = p.dimText;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`${scale}  |  ${dwg}`, 10, 44);
    ctx.restore();
  }

  function drawFullTitleBlock(ctx, x, y, w, h, p) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = p.bg;
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.5;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeRect(0, 0, w, h);

    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, 35);
    ctx.lineTo(w, 35);
    ctx.moveTo(0, 75);
    ctx.lineTo(w, 75);
    ctx.moveTo(w * 0.58, 0);
    ctx.lineTo(w * 0.58, h);
    ctx.stroke();

    // Company Header
    ctx.fillStyle = p.cadPrimary;
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ARBERN HOLDINGS PVT LTD', 12, 22);

    ctx.fillStyle = p.cadSecondary;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('CIVIL & STRUCTURAL ENGINEERING | TURNKEY CONTRACTORS', 12, 50);
    ctx.fillText('425/G2, JAYAGATH MW, KAHATHUDUWA, POLGASOWITA', 12, 64);
    ctx.fillText('PROJECT: RESIDENTIAL & COMMERCIAL ARCHITECTURAL DESIGN', 12, 94);

    ctx.fillText('DWG NO: AH-2026-M01', w * 0.58 + 10, 50);
    ctx.fillText('SCALE: 1:100', w * 0.58 + 10, 70);
    ctx.fillText('REV: 05-A', w * 0.58 + 10, 94);

    ctx.restore();
  }

  // AutoCAD Crosshair Reticle Cursor (Arbern Green)
  function drawCrosshair(ctx, width, height, p) {
    const x = state.mouseX;
    const y = state.mouseY;

    ctx.save();
    ctx.strokeStyle = p.crosshair;
    ctx.lineWidth = 0.6;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Precision target ring
    ctx.strokeStyle = p.crosshairReticle;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Small tick marks
    ctx.beginPath();
    ctx.moveTo(x - 18, y); ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 6, y);  ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18); ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 6);  ctx.lineTo(x, y + 18);
    ctx.stroke();

    // Coordinates Badge
    const coordX = ((x + state.mouseX * 0.05) * 2.5).toFixed(1);
    const coordY = ((y + state.scrollY) * 2.5).toFixed(1);

    ctx.fillStyle = p.cadPrimary;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`X:${coordX}mm  Y:${coordY}mm`, x + 15, y - 8);

    ctx.restore();
  }

  function updateHUD(scrollFraction) {
    const coordEl = document.getElementById('cad-hud-coords');
    const scrollEl = document.getElementById('cad-hud-scroll');
    const progressEl = document.getElementById('cad-scroll-bar');

    if (coordEl) {
      const liveX = ((state.mouseX + 120) * 2.5).toFixed(0);
      const liveY = ((state.mouseY + state.scrollY) * 2.5).toFixed(0);
      coordEl.textContent = `X: ${liveX}mm | Y: ${liveY}mm`;
    }

    if (scrollEl) {
      const elevation = (scrollFraction * 36).toFixed(2);
      scrollEl.textContent = `EL: +${elevation}m`;
    }

    if (progressEl) {
      progressEl.style.width = `${(scrollFraction * 100).toFixed(1)}%`;
    }
  }

  window.CADController = {
    toggleGrid: function () {
      state.showGrid = !state.showGrid;
      return state.showGrid;
    },
    toggleDimensions: function () {
      state.showDimensions = !state.showDimensions;
      return state.showDimensions;
    },
    toggleStructural: function () {
      state.showStructural = !state.showStructural;
      return state.showStructural;
    },
    toggleCrosshair: function () {
      state.showCrosshair = !state.showCrosshair;
      return state.showCrosshair;
    },
    setTheme: function (themeName) {
      if (themes[themeName]) {
        state.theme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('arbern_cad_theme', themeName);
      }
    },
    getTheme: function () {
      return state.theme;
    }
  };

  const savedTheme = localStorage.getItem('arbern_cad_theme') || 'realistic-light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  state.theme = savedTheme;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
