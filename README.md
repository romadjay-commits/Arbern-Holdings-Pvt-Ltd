# Arbern Holdings Pvt Ltd - Official Architectural & Construction Website

An ultra-modern, realistic, high-performance architectural studio website crafted for **Arbern Holdings Pvt Ltd** (Civil Engineering, Structural Contracting & Architectural Master Planning).

---

## 🏢 Corporate Contact Information

* **Head Office Address**: 425/G2, Jayagath Mawatha, Kahathuduwa, Polgasowita, Sri Lanka
* **Direct Hotlines**: 071-0497611 / 076-5514551
* **WhatsApp Desk**: +94 71 049 7611 / +94 76 551 4551
* **Accreditations**: ISO 9001:2015 & CIDA Accredited

---

## 🌟 Key Features & Visual Design

1. **Realistic Architectural Light Theme (Official Letterhead Palette)**:
   - Designed to match the company's official corporate identity:
     - **Arbern Emerald Green** (`#16a34a` / `#22c55e`)
     - **Architectural Charcoal & Slate** (`#1e293b` / `#334155`)
     - **Crisp Clean White & Soft Off-White** (`#ffffff` / `#f8fafc`)
     - Authentic architectural perspective wireframe background blended seamlessly from the company letterhead.

2. **Parallax AutoCAD Blueprint & Floor Plan Background Canvas**:
   - High-DPI HTML5 Canvas engine rendering real 2D & 3D AutoCAD drawings directly into the background:
     - **Plate 01**: 2-Storey Luxury Minimalist Villa Ground Floor Plan (Double-line walls, door swings, room areas, column grid bubbles A–E / 1–5, dimension strings).
     - **Plate 02**: Architectural Perspective Study & Glass Facade Wireframe (Vanishing point perspective matching the company letterhead).
     - **Plate 03**: Foundation Footing & Column Tie Beam Layout Grid (Pad footings, tie beams `TB-1`, rebar schedules).
     - **Plate 04**: Master Site Plan & Official AutoCAD Title Block with revision stamps.
   - Smooth 60fps parallax scrolling that glides through the architectural plates as you scroll.
   - Real-time CAD Viewport Coordinate HUD (`X: mm`, `Y: mm`, `EL: +m`, `Scroll progress`).
   - Precision AutoCAD Crosshair Cursor with live millimeter dimension tracking.

3. **Interactive Blueprint Station**:
   - Dynamic tabbed floor plan studio featuring:
     - *The Crestline Villa (Luxury Residential - 4,850 Sq.Ft)*
     - *Arbern Apex Tower (Commercial Landmark - 86,000 Sq.Ft)*
     - *Logistics Matrix Hub (Industrial Steel Portal - 64,000 Sq.Ft)*
     - *Horizon Sky Penthouse (Minimalist Interior Architecture - 3,600 Sq.Ft)*
   - Zoom in, Zoom out, and Reset view controls.
   - Interactive zone inspection with material specifications (Italian Travertine, Raw Fair-Faced Concrete, Low-E Glazing).
   - "Download Technical Spec Sheet" button that exports a full architectural specification text file.

4. **Real-Time Construction Cost & BOQ Estimator**:
   - Customized for Sri Lankan construction rates and international standards (SLS 573):
     - Project type selector (Residential, Commercial, Industrial, Interior Fit-out).
     - Floor area slider (1,500 to 20,000+ Sq.Ft).
     - Number of storeys / levels counter.
     - Finishing grade tiers (Standard, Premium Architectural, Ultra-Luxury Bespoke).
     - Add-ons: Cantilevered pool, solar micro-grid, smart automation, landscaping.
     - Live calculation of total investment in **LKR (Millions)** and **USD**, estimated timeline in months, steel tonnage, and readymix concrete volume.
     - "Transfer to Formal BOQ Inquiry" button that auto-populates the consultation form!

5. **Floating CAD Control Dock**:
   - Toggle CAD Millimeter Grid (ON/OFF).
   - Toggle Architectural Dimensions & Room Labels (ON/OFF).
   - Toggle Structural Columns & Rebar Grid (ON/OFF).
   - Visual Style Switcher: **Realistic Light** & **Dark Studio**.

6. **Filterable Project Portfolio & Dossier Modal**:
   - Filter projects by: *All, Residential, Commercial, Industrial, Interior*.
   - Fullscreen dossier modal with high-res photography, structural data, and architect statements.

7. **Consultation & Inquiry Transmittal System**:
   - Professional project scope submission form with instant reference code generation (e.g. `ARB-984210`).
   - Direct hotline and WhatsApp integration.

---

## 🚀 How to Run (Zero Node.js Required!)

Built using pure **HTML5, CSS3, Vanilla JavaScript, and Tailwind CSS (CDN)**.

1. Double-click **`index.html`** or right-click and choose **Open with > Google Chrome / Microsoft Edge / Firefox**.
2. Zero Node.js, zero `npm install`, zero build steps needed!

---

## 📁 Project Structure

```
ARBRN/
├── index.html                 # Main website application
├── README.md                  # Documentation & user guide
└── assets/
    ├── css/
    │   └── styles.css         # Realistic architectural styling, Arbern colors & themes
    ├── js/
    │   ├── cad-background.js  # Parallax Canvas CAD floorplan & perspective engine
    │   └── main.js            # UI interactions, blueprint viewer, cost calculator, modals
    └── images/
        ├── arbern-logo.png    # Official Arbern Holdings logo
        └── arbern-letterhead.jpg # Official Arbern letterhead & perspective background
```
