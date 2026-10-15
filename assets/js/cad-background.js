/**
 * Arbern Holdings Pvt Ltd - CAD Floor Plan & Blueprint Background Engine
 * Pure Vanilla JavaScript & HTML5 Canvas - No Node.js required
 * Real-time Parallax Scrolling, Floor Plans, Structural Grids, CAD Coordinates HUD
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
    theme: 'blueprint', // 'blueprint' | 'obsidian' | 'light-blueprint'
    showGrid: true,
    showDimensions: true,
    showStructural: true,
    showCrosshair: true,
    hoveredRoom: null,
    pulseTime: 0
  };

  // Color palettes per theme
  const themes = {
    blueprint: {
      bg: '#070c16',
      gridMajor: 'rgba(0, 229, 255, 0.08)',
      gridMinor: 'rgba(0, 229, 255, 0.025)',
      cadPrimary: '#00e5ff',
      cadSecondary: 'rgba(0, 229, 255, 0.45)',
      cadMuted: 'rgba(0, 229, 255, 0.15)',
      wallFill: 'rgba(0, 229, 255, 0.06)',
      wallStroke: '#00e5ff',
      dimColor: 'rgba(255, 170, 0, 0.75)',
      dimText: '#ffaa00',
      roomText: '#ffffff',
      crosshair: 'rgba(0, 229, 255, 0.35)',
      highlight: 'rgba(0, 229, 255, 0.18)'
    },
    obsidian: {
      bg: '#08080a',
      gridMajor: 'rgba(255, 255, 255, 0.07)',
      gridMinor: 'rgba(255, 255, 255, 0.02)',
      cadPrimary: '#ffffff',
      cadSecondary: 'rgba(255, 255, 255, 0.45)',
      cadMuted: 'rgba(255, 255, 255, 0.12)',
      wallFill: 'rgba(255, 255, 255, 0.05)',
      wallStroke: '#ffffff',
      dimColor: 'rgba(200, 200, 200, 0.7)',
      dimText: '#e2e8f0',
      roomText: '#ffffff',
      crosshair: 'rgba(255, 255, 255, 0.3)',
      highlight: 'rgba(255, 255, 255, 0.15)'
    },
    'light-blueprint': {
      bg: '#f4f6fa',
      gridMajor: 'rgba(12, 74, 158, 0.09)',
      gridMinor: 'rgba(12, 74, 158, 0.035)',
      cadPrimary: '#0c4a9e',
      cadSecondary: 'rgba(12, 74, 158, 0.5)',
      cadMuted: 'rgba(12, 74, 158, 0.15)',
      wallFill: 'rgba(12, 74, 158, 0.05)',
      wallStroke: '#0c4a9e',
      dimColor: 'rgba(180, 83, 9, 0.8)',
      dimText: '#b45309',
      roomText: '#0f172a',
      crosshair: 'rgba(12, 74, 158, 0.35)',
      highlight: 'rgba(12, 74, 158, 0.12)'
    }
  };

  function getPalette() {
    return themes[state.theme] || themes.blueprint;
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

    // Initial scroll position
    state.scrollY = window.scrollY || window.pageYOffset;
    state.targetScrollY = state.scrollY;

    // Listen to theme changes
    const observer = new MutationObserver(() => {
      const themeAttr = document.documentElement.getAttribute('data-theme') || 'blueprint';
      state.theme = themeAttr;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Start Animation Loop
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

  // Linear Interpolation
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Main Render Loop
  function renderLoop(timestamp) {
    state.pulseTime = timestamp * 0.001;

    // Smooth scroll interpolation
    state.scrollY = lerp(state.scrollY, state.targetScrollY, 0.08);
    state.mouseX = lerp(state.mouseX, state.targetMouseX, 0.12);
    state.mouseY = lerp(state.mouseY, state.targetMouseY, 0.12);

    const ctx = state.ctx;
    const width = state.width;
    const height = state.height;
    const p = getPalette();

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Save context
    ctx.save();

    // 1. Draw CAD Millimeter Grid
    if (state.showGrid) {
      drawCADGrid(ctx, width, height, p);
    }

    // 2. Compute Total Document Height & Scroll Progress
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      height * 3
    );
    const scrollMax = docHeight - height;
    const scrollFraction = scrollMax > 0 ? state.scrollY / scrollMax : 0;

    // 3. Draw Parallax Architectural Floor Plans & Schematics
    drawArchitecturalPlans(ctx, width, height, scrollFraction, p);

    // 4. Draw Precision Crosshair Cursor & Coordinate System
    if (state.showCrosshair && state.mouseX > 0 && state.mouseY > 0) {
      drawCrosshair(ctx, width, height, p);
    }

    // Restore context
    ctx.restore();

    // Update CAD HUD
    updateHUD(scrollFraction);

    requestAnimationFrame(renderLoop);
  }

  // Draw CAD Millimeter Grid with Subdivisions
  function drawCADGrid(ctx, width, height, p) {
    const gridMajor = 100;
    const gridMinor = 20;
    const offsetX = (-state.mouseX * 0.03) % gridMajor;
    const offsetY = (-state.scrollY * 0.25) % gridMajor;

    ctx.lineWidth = 0.5;

    // Minor Grid Lines
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

    // Major Grid Lines
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

    // Subtle coordinate tick numbers along the left and top
    ctx.fillStyle = p.cadSecondary;
    ctx.font = '9px "JetBrains Mono", monospace';
    for (let y = 40; y < height; y += 120) {
      const coordVal = Math.round((y + state.scrollY * 0.25) * 10);
      ctx.fillText(`+${coordVal}mm`, 12, y);
    }
  }

  // Draw Architectural Floor Plans that parallax smoothly
  function drawArchitecturalPlans(ctx, width, height, scrollFraction, p) {
    // We position 4 main architectural plates along the document:
    // Plate 1: Luxury Residential Villa Ground Floor Plan (Hero section)
    // Plate 2: Commercial Tower Structural Elevation & Core (Services/About section)
    // Plate 3: Foundation, Rebar & Column Layout Grid (Methodology section)
    // Plate 4: Master Plan Site Layout & CAD Title Block (Footer / Contact section)

    // Base parallax coordinates
    const scrollY = state.scrollY;

    // --- PLATE 1: RESIDENTIAL GROUND FLOOR PLAN ---
    // Visible in the upper portion (0 to 1200px scroll)
    const p1Y = 220 - scrollY * 0.45;
    const p1X = width > 1024 ? width * 0.52 : width * 0.15;
    const p1Scale = width > 1200 ? 1 : width > 768 ? 0.8 : 0.6;

    if (p1Y + 700 * p1Scale > -100 && p1Y < height + 100) {
      ctx.save();
      ctx.translate(p1X, p1Y);
      ctx.scale(p1Scale, p1Scale);
      drawResidentialFloorPlan(ctx, p);
      ctx.restore();
    }

    // --- PLATE 2: COMMERCIAL TOWER STRUCTURAL ELEVATION ---
    // Visible in the middle portion (800 to 2400px scroll)
    const p2Y = height * 1.1 + 600 - scrollY * 0.55;
    const p2X = width > 1024 ? width * 0.08 : width * 0.05;
    const p2Scale = width > 1200 ? 0.95 : width > 768 ? 0.75 : 0.55;

    if (p2Y + 800 * p2Scale > -100 && p2Y < height + 100) {
      ctx.save();
      ctx.translate(p2X, p2Y);
      ctx.scale(p2Scale, p2Scale);
      drawCommercialElevation(ctx, p);
      ctx.restore();
    }

    // --- PLATE 3: STRUCTURAL FOUNDATION & REBAR GRID ---
    // Visible in the lower middle portion (1800 to 3600px scroll)
    const p3Y = height * 2.2 + 800 - scrollY * 0.52;
    const p3X = width > 1024 ? width * 0.5 : width * 0.1;
    const p3Scale = width > 1200 ? 0.9 : width > 768 ? 0.7 : 0.55;

    if (p3Y + 700 * p3Scale > -100 && p3Y < height + 100) {
      ctx.save();
      ctx.translate(p3X, p3Y);
      ctx.scale(p3Scale, p3Scale);
      drawStructuralFoundationPlan(ctx, p);
      ctx.restore();
    }

    // --- PLATE 4: MASTER SITE PLAN & ARBERN CAD TITLE BLOCK ---
    // Visible in the bottom contact / footer region
    const p4Y = height * 3.3 + 900 - scrollY * 0.50;
    const p4X = width > 1024 ? width * 0.15 : width * 0.05;
    const p4Scale = width > 1200 ? 0.85 : width > 768 ? 0.7 : 0.52;

    if (p4Y + 800 * p4Scale > -100 && p4Y < height + 100) {
      ctx.save();
      ctx.translate(p4X, p4Y);
      ctx.scale(p4Scale, p4Scale);
      drawSiteMasterPlan(ctx, p);
      ctx.restore();
    }
  }

  // PLATE 1: Detailed 2D Residential House Plan (AutoCAD Style)
  function drawResidentialFloorPlan(ctx, p) {
    ctx.lineWidth = 1.2;

    // Structural Column Lines (Centerlines - Red/Muted dashed)
    if (state.showStructural) {
      ctx.setLineDash([8, 4, 2, 4]);
      ctx.strokeStyle = p.cadMuted;
      ctx.beginPath();
      // Verticals 1 to 5
      const colsX = [0, 140, 320, 500, 640];
      colsX.forEach((cx, idx) => {
        ctx.moveTo(cx, -40);
        ctx.lineTo(cx, 480);
      });
      // Horizontals A to D
      const rowsY = [0, 130, 290, 420];
      rowsY.forEach((ry, idx) => {
        ctx.moveTo(-40, ry);
        ctx.lineTo(680, ry);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Column Bubbles (A, B, C, D & 1, 2, 3, 4, 5)
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      colsX.forEach((cx, idx) => {
        drawGridBubble(ctx, cx, -50, (idx + 1).toString(), p);
        drawGridBubble(ctx, cx, 490, (idx + 1).toString(), p);
      });
      const rowLabels = ['A', 'B', 'C', 'D'];
      rowsY.forEach((ry, idx) => {
        drawGridBubble(ctx, -50, ry, rowLabels[idx], p);
        drawGridBubble(ctx, 690, ry, rowLabels[idx], p);
      });
    }

    // Solid Wall Outlines (Double-line CAD walls)
    ctx.strokeStyle = p.wallStroke;
    ctx.fillStyle = p.wallFill;

    // Outer boundary walls
    const outerWalls = [
      { x: 0, y: 0, w: 640, h: 420 }
    ];

    outerWalls.forEach(wall => {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
      // Inner wall offset (14px wall thickness)
      ctx.strokeRect(wall.x + 14, wall.y + 14, wall.w - 28, wall.h - 28);
    });

    // Room Partitions
    const partitions = [
      // Foyer & Living divider
      { x: 140, y: 14, w: 10, h: 276 },
      // Living & Dining divider
      { x: 320, y: 14, w: 10, h: 276 },
      // Master Bedroom boundary
      { x: 320, y: 290, w: 320, h: 10 },
      // Kitchen partition
      { x: 500, y: 14, w: 10, h: 160 },
      { x: 500, y: 174, w: 140, h: 10 },
      // Courtyard Pool / Deck cutout
      { x: 14, y: 290, w: 306, h: 10 },
      { x: 180, y: 300, w: 10, h: 120 }
    ];

    partitions.forEach(part => {
      ctx.fillRect(part.x, part.y, part.w, part.h);
      ctx.strokeRect(part.x, part.y, part.w, part.h);
    });

    // Reinforced Concrete Columns (Square solid CAD columns at intersections)
    if (state.showStructural) {
      ctx.fillStyle = p.cadPrimary;
      const columns = [
        [0, 0], [140, 0], [320, 0], [500, 0], [640, 0],
        [0, 130], [140, 130], [320, 130], [500, 130], [640, 130],
        [0, 290], [140, 290], [320, 290], [500, 290], [640, 290],
        [0, 420], [140, 420], [320, 420], [500, 420], [640, 420]
      ];
      columns.forEach(([cx, cy]) => {
        ctx.fillRect(cx - 7, cy - 7, 14, 14);
        ctx.strokeRect(cx - 7, cy - 7, 14, 14);
      });
    }

    // Door Openings with Swing Arcs
    drawDoorSwing(ctx, 140, 80, 45, 0, p);
    drawDoorSwing(ctx, 320, 80, 45, 0, p);
    drawDoorSwing(ctx, 420, 290, 45, Math.PI / 2, p);
    drawDoorSwing(ctx, 500, 70, 40, 0, p);
    drawDoorSwing(ctx, 14, 200, 50, -Math.PI / 2, p); // Main Entrance Door

    // Windows with double sill lines
    drawWindow(ctx, 70, 0, 70, true, p);
    drawWindow(ctx, 220, 0, 80, true, p);
    drawWindow(ctx, 400, 0, 80, true, p);
    drawWindow(ctx, 560, 0, 60, true, p);
    drawWindow(ctx, 640, 80, 70, false, p);
    drawWindow(ctx, 640, 340, 70, false, p);

    // Architectural Room Labels & Area Specifications
    drawRoomTag(ctx, 70, 140, 'GRAND FOYER', '140 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 230, 140, 'LIVING & LOUNGE', '380 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 410, 140, 'FORMAL DINING', '220 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 570, 90, 'CHEF PANTRY', '160 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 480, 360, 'MASTER SUITE', '320 SQ.FT', '▼ FFL +0.150m', p);
    drawRoomTag(ctx, 100, 360, 'COURTYARD / POOL DECK', 'WATER FEAT.', '▼ FFL -0.200m', p);

    // Swimming Pool Linework in courtyard
    ctx.strokeStyle = p.cadSecondary;
    ctx.strokeRect(28, 310, 140, 90);
    ctx.strokeRect(34, 316, 128, 78);
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(40, 322, 116, 66);
    ctx.setLineDash([]);

    // Staircase linework
    drawStairs(ctx, 240, 220, 70, 70, p);

    // Dimension Strings (CAD Extension Lines & Ticks)
    if (state.showDimensions) {
      drawCADDimension(ctx, 0, -25, 640, -25, '19,500 mm [64\'-0"]', p);
      drawCADDimension(ctx, 0, -10, 140, -10, '4,270 mm', p);
      drawCADDimension(ctx, 140, -10, 320, -10, '5,490 mm', p);
      drawCADDimension(ctx, 320, -10, 500, -10, '5,490 mm', p);
      drawCADDimension(ctx, 500, -10, 640, -10, '4,250 mm', p);

      drawCADVerticalDimension(ctx, -25, 0, -25, 420, '12,800 mm [42\'-0"]', p);
      drawCADVerticalDimension(ctx, -10, 0, -10, 290, '8,840 mm', p);
      drawCADVerticalDimension(ctx, -10, 290, -10, 420, '3,960 mm', p);
    }

    // CAD Drawing Tag & Scale Info
    drawTitlePlate(ctx, 400, 440, 'ARBERN LUXURY RESIDENCE', 'GROUND FLOOR PLAN', 'SCALE 1:50', 'DWG NO: ARB-RES-001', p);

    // North Compass Arrow
    drawNorthArrow(ctx, 600, -70, p);
  }

  // PLATE 2: Multi-Story Commercial Tower Elevation & Structural Frame
  function drawCommercialElevation(ctx, p) {
    ctx.lineWidth = 1.1;

    const bWidth = 460;
    const bHeight = 720;
    const floors = 12;
    const floorH = bHeight / floors;

    // Foundation Grade Beam & Piles
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = p.wallFill;
    ctx.fillRect(0, bHeight, bWidth, 40);
    ctx.strokeRect(0, bHeight, bWidth, 40);

    // Piles below ground
    for (let x = 30; x <= bWidth - 30; x += 80) {
      ctx.fillRect(x - 8, bHeight + 40, 16, 70);
      ctx.strokeRect(x - 8, bHeight + 40, 16, 70);
      ctx.fillText('PILE 600Ø', x, bHeight + 125);
    }

    // Commercial Tower Floors
    for (let i = 0; i < floors; i++) {
      const y = bHeight - (i + 1) * floorH;

      // Slab line
      ctx.strokeStyle = p.cadPrimary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-20, y);
      ctx.lineTo(bWidth + 20, y);
      ctx.stroke();

      // Ceiling line
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = p.cadMuted;
      ctx.strokeRect(10, y + 8, bWidth - 20, floorH - 12);

      // Curtain wall glass mullions
      ctx.strokeStyle = p.cadSecondary;
      for (let mx = 40; mx < bWidth; mx += 40) {
        ctx.beginPath();
        ctx.moveTo(mx, y + 4);
        ctx.lineTo(mx, y + floorH);
        ctx.stroke();
      }

      // Elevation Datum Markers
      if (state.showDimensions) {
        const heightMeters = (i * 3.6).toFixed(1);
        const levelName = i === 0 ? 'GROUND LVL ±0.000m' : `LVL ${i < 10 ? '0' + i : i} +${heightMeters}m`;
        drawLevelMarker(ctx, bWidth + 35, y + floorH, levelName, p);
      }
    }

    // Central Structural Shear Core & Elevators
    ctx.setLineDash([6, 3]);
    ctx.strokeStyle = p.cadPrimary;
    ctx.strokeRect(180, 0, 100, bHeight);
    ctx.setLineDash([]);
    ctx.fillStyle = p.cadSecondary;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('REINFORCED CONCRETE CORE', 230, bHeight / 2);

    // Structural Wind Bracing Diagonals (X-Bracing)
    if (state.showStructural) {
      ctx.strokeStyle = p.cadMuted;
      ctx.lineWidth = 1;
      for (let i = 0; i < floors; i += 2) {
        const yTop = bHeight - (i + 2) * floorH;
        // Left bay bracing
        ctx.beginPath();
        ctx.moveTo(10, yTop);
        ctx.lineTo(170, yTop + floorH * 2);
        ctx.moveTo(170, yTop);
        ctx.lineTo(10, yTop + floorH * 2);
        // Right bay bracing
        ctx.moveTo(290, yTop);
        ctx.lineTo(bWidth - 10, yTop + floorH * 2);
        ctx.moveTo(bWidth - 10, yTop);
        ctx.lineTo(290, yTop + floorH * 2);
        ctx.stroke();
      }
    }

    // Rooftop Mechanical Crown & Architectural Fin
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(120, -50, 220, 50);
    ctx.beginPath();
    ctx.moveTo(140, -50);
    ctx.lineTo(140, -90);
    ctx.lineTo(320, -50);
    ctx.stroke();

    // Tower Title
    drawTitlePlate(ctx, 0, bHeight + 170, 'ARBERN COMMERCIAL TOWER', 'STRUCTURAL ELEVATION & CORE', 'SCALE 1:200', 'DWG NO: ARB-STR-014', p);
  }

  // PLATE 3: Structural Foundation & Rebar Layout Grid
  function drawStructuralFoundationPlan(ctx, p) {
    ctx.lineWidth = 1.2;

    const cols = 4;
    const rows = 3;
    const spacingX = 160;
    const spacingY = 160;

    // Grid center lines
    ctx.setLineDash([8, 4, 2, 4]);
    ctx.strokeStyle = p.cadMuted;
    ctx.beginPath();
    for (let c = 0; c < cols; c++) {
      ctx.moveTo(c * spacingX, -30);
      ctx.lineTo(c * spacingX, (rows - 1) * spacingY + 30);
    }
    for (let r = 0; r < rows; r++) {
      ctx.moveTo(-30, r * spacingY);
      ctx.lineTo((cols - 1) * spacingX + 30, r * spacingY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Grid Bubbles
    for (let c = 0; c < cols; c++) {
      drawGridBubble(ctx, c * spacingX, -40, (c + 1).toString(), p);
    }
    const rNames = ['X', 'Y', 'Z'];
    for (let r = 0; r < rows; r++) {
      drawGridBubble(ctx, -40, r * spacingY, rNames[r], p);
    }

    // Tie Beams connecting columns
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = p.wallFill;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * spacingX;
        const y = r * spacingY;

        // Pad Footing (outer dashed line)
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = p.cadSecondary;
        ctx.strokeRect(x - 40, y - 40, 80, 80);
        ctx.setLineDash([]);

        // Concrete Column Pedestal
        ctx.fillStyle = p.cadPrimary;
        ctx.fillRect(x - 12, y - 12, 24, 24);
        ctx.strokeRect(x - 12, y - 12, 24, 24);

        // Footing Mark
        ctx.fillStyle = p.dimText;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`F-${c + 1}${r + 1}`, x, y + 55);

        // Horizontal Tie Beams
        if (c < cols - 1) {
          ctx.strokeStyle = p.cadPrimary;
          ctx.strokeRect(x + 12, y - 7, spacingX - 24, 14);
          ctx.fillStyle = p.cadSecondary;
          ctx.fillText('TB-1 (225x450)', x + spacingX / 2, y - 12);
        }

        // Vertical Tie Beams
        if (r < rows - 1) {
          ctx.strokeStyle = p.cadPrimary;
          ctx.strokeRect(x - 7, y + 12, 14, spacingY - 24);
          ctx.fillStyle = p.cadSecondary;
          ctx.fillText('TB-2 (225x450)', x + 25, y + spacingY / 2);
        }
      }
    }

    // Rebar Detail Leader Callout
    drawLeaderCallout(ctx, 0, 0, -80, -70, 'COLUMN C1 [350x350]\n8-T20 MAIN BARS\nR8-150 C/C STIRRUPS', p);
    drawLeaderCallout(ctx, spacingX, spacingY, spacingX + 70, spacingY + 70, 'ISOLATED FOOTING\n1500x1500x450mm\nT12-150 B/W BTM MESH', p);

    // Title
    drawTitlePlate(ctx, 120, (rows - 1) * spacingY + 70, 'ARBERN ENGINEERING & FOUNDATIONS', 'FOUNDATION & COLUMN TIE GRID', 'SCALE 1:75', 'DWG NO: ARB-FND-003', p);
  }

  // PLATE 4: Site Master Plan & ARBERN Title Block
  function drawSiteMasterPlan(ctx, p) {
    ctx.lineWidth = 1.2;

    // Site Boundary Line (Red-amber dashed property line)
    ctx.strokeStyle = p.dimColor;
    ctx.setLineDash([12, 4, 3, 4]);
    ctx.strokeRect(0, 0, 720, 480);
    ctx.setLineDash([]);

    ctx.fillStyle = p.dimText;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SITE PROPERTY BOUNDARY LINE - 80.00 PERCHES [2,023 SQ.M]', 360, -12);

    // Front Setback & Access Road
    ctx.strokeStyle = p.cadSecondary;
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.lineTo(720, 420);
    ctx.stroke();
    ctx.fillText('ACCESS BOULEVARD - 40\'-0" WIDE ROAD', 360, 455);

    // Building Footprint
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = p.wallFill;
    ctx.fillRect(80, 60, 400, 280);
    ctx.strokeRect(80, 60, 400, 280);

    // Internal Courtyard
    ctx.strokeRect(200, 130, 160, 140);
    ctx.fillText('CENTRAL ATRIUM & LANDSCAPE', 280, 205);

    // Landscaped Parking & Driveway
    ctx.strokeStyle = p.cadMuted;
    for (let px = 520; px <= 680; px += 35) {
      ctx.strokeRect(px, 70, 30, 60);
      ctx.fillText('P', px + 15, 105);
    }
    ctx.fillText('GUEST PARKING BAYS', 600, 150);

    // Vehicular Turning Radius Arc
    ctx.beginPath();
    ctx.arc(600, 270, 70, 0, Math.PI * 1.5);
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText('R9.0m TURNING CIRCLE', 600, 270);

    // Large Official AutoCAD Title Block (Bottom Right)
    drawFullTitleBlock(ctx, 240, 350, 480, 110, p);
  }

  // --- HELPER CAD DRAWING PRIMITIVES ---

  function drawGridBubble(ctx, x, y, label, p) {
    ctx.save();
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = p.bg;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.roomText;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
    ctx.restore();
  }

  function drawDoorSwing(ctx, x, y, radius, angle, p) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Door leaf
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();

    // 90 degree arc
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
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.2;
    if (isHorizontal) {
      // Outer sill
      ctx.beginPath();
      ctx.moveTo(x, y - 2);
      ctx.lineTo(x + len, y - 2);
      ctx.moveTo(x, y + 16);
      ctx.lineTo(x + len, y + 16);
      ctx.stroke();

      // Double glass lines
      ctx.strokeStyle = p.cadSecondary;
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

      ctx.strokeStyle = p.cadSecondary;
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
    ctx.fillText(area, x, y + 6);
    ctx.fillText(level, x, y + 18);
    ctx.restore();
  }

  function drawStairs(ctx, x, y, w, h, p) {
    ctx.save();
    ctx.strokeStyle = p.cadSecondary;
    ctx.strokeRect(x, y, w, h);
    const steps = 7;
    const stepH = h / steps;
    for (let i = 1; i < steps; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + i * stepH);
      ctx.lineTo(x + w, y + i * stepH);
      ctx.stroke();
    }
    // Direction Arrow
    ctx.strokeStyle = p.cadPrimary;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h - 5);
    ctx.lineTo(x + w / 2, y + 10);
    ctx.lineTo(x + w / 2 - 5, y + 18);
    ctx.moveTo(x + w / 2, y + 10);
    ctx.lineTo(x + w / 2 + 5, y + 18);
    ctx.stroke();
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = p.cadPrimary;
    ctx.textAlign = 'center';
    ctx.fillText('UP', x + w / 2, y + h + 12);
    ctx.restore();
  }

  function drawCADDimension(ctx, x1, y1, x2, y2, text, p) {
    ctx.save();
    ctx.strokeStyle = p.dimColor;
    ctx.lineWidth = 1;

    // Dimension line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // 45-degree CAD architectural ticks
    const tick = 6;
    ctx.beginPath();
    ctx.moveTo(x1 - tick, y1 + tick);
    ctx.lineTo(x1 + tick, y1 - tick);
    ctx.moveTo(x2 - tick, y2 + tick);
    ctx.lineTo(x2 + tick, y2 - tick);
    ctx.stroke();

    // Text centered
    ctx.fillStyle = p.dimText;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, (x1 + x2) / 2, y1 - 4);
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

    const tick = 6;
    ctx.beginPath();
    ctx.moveTo(x1 - tick, y1 + tick);
    ctx.lineTo(x1 + tick, y1 - tick);
    ctx.moveTo(x2 - tick, y2 + tick);
    ctx.lineTo(x2 + tick, y2 - tick);
    ctx.stroke();

    ctx.save();
    ctx.translate(x1 - 6, (y1 + y2) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = p.dimText;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, 0, 0);
    ctx.restore();
    ctx.restore();
  }

  function drawLevelMarker(ctx, x, y, label, p) {
    ctx.save();
    ctx.fillStyle = p.cadPrimary;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 12, y - 6);
    ctx.lineTo(x + 12, y + 6);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = p.cadPrimary;
    ctx.beginPath();
    ctx.moveTo(x + 12, y);
    ctx.lineTo(x + 140, y);
    ctx.stroke();

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = p.roomText;
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 16, y - 4);
    ctx.restore();
  }

  function drawLeaderCallout(ctx, startX, startY, endX, endY, text, p) {
    ctx.save();
    ctx.strokeStyle = p.cadPrimary;
    ctx.beginPath();
    ctx.arc(startX, startY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    const shelfX = endX > startX ? endX + 80 : endX - 80;
    ctx.lineTo(shelfX, endY);
    ctx.stroke();

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = p.cadPrimary;
    ctx.textAlign = endX > startX ? 'left' : 'right';
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      ctx.fillText(line, endX + (endX > startX ? 5 : -5), endY - 6 + idx * 12);
    });
    ctx.restore();
  }

  function drawNorthArrow(ctx, x, y, p) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = p.cadPrimary;
    ctx.lineWidth = 1.2;

    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Arrow pointer
    ctx.fillStyle = p.cadPrimary;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(7, 10);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(-7, 10);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.stroke();

    ctx.font = 'bold 12px "Space Grotesk", sans-serif';
    ctx.fillStyle = p.cadPrimary;
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -28);
    ctx.restore();
  }

  function drawTitlePlate(ctx, x, y, proj, title, scale, dwg, p) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = p.cadPrimary;
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, 260, 55);
    ctx.strokeRect(0, 0, 260, 55);

    ctx.fillStyle = p.cadSecondary;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`PROJECT: ${proj}`, 10, 16);

    ctx.fillStyle = p.cadPrimary;
    ctx.font = 'bold 11px "Space Grotesk", sans-serif';
    ctx.fillText(title, 10, 32);

    ctx.fillStyle = p.dimText;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`${scale}  |  ${dwg}`, 10, 47);
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

    // Inner dividing lines
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, 35);
    ctx.lineTo(w, 35);
    ctx.moveTo(0, 75);
    ctx.lineTo(w, 75);
    ctx.moveTo(w * 0.55, 0);
    ctx.lineTo(w * 0.55, h);
    ctx.moveTo(w * 0.78, 35);
    ctx.lineTo(w * 0.78, h);
    ctx.stroke();

    // Company Header
    ctx.fillStyle = p.cadPrimary;
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ARBERN HOLDINGS PVT LTD', 14, 22);

    ctx.fillStyle = p.cadSecondary;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('CIVIL & STRUCTURAL ENGINEERING | TURNKEY CONTRACTORS', 14, 52);
    ctx.fillText('COLOMBO, SRI LANKA | ISO 9001:2015 CERTIFIED', 14, 65);
    ctx.fillText('PROJECT: RESIDENTIAL & COMMERCIAL MASTER DEVELOPMENT', 14, 94);

    // Drawing Specs
    ctx.fillStyle = p.cadSecondary;
    ctx.fillText('DWG NO:', w * 0.55 + 10, 52);
    ctx.fillText('SCALE:', w * 0.55 + 10, 94);
    ctx.fillText('REV:', w * 0.78 + 10, 52);
    ctx.fillText('STATUS:', w * 0.78 + 10, 94);

    ctx.fillStyle = p.cadPrimary;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('AH-2026-M01', w * 0.55 + 60, 52);
    ctx.fillText('1:100', w * 0.55 + 55, 94);
    ctx.fillStyle = p.dimText;
    ctx.fillText('04-B', w * 0.78 + 40, 52);
    ctx.fillStyle = '#10b981';
    ctx.fillText('APPROVED', w * 0.78 + 55, 94);

    ctx.restore();
  }

  // Draw Crosshair Cursor & Coordinates
  function drawCrosshair(ctx, width, height, p) {
    const x = state.mouseX;
    const y = state.mouseY;

    ctx.save();
    ctx.strokeStyle = p.crosshair;
    ctx.lineWidth = 0.6;
    ctx.setLineDash([4, 4]);

    // Full screen crosshair lines
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Small reticle target around pointer
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Target tick marks
    ctx.beginPath();
    ctx.moveTo(x - 20, y); ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y);  ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20); ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8);  ctx.lineTo(x, y + 20);
    ctx.stroke();

    // Precision Coordinates Floating Callout
    const coordX = ((x + state.mouseX * 0.1) * 2.5).toFixed(1);
    const coordY = ((y + state.scrollY) * 2.5).toFixed(1);

    ctx.fillStyle = p.cadPrimary;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`X:${coordX}mm  Y:${coordY}mm`, x + 16, y - 10);

    ctx.restore();
  }

  // Update Dynamic HUD Elements
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

  // Public CAD Controller API for UI controls
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

  // Restore saved theme on startup
  const savedTheme = localStorage.getItem('arbern_cad_theme') || 'blueprint';
  document.documentElement.setAttribute('data-theme', savedTheme);
  state.theme = savedTheme;

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
