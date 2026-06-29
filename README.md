# automotive_vinfastvn_murrplastikvn

A high-end, interactive engineering survey report and technical solution presentation platform for upgrading the robotic Dress Pack (cable guide protection) systems at the VinFast Automotive Manufacturing Plant in Hai Phong, Vietnam.

This project is a collaboration between **T&T Vina** (exclusive authorized distributor of Murrplastik in Vietnam) and **Murrplastik Systemtechnik GmbH** (Germany) to address cable tension and breakage issues on ABB heavy-duty industrial welding robots.

---

## 📋 Project Overview

When industrial robots operate at high frequencies and wide angular ranges (specifically axes 5 and 6), their cable protection systems (Dress Packs) are subject to extreme mechanical stress. This repository hosts a double-deliverable system:
1. **Interactive Web Landing Page**: A premium, responsive, single-page Web GUI showcasing the survey results, the root causes of the issues (using Becker systems), and the proposed mechanical solutions with an interactive WebGL 3D model viewer and media galleries.
2. **Compiled A4 Engineering Report (PDF)**: A page-budgeted, professionally formatted corporate report generated dynamically from a print-optimized HTML/CSS template to provide an offline deliverable for executive review.

---

## 🛠️ Key Features

- **Interactive 3D STL Viewer**: Embedded Three.js-based WebGL container loaded with the `R-Tec Liner 550mm` model (`83693086.STP`/`STL`), allowing engineers to rotate, zoom, and inspect the product in 3D.
- **Accident Survey Gallery**: High-resolution image grid displaying structural failures on existing Becker assemblies (cracks, tape patches, and missing markers).
- **Interactive Lightbox**: Clean media modal for inspecting component pictures and actual installations.
- **Dynamic Scroll-Spy Navigation**: Auto-highlighting navbar indicating the user's current reading section.
- **Page-Budgeted PDF Compiler**: A Python automated compiler (`generate_pdf_report.py`) using Playwright to launch a headless browser, apply professional `@media print` layouts, and output a clean, 5-page PDF document.

---

## 💻 Tech Stack

- **Frontend**: HTML5 (Semantic Structure), Vanilla CSS3 (Custom Glassmorphism and Industrial Dark Theme), Modern Typography (Montserrat & Inter via Google Fonts), FontAwesome Icons.
- **3D Engine**: Three.js (WebGL), OrbitControls, STLLoader.
- **PDF Compilation Pipeline**: Python 3, Playwright (Headless Chromium), Python `http.server`.

---

## 📁 Repository Structure

```
automotive_vinfastvn_murrplastikvn/
│
├── index.html            # Main web landing page (Dark theme)
├── style.css             # Layout, animations, and typography styles
├── app.js                # Three.js renderer and UI interaction logic
├── pdf_report.html       # Print-specific template for the PDF
├── pdf_report.css        # Professional A4 margins, headers/footers
├── generate_pdf_report.py# Python script to compile the PDF report
├── generate_pdf.py       # Legacy page PDF capture script
│
├── Ảnh hiện trạng/           # Survey photos showing failures on-site
├── Ảnh giải pháp/            # Technical drawings, drawings, and simulation videos
├── Ảnh phụ kiện ABB 7600...  # Accessory list photos for ABB IRB 7600
├── Ảnh phụ kiện ABB 6700...  # Accessory list photos for ABB IRB 6700
├── R-Tec_Liner_550mm.stl     # Three.js compatible 3D model
├── R-Tec Liner 550mm...stp   # CAD exchange file (STP format for download)
└── Bao_cao_giai_phap_...pdf  # Final compiled 5-page PDF report
```

---

## 🚀 Getting Started

### 1. View the Web Report Locally
To start the local web server and preview the landing page:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000/index.html`

### 2. Generate/Update the PDF Report
To compile the PDF report from the source template:
```bash
pip install playwright
playwright install
python generate_pdf_report.py
```
This will start a temporary server, load the layout, render the tables/visuals, and output a fresh copy of `Bao_cao_giai_phap_Vinfast_Murrplastik.pdf` in the root folder.
