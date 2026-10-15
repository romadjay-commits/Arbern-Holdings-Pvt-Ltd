# Arbern Holdings Pvt Ltd - Official Architectural & Construction Website

An ultra-modern, minimalist, high-performance website crafted specifically for **Arbern Holdings Pvt Ltd** (Civil Engineering, Structural Contracting & Architectural Master Planning).

---

## 🌟 Key Features

1. **Parallax AutoCAD Blueprint & Floor Plan Background**:
   - High-DPI HTML5 Canvas engine rendering real 2D & 3D AutoCAD drawings directly into the background:
     - **Plate 01**: 2-Storey Luxury Minimalist Villa Ground Floor Plan (Double-line walls, door swing arcs, room areas, column grid bubbles A-E / 1-5, dimension strings).
     - **Plate 02**: Commercial Tower Structural Elevation & Slip-Form Core (Elevations up to +36.0m, foundation piles, wind bracing).
     - **Plate 03**: Foundation Footing & Column Tie Beam Layout Grid (Pad footings, tie beams TB-1/TB-2, rebar schedules).
     - **Plate 04**: Master Site Plan & Official AutoCAD Title Block with ISO 9001:2015 stamps.
   - Smooth 60fps parallax scrolling that glides through the architectural plates as you scroll down the page.
   - Real-time CAD Viewport Coordinate HUD (`X: mm`, `Y: mm`, `EL: +m`, `Scroll progress`).
   - Precision CAD Crosshair Cursor with live dimension tracking.

2. **Interactive Blueprint Station**:
   - Dynamic tabbed floor plan studio featuring:
     - *The Crestline Villa (Luxury Residential - 4,850 Sq.Ft)*
     - *Arbern Apex Tower (Commercial Landmark - 86,000 Sq.Ft)*
     - *Logistics Matrix Hub (Industrial Steel Portal - 64,000 Sq.Ft)*
     - *Horizon Sky Penthouse (Minimalist Interior Architecture - 3,600 Sq.Ft)*
   - Zoom in, Zoom out, and Reset view controls.
   - Interactive zone inspection with material specifications (Italian Travertine, Raw Fair-Faced Concrete, Low-E Glazing).
   - "Download Technical Spec Sheet" button that exports a full architectural specification text file.

3. **Real-Time Construction Cost & BOQ Estimator**:
   - Customized for Sri Lankan construction rates and international standards:
     - Project type selector (Residential, Commercial, Industrial, Interior Fit-out).
     - Floor area slider (1,500 to 20,000+ Sq.Ft).
     - Number of storeys / levels counter.
     - Finishing grade tiers (Standard, Premium Architectural, Ultra-Luxury Bespoke).
     - Add-ons: Cantilevered pool, solar micro-grid, smart automation, landscaping.
     - Live calculation of total investment in **LKR (Millions)** and **USD**, estimated timeline in months, steel tonnage, and readymix concrete volume.
     - "Transfer to Formal BOQ Inquiry" button that auto-populates the consultation form!

4. **Floating CAD Control Dock**:
   - Toggle CAD Millimeter Grid (ON/OFF).
   - Toggle Architectural Dimensions & Room Labels (ON/OFF).
   - Toggle Structural Columns & Rebar Grid (ON/OFF).
   - CAD Visual Style Theme Switcher:
     - **Cyan Blueprint** (Electric Cyan on Deep Navy `#070c16`)
     - **Obsidian Dark** (Crisp Monochrome White on Dark Slate `#08080a`)
     - **Light Technical** (Architectural Parchment `#f4f6fa`)

5. **Filterable Project Portfolio & Dossier Modal**:
   - Filter projects by: *All, Residential, Commercial, Industrial, Interior*.
   - Architectural hover blueprint wireframe overlay.
   - Fullscreen dossier modal with high-res photography, structural data, and architect statements.

6. **Consultation & Inquiry Transmittal System**:
   - Professional project scope submission form with instant reference code generation (e.g. `ARB-984210`).
   - Corporate headquarters details in Colombo 02, direct hotline, and direct WhatsApp engineering desk.

---

## 🚀 How to Run (Zero Node.js Required!)

As requested, this project is built using pure **HTML5, CSS3, Vanilla JavaScript, and Tailwind CSS (CDN)**.

1. Simply double-click **`index.html`** or right-click and choose **Open with > Google Chrome / Microsoft Edge / Firefox**.
2. No Node.js, no `npm install`, and no terminal commands are required!

---

## 📁 Project Structure

```
ARBRN/
├── index.html                 # Complete main application & responsive layout
├── README.md                  # Documentation & user guide
└── assets/
    ├── css/
    │   └── styles.css         # Custom CAD grid, glow effects, corner marks & themes
    ├── js/
    │   ├── cad-background.js  # High-performance Canvas CAD parallax engine
    │   └── main.js            # UI interactions, blueprint viewer, cost calculator, modals
    └── images/                # Image assets folder
```

---

## 🎨 Technology Stack

- **HTML5** (Semantic, Accessible, SEO Optimized)
- **Tailwind CSS** (via official CDN)
- **Vanilla JavaScript (ES6+)** (No dependencies, ultra-fast performance)
- **HTML5 Canvas 2D Context** (For smooth 60fps AutoCAD drafting simulations)
- **FontAwesome 6** (Architectural & Engineering icons)
- **Google Fonts** (`Space Grotesk`, `Plus Jakarta Sans`, `JetBrains Mono`)
