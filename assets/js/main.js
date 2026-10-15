/**
 * Arbern Holdings Pvt Ltd - Main Application Script
 * Vanilla JavaScript (No Node.js required)
 * Realistic Architectural Studio Theme (Arbern Green & Charcoal)
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
    if (window.scrollY > 30) {
      navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-md');
      navbar.classList.remove('bg-white/80');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
      navbar.classList.add('bg-white/80', 'backdrop-blur-md');
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
      this.classList.toggle('bg-emerald-50', active);
      this.classList.toggle('text-emerald-700', active);
      this.classList.toggle('border-emerald-500', active);
      showToast(`CAD Grid: ${active ? 'ENABLED' : 'DISABLED'}`);
    });
  }

  if (btnToggleDims && window.CADController) {
    btnToggleDims.addEventListener('click', function () {
      const active = window.CADController.toggleDimensions();
      this.classList.toggle('bg-emerald-50', active);
      this.classList.toggle('text-emerald-700', active);
      this.classList.toggle('border-emerald-500', active);
      showToast(`CAD Dimensions: ${active ? 'ENABLED' : 'DISABLED'}`);
    });
  }

  if (btnToggleStruct && window.CADController) {
    btnToggleStruct.addEventListener('click', function () {
      const active = window.CADController.toggleStructural();
      this.classList.toggle('bg-emerald-50', active);
      this.classList.toggle('text-emerald-700', active);
      this.classList.toggle('border-emerald-500', active);
      showToast(`Structural Columns & Grid: ${active ? 'ENABLED' : 'DISABLED'}`);
    });
  }

  if (themeSelect && window.CADController) {
    themeSelect.value = window.CADController.getTheme();
    themeSelect.addEventListener('change', function () {
      window.CADController.setTheme(this.value);
      showToast(`Theme: ${this.options[this.selectedIndex].text}`);
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
      location: 'Kahathuduwa, Polgasowita',
      structure: 'Post-Tensioned Slabs with Cantilevered Structural Steel Pergolas',
      desc: 'A masterwork in minimalist tropical modernism. Featuring seamless indoor-outdoor transitions, a 16-meter cantilevered lap pool, raw exposed architectural fair-faced concrete, and central biophilic light courts.',
      zones: [
        { id: 'z1', name: 'Grand Living Hall & Double-Height Atrium', area: '720 Sq.Ft', finish: 'Italian Travertine Flamed Stone', ceiling: '3.8m Raw Board-Marked Concrete' },
        { id: 'z2', name: 'Master Executive Suite & Terrace', area: '580 Sq.Ft', finish: 'Solid Teak Parquet Flooring', ceiling: 'Concealed Shadow-Line Acoustic Drywall' },
        { id: 'z3', name: 'Open Minimalist Kitchen & Dry Bar', area: '340 Sq.Ft', finish: 'Monolithic Quartz Island with Matte Charcoal Joinery', ceiling: 'Integrated Linear Micro-LED Troffers' },
        { id: 'z4', name: 'Cantilevered Infinity Lap Pool', area: '16m x 4m', finish: 'Midnight Sukabumi Stone with Glass Balustrade', ceiling: 'Open Sky with Automated Louver Roof' }
      ]
    },
    apex: {
      title: 'Arbern Apex Corporate Tower',
      category: 'Commercial Headquarters',
      dwgNo: 'AH-COM-2026-T12',
      scale: '1:100',
      area: '86,000 Sq.Ft (14 Storeys)',
      location: 'Colombo Commercial District',
      structure: 'Central Slip-Form RC Core with Composite Steel Decks & Diagrid Bracing',
      desc: 'High-performance Grade-A commercial office tower engineered for LEED Platinum certification. Double-skin ventilated glass facade, column-free office floor plates, and rooftop executive boardroom pavilion.',
      zones: [
        { id: 'z1', name: 'Ground Floor Grand Triple-Height Lobby', area: '3,400 Sq.Ft', finish: 'Honed Pietra Grey Marble & Architectural Bronze', ceiling: '9.2m Suspended Timber Acoustic Baffles' },
        { id: 'z2', name: 'Typical Floor Column-Free Office Plate', area: '5,800 Sq.Ft', finish: 'Heavy-Duty Raised Access Flooring (600mm)', ceiling: '2.8m Clear Height with Intelligent Sensor Grid' },
        { id: 'z3', name: 'Shear Wall Core & High-Speed Lifts', area: '850 Sq.Ft', finish: 'C50/60 High-Strength Concrete Core', ceiling: 'Pressurized Fire Escape & Service Risers' },
        { id: 'z4', name: 'Rooftop Helipad & Executive Terrace', area: '4,200 Sq.Ft', finish: 'Reinforced Heli-Deck with Solar Canopy', ceiling: 'Panoramic 360° Skyline View' }
      ]
    },
    industrial: {
      title: 'Logistics Matrix Smart Hub',
      category: 'High-Tech Industrial',
      dwgNo: 'AH-IND-2026-M4',
      scale: '1:200',
      area: '64,000 Sq.Ft Clear Span',
      location: 'Export Processing Zone',
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
      location: 'Colombo Luxury Residences',
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
        <div class="bp-zone-item p-3.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm cursor-pointer transition-all duration-200" data-zone-id="${zone.id}">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-mono font-bold text-emerald-600">ZONE 0${idx + 1}</span>
            <span class="text-xs font-mono text-amber-600 font-semibold">${zone.area}</span>
          </div>
          <h4 class="text-sm font-semibold text-slate-800 mb-1">${zone.name}</h4>
          <div class="text-[11px] text-slate-500 space-y-0.5 font-mono">
            <div><span class="text-slate-400">FINISH:</span> ${zone.finish}</div>
            <div><span class="text-slate-400">CEILING:</span> ${zone.ceiling}</div>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.bp-zone-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
          const zoneId = this.getAttribute('data-zone-id');
          highlightSvgZone(zoneId);
        });
      });
    }

    renderSvgFloorplan(planKey);
  }

  function renderSvgFloorplan(planKey) {
    const svgContainer = document.getElementById('bp-svg-wrapper');
    if (!svgContainer) return;

    if (planKey === 'crestline') {
      svgContainer.innerHTML = `
        <svg viewBox="0 0 800 500" class="w-full h-full max-h-[500px] select-none" id="bp-svg-element">
          <defs>
            <pattern id="svgGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svgGrid)" />

          <!-- Dimensions Top -->
          <g class="text-amber-700 stroke-amber-600 fill-amber-700 text-[10px] font-mono">
            <line x1="60" y1="40" x2="740" y2="40" stroke-width="1"/>
            <line x1="55" y1="35" x2="65" y2="45" stroke-width="1.5"/>
            <line x1="735" y1="35" x2="745" y2="45" stroke-width="1.5"/>
            <text x="400" y="32" text-anchor="middle">24,500 mm [80'-4"] RESIDENCE LENGTH</text>
          </g>

          <!-- Zone 1: Living & Atrium -->
          <g id="svg-z1" class="cursor-pointer transition-all duration-300">
            <rect x="60" y="80" width="320" height="240" fill="rgba(248, 250, 252, 0.85)" stroke="#334155" stroke-width="2" class="hover:fill-emerald-50"/>
            <text x="220" y="190" text-anchor="middle" class="fill-slate-900 text-xs font-semibold font-sans">01. GRAND LIVING & ATRIUM</text>
            <text x="220" y="210" text-anchor="middle" class="fill-emerald-600 text-[11px] font-mono font-medium">720 SQ.FT | HT: 3.8m</text>
            <rect x="120" y="120" width="100" height="50" fill="none" stroke="#94a3b8" stroke-dasharray="4,4"/>
            <rect x="150" y="140" width="40" height="20" fill="none" stroke="#94a3b8"/>
          </g>

          <!-- Zone 2: Master Suite -->
          <g id="svg-z2" class="cursor-pointer transition-all duration-300">
            <rect x="380" y="80" width="220" height="240" fill="rgba(248, 250, 252, 0.85)" stroke="#334155" stroke-width="2" class="hover:fill-emerald-50"/>
            <text x="490" y="190" text-anchor="middle" class="fill-slate-900 text-xs font-semibold font-sans">02. MASTER SUITE</text>
            <text x="490" y="210" text-anchor="middle" class="fill-emerald-600 text-[11px] font-mono font-medium">580 SQ.FT | TERRACE</text>
            <rect x="440" y="110" width="80" height="70" fill="none" stroke="#94a3b8"/>
          </g>

          <!-- Zone 3: Kitchen & Dry Bar -->
          <g id="svg-z3" class="cursor-pointer transition-all duration-300">
            <rect x="600" y="80" width="140" height="240" fill="rgba(248, 250, 252, 0.85)" stroke="#334155" stroke-width="2" class="hover:fill-emerald-50"/>
            <text x="670" y="190" text-anchor="middle" class="fill-slate-900 text-xs font-semibold font-sans">03. KITCHEN</text>
            <text x="670" y="210" text-anchor="middle" class="fill-emerald-600 text-[11px] font-mono font-medium">340 SQ.FT</text>
            <line x1="615" y1="95" x2="615" y2="305" stroke="#334155" stroke-width="1.5"/>
          </g>

          <!-- Zone 4: Cantilevered Infinity Pool -->
          <g id="svg-z4" class="cursor-pointer transition-all duration-300">
            <rect x="60" y="340" width="480" height="110" fill="rgba(34, 197, 94, 0.08)" stroke="#16a34a" stroke-width="2" class="hover:fill-emerald-100/50"/>
            <text x="300" y="390" text-anchor="middle" class="fill-slate-900 text-xs font-semibold font-sans">04. CANTILEVERED LAP POOL (16M X 4M)</text>
            <text x="300" y="410" text-anchor="middle" class="fill-emerald-700 text-[10px] font-mono font-medium">WATER CAP: 75,000L | SUKABUMI NATURAL STONE</text>
            <path d="M 80 430 Q 140 425 200 430 T 320 430 T 440 430" fill="none" stroke="#16a34a" stroke-width="1"/>
          </g>

          <!-- Verandah Deck -->
          <rect x="540" y="340" width="200" height="110" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="640" y="400" text-anchor="middle" class="fill-slate-500 text-xs font-mono">OUTDOOR TIMBER DECK</text>

          <!-- Structural Column Pins (Arbern Green) -->
          <g fill="#16a34a">
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
            <circle cx="0" cy="0" r="18" fill="none" stroke="#334155" stroke-width="1"/>
            <polygon points="0,-16 5,4 0,0" fill="#16a34a"/>
            <polygon points="0,-16 -5,4 0,0" fill="none" stroke="#334155"/>
            <text x="0" y="-20" text-anchor="middle" class="fill-slate-800 text-[10px] font-bold">N</text>
          </g>
        </svg>
      `;
    } else {
      svgContainer.innerHTML = `
        <svg viewBox="0 0 800 500" class="w-full h-full max-h-[500px] select-none" id="bp-svg-element">
          <defs>
            <pattern id="svgGridGen" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svgGridGen)" />
          <rect x="90" y="60" width="620" height="380" fill="rgba(248, 250, 252, 0.85)" stroke="#334155" stroke-width="2.5"/>
          <line x1="90" y1="250" x2="710" y2="250" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="6,4"/>
          <line x1="400" y1="60" x2="400" y2="440" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="400" y="160" text-anchor="middle" class="fill-slate-900 text-sm font-semibold">${data.title.toUpperCase()}</text>
          <text x="400" y="190" text-anchor="middle" class="fill-emerald-600 text-xs font-mono font-medium">DWG NO: ${data.dwgNo} | SCALE ${data.scale}</text>
          <text x="400" y="320" text-anchor="middle" class="fill-amber-600 text-xs font-mono">TOTAL FLOOR AREA: ${data.area}</text>
          <text x="400" y="350" text-anchor="middle" class="fill-slate-600 text-xs font-sans">STRUCTURAL SPEC: ${data.structure}</text>
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
        t.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
        t.classList.add('border-slate-300', 'text-slate-600', 'bg-white');
      });
      this.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
      this.classList.remove('border-slate-300', 'text-slate-600', 'bg-white');

      const planKey = this.getAttribute('data-plan');
      renderBlueprintViewer(planKey);
    });
  });

  // Zoom Controls
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

  renderBlueprintViewer('crestline');

  // Spec Sheet Download
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

HEADQUARTERS: 425/G2, Jayagath Mawatha, Kahathuduwa, Polgasowita
HOTLINES: 071-0497611 | 076-5514551

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

  // --- 5. CONSTRUCTION COST & BOQ ESTIMATOR ---
  const projectTypeSelect = document.getElementById('calc-project-type');
  const areaSlider = document.getElementById('calc-area-slider');
  const areaValueDisplay = document.getElementById('calc-area-value');
  const floorsInput = document.getElementById('calc-floors');
  const gradeInputs = document.querySelectorAll('input[name="calc-grade"]');
  const optPool = document.getElementById('calc-opt-pool');
  const optSolar = document.getElementById('calc-opt-solar');
  const optSmart = document.getElementById('calc-opt-smart');
  const optLandscape = document.getElementById('calc-opt-landscape');

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

    let baseRate = 18500;
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

    let floorFactor = 1.0;
    if (floors > 3) {
      floorFactor += (floors - 3) * 0.035;
    }

    let totalLKR = area * baseRate * floorFactor;

    if (optPool && optPool.checked) totalLKR += 6500000;
    if (optSolar && optSolar.checked) totalLKR += Math.round(area * 550);
    if (optSmart && optSmart.checked) totalLKR += Math.round(area * 400);
    if (optLandscape && optLandscape.checked) totalLKR += 2800000;

    const totalUSD = totalLKR / 310;
    const ratePerSqFt = Math.round(totalLKR / area);

    let duration = 6;
    if (area < 2500) duration = 8;
    else if (area < 5000) duration = 12;
    else if (area < 12000) duration = 18;
    else duration = 24;
    if (floors > 3) duration += Math.round((floors - 3) * 1.5);

    const steel = Math.round((area * 4.2) / 1000);
    const concrete = Math.round(area * 0.14);

    costTotalLkr.textContent = `LKR ${(totalLKR / 1000000).toFixed(2)} Million`;
    costTotalUsd.textContent = `≈ $${Math.round(totalUSD).toLocaleString()} USD`;
    costPerSqFt.textContent = `LKR ${ratePerSqFt.toLocaleString()} / Sq.Ft`;
    timeMonths.textContent = `${duration} - ${duration + 2} Months`;
    steelTon.textContent = `${steel} MT`;
    concreteCuM.textContent = `${concrete} m³`;
  }

  if (areaSlider) areaSlider.addEventListener('input', calculateEstimate);
  if (projectTypeSelect) projectTypeSelect.addEventListener('change', calculateEstimate);
  if (floorsInput) floorsInput.addEventListener('input', calculateEstimate);
  gradeInputs.forEach(input => input.addEventListener('change', calculateEstimate));
  [optPool, optSolar, optSmart, optLandscape].forEach(opt => {
    if (opt) opt.addEventListener('change', calculateEstimate);
  });

  calculateEstimate();

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
        msgField.value = `Hello Arbern Holdings,\n\nI used your online Feasibility Estimator with the following project parameters:\n- Project Type: ${type}\n- Estimated Floor Area: ${area} Sq.Ft\n- Estimated Budget: ${estCost}\n\nPlease contact me at your earliest convenience to arrange a site visit and detailed architectural BOQ.`;
      }

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
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
        b.classList.add('text-slate-600', 'hover:text-emerald-700');
      });
      this.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
      this.classList.remove('text-slate-600', 'hover:text-emerald-700');

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
      title: 'Kahathuduwa Hillside Modern Villa',
      subtitle: 'Luxury Modern Tropical Residence',
      category: 'Residential',
      location: 'Kahathuduwa, Polgasowita',
      area: '5,800 Sq.Ft',
      structural: 'Reinforced Concrete Framework with Cantilevered Infinity Balconies',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Seamless integration of natural greenery, open courtyards, and clean architectural volumes. Designed and built by Arbern Holdings featuring custom timber pergolas and passive solar cooling.'
    },
    p4: {
      title: 'Nexus Industrial Logistics Park',
      subtitle: 'Modern High-Cube Distribution Facility',
      category: 'Industrial',
      location: 'Export Processing Zone',
      area: '78,000 Sq.Ft',
      structural: 'High-Tensile Pre-Engineered Steel with 42m Clear Spans',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      description: 'Commissioned for a leading logistics operator. Features jointless steel-fiber reinforced floor slabs capable of bearing 12-ton point loads, high-speed automated dock shelters, and 1.5MW rooftop solar power plant.'
    },
    p5: {
      title: 'The Glass Pavilion Penthouse',
      subtitle: 'Minimalist Interior Architecture',
      category: 'Interior',
      location: 'Colombo Luxury Residences',
      area: '3,800 Sq.Ft',
      structural: 'Lightweight Acoustic Partitioning & Monolithic Terrazzo',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      description: 'Full interior structural overhaul with custom acoustic engineering, concealed linear climate diffusers, rimless flush doors, and hand-selected Italian marble.'
    },
    p6: {
      title: 'Southern Coastal Pavilion Hotel',
      subtitle: 'Eco-Luxury Coastal Resort',
      category: 'Commercial',
      location: 'Southern Coastal Belt',
      area: '32,000 Sq.Ft',
      structural: 'Marine-Grade Sulfate-Resistant Concrete & Local Teak',
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
      const message = document.getElementById('contact-message').value;

      if (!name || !email || !message) {
        showToast('Please fill out all required fields marked with *', true);
        return;
      }

      const refCode = 'ARB-' + Math.floor(100000 + Math.random() * 900000);
      const refCodeEl = document.getElementById('success-ref-code');
      if (refCodeEl) refCodeEl.textContent = refCode;

      if (formSuccessModal) {
        formSuccessModal.classList.remove('hidden');
      }

      contactForm.reset();
      showToast(`Inquiry submitted! Reference Code: ${refCode}`);
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
    toast.className = `px-4 py-2.5 rounded-lg border font-mono text-xs flex items-center space-x-2.5 shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-auto ${
      isError 
        ? 'bg-red-50 border-red-300 text-red-800' 
        : 'bg-white border-emerald-500 text-slate-800'
    }`;
    toast.innerHTML = `
      <span class="inline-block w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500 animate-ping'}"></span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  window.showToast = showToast;

});
