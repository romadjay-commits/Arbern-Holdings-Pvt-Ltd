/**
 * Arbern Holdings Pvt Ltd - Main Application Script
 * Vanilla JavaScript (No Node.js required)
 * Handles Interactive Floor Plan Viewer, Project Modal, Construction Cost Estimator, Filterable Portfolio, and Forms
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. MOBILE MENU TOGGLE ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. NAVBAR SCROLL GLASSMORPHISM ---
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-opacity-90', 'backdrop-blur-md', 'shadow-2xl');
      navbar.classList.remove('bg-opacity-40');
    } else {
      navbar.classList.remove('bg-opacity-90', 'backdrop-blur-md', 'shadow-2xl');
      navbar.classList.add('bg-opacity-40');
    }
  }, { passive: true });

  // --- 3. CAD CONTROL DOCK ACTIONS ---
  const btnToggleGrid = document.getElementById('btn-toggle-grid');
  const btnToggleDims = document.getElementById('btn-toggle-dims');
  const btnToggleStruct = document.getElementById('btn-toggle-struct');
  const themeSelect = document.getElementById('cad-theme-select');

  if (btnToggleGrid && window.CADController) {
    btnToggleGrid.addEventListener('click', function () {
      const active = window.CADController.toggleGrid();
      this.classList.toggle('bg-cyan-500/20', active);
      this.classList.toggle('text-cyan-400', active);
      showToast(`CAD Grid: ${active ? 'ENABLED' : 'DISABLED'}`);
    });
  }

  if (btnToggleDims && window.CADController) {
    btnToggleDims.addEventListener('click', function () {
      const active = window.CADController.toggleDimensions();
      this.classList.toggle('bg-cyan-500/20', active);
      this.classList.toggle('text-cyan-400', active);
      showToast(`CAD Dimensions: ${active ? 'ENABLED' : 'DISABLED'}`);
    });
  }

  if (btnToggleStruct && window.CADController) {
    btnToggleStruct.addEventListener('click', function () {
      const active = window.CADController.toggleStructural();
      this.classList.toggle('bg-cyan-500/20', active);
      this.classList.toggle('text-cyan-400', active);
      showToast(`Structural Columns & Rebar: ${active ? 'ENABLED' : 'DISABLED'}`);
    });
  }

  if (themeSelect && window.CADController) {
    themeSelect.value = window.CADController.getTheme();
    themeSelect.addEventListener('change', function () {
      window.CADController.setTheme(this.value);
      showToast(`CAD Visual Style: ${this.options[this.selectedIndex].text}`);
    });
  }

  // --- 4. INTERACTIVE BLUEPRINT VIEWER STATION DATA & ENGINE ---
  const blueprintData = {
    crestline: {
      title: 'The Crestline Minimalist Villa',
      category: 'Ultra-Luxury Residential',
      dwgNo: 'AH-RES-2026-V1',
      scale: '1:50',
      area: '4,850 Sq.Ft (2-Storey)',
      location: 'Barnes Place, Colombo 07',
      structure: 'Post-Tensioned Slabs with Cantilevered Structural Steel Pergolas',
      desc: 'A masterwork in minimalist tropical modernism. Featuring seamless indoor-outdoor transitions, a 16-meter cantilevered lap pool, raw exposed architectural fair-faced concrete, and central biophilic light courts.',
      zones: [
        { id: 'z1', name: 'Grand Living Hall & Double-Height Atrium', area: '720 Sq.Ft', finish: 'Italian Travertine Flamed Stone', ceiling: '3.8m Raw Board-Marked Concrete' },
        { id: 'z2', name: 'Master Executive Suite & Terrace', area: '580 Sq.Ft', finish: 'Solid Teak Parquet Flooring', ceiling: 'Concealed Shadow-Line Acoustic Drywall' },
        { id: 'z3', name: 'Open Minimalist Kitchen & Dry Bar', area: '340 Sq.Ft', finish: 'Monolithic Quartz Island with Matte Black Joinery', ceiling: 'Integrated Linear Micro-LED Troffers' },
        { id: 'z4', name: 'Cantilevered Infinity Lap Pool', area: '16m x 4m', finish: 'Midnight Sukabumi Stone with Glass Balustrade', ceiling: 'Open Sky with Automated Louver Roof' }
      ]
    },
    apex: {
      title: 'Arbern Apex Corporate Tower',
      category: 'Commercial Headquarters',
      dwgNo: 'AH-COM-2026-T12',
      scale: '1:100',
      area: '86,000 Sq.Ft (14 Storeys)',
      location: 'Nawam Mawatha, Colombo 02',
      structure: 'Central Slip-Form RC Core with Composite Steel Decks & Diagrid Bracing',
      desc: 'High-performance Grade-A commercial office tower engineered for LEED Platinum certification. Double-skin ventilated glass facade, column-free office floor plates, and rooftop executive boardroom pavilion.',
      zones: [
        { id: 'z1', name: 'Ground Floor Grand Triple-Height Lobby', area: '3,400 Sq.Ft', finish: 'Honed Pietra Grey Marble & Architectural Bronze', ceiling: '9.2m Suspended Timber Acoustic Baffles' },
        { id: 'z2', name: 'Typical Floor Column-Free Office Plate', area: '5,800 Sq.Ft', finish: 'Heavy-Duty Raised Access Flooring (600mm)', ceiling: '2.8m Clear Height with Intelligent Sensor Grid' },
        { id: 'z3', name: 'Shear Wall Core & High-Speed Lifts', area: '850 Sq.Ft', finish: 'C50/60 High-Strength Concrete Core', ceiling: 'Pressurized Fire Escape & Service Risers' },
        { id: 'z4', name: 'Rooftop Helipad & Executive Terrace', area: '4,200 Sq.Ft', finish: 'Reinforced Heli-Deck with Solar Canopy', ceiling: 'Panoramic 360° Colombo Port & Lake View' }
      ]
    },
    industrial: {
      title: 'Logistics Matrix Smart Hub',
      category: 'High-Tech Industrial',
      dwgNo: 'AH-IND-2026-M4',
      scale: '1:200',
      area: '64,000 Sq.Ft Clear Span',
      location: 'Katunayake Free Trade Zone',
      structure: 'Heavy Pre-Engineered Steel Portal Frames with 36m Clear Span',
      desc: 'High-cube automated warehouse and logistics facility with laser-screeded FM2 superflat industrial flooring, automated dock levelers, and 1.2MW rooftop solar PV generation array.',
      zones: [
        { id: 'z1', name: 'High-Bay Automated Storage Zone', area: '42,000 Sq.Ft', finish: 'Laser-Screeded Jointless Steel Fiber Slab (10 Ton/m²)', ceiling: '12.5m Clear Stacking Height' },
        { id: 'z2', name: 'Hydraulic Loading Docks (8 Bays)', area: '6,400 Sq.Ft', finish: 'Heavy-Duty Polyurethane Screed', ceiling: 'Insulated Sectional Overhead Dock Doors' },
        { id: 'z3', name: 'Operations & Engineering Offices', area: '8,200 Sq.Ft', finish: 'Polished Concrete with Soundproof Acoustic Glass', ceiling: 'Exposed Spiral Ducting & Industrial Lighting' },
        { id: 'z4', name: 'Solar Substation & Utility Plant', area: '3,800 Sq.Ft', finish: 'Anti-Static Epoxy Flooring', ceiling: 'Automated FM-200 Gas Fire Suppression' }
      ]
    },
    penthouse: {
      title: 'Horizon Sky Penthouse',
      category: 'Luxury Interior Architecture',
      dwgNo: 'AH-INT-2026-P08',
      scale: '1:30',
      area: '3,600 Sq.Ft',
      location: 'One Galle Face Residences',
      structure: 'Non-Loadbearing Lightweight Steel Framing & Bespoke Joinery Fit-out',
      desc: 'Bespoke minimalist architectural interior renovation for a private collector. Integrated architectural lighting, invisible flush-to-wall magnetic doors, and customized natural quartzite surfaces.',
      zones: [
        { id: 'z1', name: 'Ocean-Facing Living & Dining Gallery', area: '1,100 Sq.Ft', finish: 'Continuously Poured Seamless Terrazzo Micro-Topping', ceiling: 'Museum-Grade 98 CRI Frameless Downlights' },
        { id: 'z2', name: 'Curated Wine Cellar & Tasting Salon', area: '280 Sq.Ft', finish: 'Charcoal Oak with Temperature & Humidity Climate Glass', ceiling: 'Backlit Honeycomb Onyx Feature Panel' },
        { id: 'z3', name: 'Wellness Spa & Steam En-Suite', area: '420 Sq.Ft', finish: 'Full-Height Bookmatched Arabescato Marble Slabs', ceiling: 'Concealed Rain Shower & Aromatherapy System' },
        { id: 'z4', name: 'Private Sky Garden & Jacuzzi Lounge', area: '950 Sq.Ft', finish: 'Weather-Resistant Thermally Modified Ash Decking', ceiling: 'Frameless Glass Windbreak with Horizon View' }
      ]
    }
  };

  let activePlanKey = 'crestline';
  let viewerZoom = 1;

  function renderBlueprintViewer(planKey) {
    const data = blueprintData[planKey];
    if (!data) return;

    activePlanKey = planKey;
    viewerZoom = 1;

    // Update Meta texts
    document.getElementById('bp-title').textContent = data.title;
    document.getElementById('bp-category').textContent = data.category;
    document.getElementById('bp-dwg-no').textContent = data.dwgNo;
    document.getElementById('bp-scale').textContent = data.scale;
    document.getElementById('bp-area').textContent = data.area;
    document.getElementById('bp-location').textContent = data.location;
    document.getElementById('bp-structure').textContent = data.structure;
    document.getElementById('bp-desc').textContent = data.desc;

    // Render interactive zones list
    const zonesList = document.getElementById('bp-zones-list');
    if (zonesList) {
      zonesList.innerHTML = data.zones.map((zone, idx) => `
        <div class="bp-zone-item p-3.5 rounded-lg border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-500/10 cursor-pointer transition-all duration-200" data-zone-id="${zone.id}">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-mono font-bold text-cyan-400">ZONE 0${idx + 1}</span>
            <span class="text-xs font-mono text-amber-400">${zone.area}</span>
          </div>
          <h4 class="text-sm font-semibold text-white mb-1">${zone.name}</h4>
          <div class="text-[11px] text-slate-400 space-y-0.5 font-mono">
            <div><span class="text-slate-500">FINISH:</span> ${zone.finish}</div>
            <div><span class="text-slate-500">CEILING:</span> ${zone.ceiling}</div>
          </div>
        </div>
      `).join('');

      // Add click listener to highlight zones
      document.querySelectorAll('.bp-zone-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
          const zoneId = this.getAttribute('data-zone-id');
          highlightSvgZone(zoneId);
        });
      });
    }

    // Render Dynamic SVG Floorplan
    renderSvgFloorplan(planKey);
  }

  function renderSvgFloorplan(planKey) {
    const svgContainer = document.getElementById('bp-svg-wrapper');
    if (!svgContainer) return;

    if (planKey === 'crestline') {
      svgContainer.innerHTML = `
        <svg viewBox="0 0 800 500" class="w-full h-full max-h-[500px] select-none" id="bp-svg-element">
          <!-- Background Grid Lines -->
          <defs>
            <pattern id="svgGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" class="text-cyan-500/10" stroke-width="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svgGrid)" />

          <!-- Dimension Lines Top -->
          <g class="text-amber-400 stroke-amber-400/80 fill-amber-400 text-[10px] font-mono">
            <line x1="60" y1="40" x2="740" y2="40" stroke-width="1"/>
            <line x1="55" y1="35" x2="65" y2="45" stroke-width="1.5"/>
            <line x1="735" y1="35" x2="745" y2="45" stroke-width="1.5"/>
            <text x="400" y="32" text-anchor="middle">24,500 mm [80'-4"] OVERALL RESIDENCE LENGTH</text>
          </g>

          <!-- Zone 1: Living & Atrium -->
          <g id="svg-z1" class="cursor-pointer transition-all duration-300">
            <rect x="60" y="80" width="320" height="240" fill="rgba(0, 229, 255, 0.08)" stroke="#00e5ff" stroke-width="2" class="hover:fill-cyan-500/20"/>
            <text x="220" y="190" text-anchor="middle" class="fill-white text-xs font-semibold font-sans">01. GRAND LIVING & ATRIUM</text>
            <text x="220" y="210" text-anchor="middle" class="fill-cyan-400 text-[11px] font-mono">720 SQ.FT | HT: 3.8m</text>
            <!-- Furniture hint -->
            <rect x="120" y="120" width="100" height="50" fill="none" stroke="rgba(0, 229, 255, 0.4)" stroke-dasharray="4,4"/>
            <rect x="150" y="140" width="40" height="20" fill="none" stroke="rgba(0, 229, 255, 0.4)"/>
          </g>

          <!-- Zone 2: Master Suite -->
          <g id="svg-z2" class="cursor-pointer transition-all duration-300">
            <rect x="380" y="80" width="220" height="240" fill="rgba(0, 229, 255, 0.05)" stroke="#00e5ff" stroke-width="2" class="hover:fill-cyan-500/20"/>
            <text x="490" y="190" text-anchor="middle" class="fill-white text-xs font-semibold font-sans">02. MASTER SUITE</text>
            <text x="490" y="210" text-anchor="middle" class="fill-cyan-400 text-[11px] font-mono">580 SQ.FT | TERRACE</text>
            <rect x="440" y="110" width="80" height="70" fill="none" stroke="rgba(0, 229, 255, 0.35)"/>
          </g>

          <!-- Zone 3: Kitchen & Dry Bar -->
          <g id="svg-z3" class="cursor-pointer transition-all duration-300">
            <rect x="600" y="80" width="140" height="240" fill="rgba(0, 229, 255, 0.07)" stroke="#00e5ff" stroke-width="2" class="hover:fill-cyan-500/20"/>
            <text x="670" y="190" text-anchor="middle" class="fill-white text-xs font-semibold font-sans">03. KITCHEN</text>
            <text x="670" y="210" text-anchor="middle" class="fill-cyan-400 text-[11px] font-mono">340 SQ.FT</text>
            <line x1="615" y1="95" x2="615" y2="305" stroke="#00e5ff" stroke-width="1.5"/>
            <line x1="645" y1="95" x2="645" y2="305" stroke="rgba(0, 229, 255, 0.4)" stroke-dasharray="3,3"/>
          </g>

          <!-- Zone 4: Cantilevered Infinity Pool -->
          <g id="svg-z4" class="cursor-pointer transition-all duration-300">
            <rect x="60" y="340" width="480" height="110" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="2" class="hover:fill-cyan-400/25"/>
            <text x="300" y="390" text-anchor="middle" class="fill-cyan-200 text-xs font-semibold font-sans">04. CANTILEVERED INFINITY LAP POOL (16M X 4M)</text>
            <text x="300" y="410" text-anchor="middle" class="fill-cyan-400 text-[10px] font-mono">WATER CAP: 75,000L | SUKABUMI NATURAL STONE</text>
            <!-- Water ripple lines -->
            <path d="M 80 430 Q 140 425 200 430 T 320 430 T 440 430" fill="none" stroke="rgba(0, 229, 255, 0.3)" stroke-width="1"/>
          </g>

          <!-- Verandah Deck -->
          <rect x="540" y="340" width="200" height="110" fill="none" stroke="rgba(0, 229, 255, 0.4)" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="640" y="400" text-anchor="middle" class="fill-slate-400 text-xs font-mono">OUTDOOR TIMBER DECK</text>

          <!-- Structural Column Pins -->
          <g fill="#00e5ff">
            <rect x="55" y="75" width="10" height="10"/>
            <rect x="375" y="75" width="10" height="10"/>
            <rect x="595" y="75" width="10" height="10"/>
            <rect x="735" y="75" width="10" height="10"/>
            <rect x="55" y="315" width="10" height="10"/>
            <rect x="375" y="315" width="10" height="10"/>
            <rect x="595" y="315" width="10" height="10"/>
            <rect x="735" y="315" width="10" height="10"/>
          </g>

          <!-- North Compass -->
          <g transform="translate(730, 430)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#00e5ff" stroke-width="1"/>
            <polygon points="0,-16 5,4 0,0" fill="#00e5ff"/>
            <polygon points="0,-16 -5,4 0,0" fill="none" stroke="#00e5ff"/>
            <text x="0" y="-20" text-anchor="middle" class="fill-cyan-400 text-[10px] font-bold">N</text>
          </g>
        </svg>
      `;
    } else if (planKey === 'apex') {
      svgContainer.innerHTML = `
        <svg viewBox="0 0 800 500" class="w-full h-full max-h-[500px] select-none" id="bp-svg-element">
          <defs>
            <pattern id="svgGrid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" class="text-cyan-500/10" stroke-width="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svgGrid2)" />

          <!-- Tower Perimeter -->
          <rect x="80" y="60" width="640" height="380" fill="rgba(0, 229, 255, 0.04)" stroke="#00e5ff" stroke-width="2.5"/>

          <!-- Diagrid Structural Facade -->
          <g stroke="rgba(0, 229, 255, 0.25)" stroke-width="1.5">
            <line x1="80" y1="60" x2="240" y2="440"/>
            <line x1="240" y1="60" x2="80" y2="440"/>
            <line x1="240" y1="60" x2="400" y2="440"/>
            <line x1="400" y1="60" x2="240" y2="440"/>
            <line x1="400" y1="60" x2="560" y2="440"/>
            <line x1="560" y1="60" x2="400" y2="440"/>
            <line x1="560" y1="60" x2="720" y2="440"/>
            <line x1="720" y1="60" x2="560" y2="440"/>
          </g>

          <!-- Zone 3: Central Slip-Form RC Core -->
          <g id="svg-z3" class="cursor-pointer">
            <rect x="290" y="150" width="220" height="200" fill="rgba(0, 229, 255, 0.16)" stroke="#00e5ff" stroke-width="3"/>
            <text x="400" y="210" text-anchor="middle" class="fill-white text-xs font-bold font-sans">03. CENTRAL STRUCTURAL CORE</text>
            <text x="400" y="230" text-anchor="middle" class="fill-cyan-400 text-[10px] font-mono">6X PASSENGER LIFTS | SERVICE SHAFTS</text>
            <!-- Lifts -->
            <rect x="310" y="250" width="35" height="40" fill="none" stroke="#00e5ff"/>
            <rect x="355" y="250" width="35" height="40" fill="none" stroke="#00e5ff"/>
            <rect x="410" y="250" width="35" height="40" fill="none" stroke="#00e5ff"/>
            <rect x="455" y="250" width="35" height="40" fill="none" stroke="#00e5ff"/>
          </g>

          <!-- Zone 2: Column-Free Office Floor Plate -->
          <g id="svg-z2" class="cursor-pointer">
            <text x="180" y="240" text-anchor="middle" class="fill-white text-xs font-semibold font-sans">02. OPEN FLOOR PLATE</text>
            <text x="180" y="260" text-anchor="middle" class="fill-cyan-400 text-[10px] font-mono">5,800 SQ.FT USABLE</text>
            <text x="620" y="240" text-anchor="middle" class="fill-white text-xs font-semibold font-sans">EXECUTIVE CORNER</text>
            <text x="620" y="260" text-anchor="middle" class="fill-cyan-400 text-[10px] font-mono">FULL OCEAN VIEW</text>
          </g>

          <!-- Dimension annotations -->
          <g class="fill-amber-400 text-[10px] font-mono">
            <text x="400" y="45" text-anchor="middle">TYPICAL COMMERCIAL FLOOR PLATE - 36.00m SPAN</text>
          </g>
        </svg>
      `;
    } else {
      // Generic CAD fallback render for other plans
      svgContainer.innerHTML = `
        <svg viewBox="0 0 800 500" class="w-full h-full max-h-[500px] select-none" id="bp-svg-element">
          <defs>
            <pattern id="svgGrid3" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" class="text-cyan-500/10" stroke-width="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svgGrid3)" />
          <rect x="100" y="70" width="600" height="360" fill="rgba(0, 229, 255, 0.05)" stroke="#00e5ff" stroke-width="2"/>
          <line x1="100" y1="250" x2="700" y2="250" stroke="#00e5ff" stroke-width="1.5" stroke-dasharray="6,4"/>
          <line x1="400" y1="70" x2="400" y2="430" stroke="#00e5ff" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="400" y="160" text-anchor="middle" class="fill-white text-sm font-semibold">${data.title.toUpperCase()}</text>
          <text x="400" y="190" text-anchor="middle" class="fill-cyan-400 text-xs font-mono">DWG NO: ${data.dwgNo} | SCALE ${data.scale}</text>
          <text x="400" y="320" text-anchor="middle" class="fill-amber-400 text-xs font-mono">TOTAL FLOOR AREA: ${data.area}</text>
          <text x="400" y="350" text-anchor="middle" class="fill-slate-400 text-xs">STRUCTURAL SPEC: ${data.structure}</text>
        </svg>
      `;
    }
  }

  function highlightSvgZone(zoneId) {
    const el = document.getElementById(`svg-${zoneId}`);
    if (el) {
      el.style.transform = 'scale(1.02)';
      el.style.transformOrigin = 'center';
      setTimeout(() => {
        el.style.transform = '';
      }, 500);
    }
  }

  // Blueprint Plan Tab Buttons
  const bpTabs = document.querySelectorAll('.bp-tab-btn');
  bpTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      bpTabs.forEach(t => {
        t.classList.remove('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300');
        t.classList.add('border-slate-800', 'text-slate-400');
      });
      this.classList.add('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300');
      this.classList.remove('border-slate-800', 'text-slate-400');

      const planKey = this.getAttribute('data-plan');
      renderBlueprintViewer(planKey);
    });
  });

  // Blueprint Zoom Controls
  const btnZoomIn = document.getElementById('bp-zoom-in');
  const btnZoomOut = document.getElementById('bp-zoom-out');
  const btnZoomReset = document.getElementById('bp-zoom-reset');
  const svgWrapper = document.getElementById('bp-svg-wrapper');

  if (btnZoomIn && svgWrapper) {
    btnZoomIn.addEventListener('click', () => {
      viewerZoom = Math.min(viewerZoom + 0.2, 2.2);
      svgWrapper.style.transform = `scale(${viewerZoom})`;
    });
  }

  if (btnZoomOut && svgWrapper) {
    btnZoomOut.addEventListener('click', () => {
      viewerZoom = Math.max(viewerZoom - 0.2, 0.7);
      svgWrapper.style.transform = `scale(${viewerZoom})`;
    });
  }

  if (btnZoomReset && svgWrapper) {
    btnZoomReset.addEventListener('click', () => {
      viewerZoom = 1;
      svgWrapper.style.transform = 'scale(1)';
    });
  }

  // Initial load of blueprint viewer
  renderBlueprintViewer('crestline');

  // PDF Blueprint Spec Sheet Simulation Download
  const btnDownloadBp = document.getElementById('btn-download-bp');
  if (btnDownloadBp) {
    btnDownloadBp.addEventListener('click', () => {
      const data = blueprintData[activePlanKey];
      const specSheet = `========================================================
ARBERN HOLDINGS PVT LTD - ARCHITECTURAL BLUEPRINT SPECIFICATION
========================================================
PROJECT: ${data.title}
CATEGORY: ${data.category}
DRAWING NUMBER: ${data.dwgNo}
SCALE: ${data.scale}
GROSS FLOOR AREA: ${data.area}
LOCATION: ${data.location}
STRUCTURAL SYSTEM: ${data.structure}

ARCHITECTURAL ZONES:
${data.zones.map((z, idx) => `0${idx + 1}. ${z.name}\n   - Area: ${z.area}\n   - Floor Finish: ${z.finish}\n   - Ceiling Spec: ${z.ceiling}`).join('\n\n')}

GENERAL NOTES:
1. All dimensions are in millimeters unless noted otherwise.
2. Concrete compressive strength f'c = 35 MPa for superstructure.
3. High yield deformed rebar Grade 500 (BS 4449).
4. Copyright © 2026 Arbern Holdings Pvt Ltd. All rights reserved.
========================================================`;

      const blob = new Blob([specSheet], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Arbern-Blueprint-${activePlanKey.toUpperCase()}-SPEC.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Spec sheet for ${data.title} downloaded successfully!`);
    });
  }

  // --- 5. INTERACTIVE CONSTRUCTION COST & BOQ ESTIMATOR ---
  const projectTypeSelect = document.getElementById('calc-project-type');
  const areaSlider = document.getElementById('calc-area-slider');
  const areaValueDisplay = document.getElementById('calc-area-value');
  const floorsInput = document.getElementById('calc-floors');
  const gradeInputs = document.querySelectorAll('input[name="calc-grade"]');
  const optPool = document.getElementById('calc-opt-pool');
  const optSolar = document.getElementById('calc-opt-solar');
  const optSmart = document.getElementById('calc-opt-smart');
  const optLandscape = document.getElementById('calc-opt-landscape');

  // Cost Displays
  const costTotalLkr = document.getElementById('calc-cost-lkr');
  const costTotalUsd = document.getElementById('calc-cost-usd');
  const costPerSqFt = document.getElementById('calc-cost-sqft');
  const timeMonths = document.getElementById('calc-time-months');
  const steelTon = document.getElementById('calc-steel-ton');
  const concreteCuM = document.getElementById('calc-concrete-cum');

  function calculateEstimate() {
    if (!areaSlider || !costTotalLkr) return;

    const area = parseInt(areaSlider.value, 10);
    if (areaValueDisplay) {
      areaValueDisplay.textContent = `${area.toLocaleString()} Sq.Ft`;
    }

    const type = projectTypeSelect ? projectTypeSelect.value : 'residential';
    const floors = floorsInput ? parseInt(floorsInput.value, 10) || 1 : 2;

    let selectedGrade = 'architectural';
    gradeInputs.forEach(input => {
      if (input.checked) selectedGrade = input.value;
    });

    // Base rate per sq.ft in LKR (Reflecting modern quality construction in Sri Lanka)
    let baseRate = 18500; // Standard

    if (type === 'residential') {
      if (selectedGrade === 'standard') baseRate = 18500;
      else if (selectedGrade === 'architectural') baseRate = 24500;
      else if (selectedGrade === 'bespoke') baseRate = 34000;
    } else if (type === 'commercial') {
      if (selectedGrade === 'standard') baseRate = 22000;
      else if (selectedGrade === 'architectural') baseRate = 29000;
      else if (selectedGrade === 'bespoke') baseRate = 39500;
    } else if (type === 'industrial') {
      if (selectedGrade === 'standard') baseRate = 14500;
      else if (selectedGrade === 'architectural') baseRate = 19000;
      else if (selectedGrade === 'bespoke') baseRate = 26000;
    } else if (type === 'interior') {
      if (selectedGrade === 'standard') baseRate = 12000;
      else if (selectedGrade === 'architectural') baseRate = 18500;
      else if (selectedGrade === 'bespoke') baseRate = 28000;
    }

    // Floor height multiplier (higher floors require heavier substructure/cranes)
    let floorFactor = 1.0;
    if (floors > 3) {
      floorFactor += (floors - 3) * 0.035;
    }

    let totalLKR = area * baseRate * floorFactor;

    // Optional Add-ons
    if (optPool && optPool.checked) totalLKR += 6500000; // 6.5M LKR
    if (optSolar && optSolar.checked) totalLKR += Math.round(area * 550); // Solar sizing by area
    if (optSmart && optSmart.checked) totalLKR += Math.round(area * 400); // Smart automation
    if (optLandscape && optLandscape.checked) totalLKR += 2800000; // Landscaping package

    // Conversion rate USD (approx 310 LKR = 1 USD)
    const totalUSD = totalLKR / 310;
    const ratePerSqFt = Math.round(totalLKR / area);

    // Duration Estimation
    let duration = 6;
    if (area < 2500) duration = 8;
    else if (area < 5000) duration = 12;
    else if (area < 12000) duration = 18;
    else duration = 24;
    if (floors > 3) duration += Math.round((floors - 3) * 1.5);

    // Material rough BOQ estimates
    const steel = Math.round((area * 4.2) / 1000); // approx metric tons
    const concrete = Math.round(area * 0.14); // approx cubic meters

    // Update UI elements with smooth counting or formatting
    costTotalLkr.textContent = `LKR ${(totalLKR / 1000000).toFixed(2)} Million`;
    costTotalUsd.textContent = `≈ $${Math.round(totalUSD).toLocaleString()} USD`;
    costPerSqFt.textContent = `LKR ${ratePerSqFt.toLocaleString()} / Sq.Ft`;
    timeMonths.textContent = `${duration} - ${duration + 2} Months`;
    steelTon.textContent = `${steel} MT`;
    concreteCuM.textContent = `${concrete} m³`;
  }

  // Attach estimator event listeners
  if (areaSlider) areaSlider.addEventListener('input', calculateEstimate);
  if (projectTypeSelect) projectTypeSelect.addEventListener('change', calculateEstimate);
  if (floorsInput) floorsInput.addEventListener('input', calculateEstimate);
  gradeInputs.forEach(input => input.addEventListener('change', calculateEstimate));
  [optPool, optSolar, optSmart, optLandscape].forEach(opt => {
    if (opt) opt.addEventListener('change', calculateEstimate);
  });

  // Calculate initially
  calculateEstimate();

  // Transfer estimate to inquiry form
  const btnApplyEstimate = document.getElementById('btn-apply-estimate');
  if (btnApplyEstimate) {
    btnApplyEstimate.addEventListener('click', () => {
      const type = projectTypeSelect ? projectTypeSelect.options[projectTypeSelect.selectedIndex].text : '';
      const area = areaSlider ? areaSlider.value : '';
      const estCost = costTotalLkr ? costTotalLkr.textContent : '';

      const msgField = document.getElementById('contact-message');
      const subjectField = document.getElementById('contact-service');

      if (subjectField) {
        subjectField.value = 'General Turnkey Contracting';
      }
      if (msgField) {
        msgField.value = `Hello Arbern Holdings,\n\nI used your online CAD Cost Estimator with the following project parameters:\n- Project Type: ${type}\n- Estimated Floor Area: ${area} Sq.Ft\n- Estimated Budget: ${estCost}\n\nPlease contact me to arrange a site feasibility study and detailed architectural BOQ.`;
      }

      // Smooth scroll to contact form
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
      showToast('Estimator parameters transferred to your inquiry form!');
    });
  }

  // --- 6. FILTERABLE PROJECT PORTFOLIO & MODAL ---
  const projectCards = document.querySelectorAll('.project-card');
  const projectFilters = document.querySelectorAll('.project-filter-btn');

  projectFilters.forEach(btn => {
    btn.addEventListener('click', function () {
      projectFilters.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        b.classList.add('text-slate-400', 'hover:text-cyan-400');
      });
      this.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
      this.classList.remove('text-slate-400', 'hover:text-cyan-400');

      const filter = this.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 250);
        }
      });
    });
  });

  // Project Modal Viewer
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalImage = document.getElementById('modal-image');
  const modalLocation = document.getElementById('modal-location');
  const modalArea = document.getElementById('modal-area');
  const modalStructural = document.getElementById('modal-structural');
  const modalYear = document.getElementById('modal-year');
  const modalDescription = document.getElementById('modal-description');

  const projectDetails = {
    p1: {
      title: 'The Monolith Residence',
      subtitle: 'Bespoke Architectural Villa',
      category: 'Residential',
      location: 'Ward Place, Colombo 07',
      area: '5,200 Sq.Ft',
      structural: 'Post-Tensioned Slabs & Exposed Fair-Faced Concrete',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: 'An architectural dialogue between brutalist geometric solidity and tropical serenity. The residence utilizes cantilevered post-tensioned floor plates, internal bamboo courtyards, and floor-to-ceiling acoustic glass partitions.'
    },
    p2: {
      title: 'Vanguard Heights Commercial Center',
      subtitle: 'Corporate Headquarters & Retail',
      category: 'Commercial',
      location: 'Kollupitiya, Colombo 03',
      area: '110,000 Sq.Ft (16 Floors)',
      structural: 'Composite Steel Frame with Reinforced Central Slipform Core',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80',
      description: 'A 16-storey LEED Gold certified corporate landmark. Engineered with double-glazed low-E thermal envelope, smart automated building management systems (BMS), and column-free structural bays.'
    },
    p3: {
      title: 'Kandy Hillcrest Sanctuary',
      subtitle: 'Steep-Slope Luxury Retreat',
      category: 'Residential',
      location: 'Hanthana Range, Kandy',
      area: '6,400 Sq.Ft',
      structural: 'Micropiled Rock Anchors & Structural Steel Superstructure',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Perched on a 35-degree mountain slope overlooking the Knuckles mountain range. Deep micropile anchors into bedrock ensure seismic stability, while cantilevered infinity balconies float among the mist.'
    },
    p4: {
      title: 'Nexus Industrial Logistics Park',
      subtitle: 'Modern High-Cube Distribution Facility',
      category: 'Industrial',
      location: 'Biyagama Export Processing Zone',
      area: '78,000 Sq.Ft',
      structural: 'High-Tensile Pre-Engineered Steel with 42m Clear Spans',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      description: 'Commissioned for a multinational supply chain giant. Features jointless steel-fiber reinforced floor slabs capable of bearing 12-ton point loads, high-speed automated dock shelters, and 1.5MW rooftop solar power plant.'
    },
    p5: {
      title: 'The Glass Pavilion Penthouse',
      subtitle: 'Minimalist Interior Architecture',
      category: 'Interior',
      location: 'Havelock City Luxury Condominiums',
      area: '3,800 Sq.Ft',
      structural: 'Lightweight Acoustic Partitioning & Monolithic Terrazzo',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      description: 'Full interior structural overhaul with custom acoustic engineering, concealed linear climate diffusers, rimless flush doors, and hand-selected Italian Calacatta marble.'
    },
    p6: {
      title: 'Mirissa Coastal Pavilion Hotel',
      subtitle: 'Eco-Luxury Coastal Resort',
      category: 'Commercial',
      location: 'Mirissa Coastal Belt, Southern Province',
      area: '32,000 Sq.Ft',
      structural: 'Marine-Grade Sulfate-Resistant Concrete & Local Timber',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      description: 'Engineered specifically for coastal marine durability using specialized microsilica concrete mix designs, natural wind ventilation chimneys, and automated greywater recycling irrigation.'
    }
  };

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', function () {
      const pid = this.getAttribute('data-project-id');
      const data = projectDetails[pid];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalImage.src = data.image;
      modalImage.alt = data.title;
      modalLocation.textContent = data.location;
      modalArea.textContent = data.area;
      modalStructural.textContent = data.structural;
      modalYear.textContent = data.year;
      modalDescription.textContent = data.description;

      projectModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (projectModal) {
      projectModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // --- 7. CONTACT & INQUIRY FORM SUBMISSION ---
  const contactForm = document.getElementById('main-contact-form');
  const formSuccessModal = document.getElementById('form-success-modal');
  const formSuccessClose = document.getElementById('form-success-close');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const service = document.getElementById('contact-service').value;
      const message = document.getElementById('contact-message').value;

      if (!name || !email || !message) {
        showToast('Please fill out all required fields marked with *', true);
        return;
      }

      // Simulated successful dispatch
      const refCode = 'ARB-' + Math.floor(100000 + Math.random() * 900000);
      const refCodeEl = document.getElementById('success-ref-code');
      if (refCodeEl) refCodeEl.textContent = refCode;

      if (formSuccessModal) {
        formSuccessModal.classList.remove('hidden');
      }

      contactForm.reset();
      showToast(`Blueprint inquiry submitted! Reference: ${refCode}`);
    });
  }

  if (formSuccessClose && formSuccessModal) {
    formSuccessClose.addEventListener('click', () => {
      formSuccessModal.classList.add('hidden');
    });
  }

  // --- 8. TOAST NOTIFICATION UTILITY ---
  function showToast(message, isError = false) {
    let toastContainer = document.getElementById('cad-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'cad-toast-container';
      toastContainer.className = 'fixed bottom-6 left-6 z-50 flex flex-col space-y-2 pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `px-4 py-2.5 rounded-lg border font-mono text-xs flex items-center space-x-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 pointer-events-auto ${
      isError 
        ? 'bg-red-950/90 border-red-500 text-red-200' 
        : 'bg-slate-950/90 border-cyan-500 text-cyan-300'
    }`;
    toast.innerHTML = `
      <span class="inline-block w-2 h-2 rounded-full ${isError ? 'bg-red-400' : 'bg-cyan-400 animate-ping'}"></span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Expose toast to global scope
  window.showToast = showToast;

});
