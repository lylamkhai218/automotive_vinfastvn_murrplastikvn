# INDUSTRIAL QUOTE & CUSTOMS AUTOMATION RULES

## Multi-Page Invoice & Customs Processing Rules:
1. Whenever the user provides multi-page invoices, quotes, or packing lists (PDF/XLS/XLSX up to 50+ pages):
   - Always run automated data extraction using Python (`pdfplumber`, `pandas`, `openpyxl`).
   - Immediately after extracting Order No (e.g. `83201208`, `83693082`, `83691502`), search `https://shop.murrplastik.com/search?q={order_no}` to fetch direct product URL, product images, official specs, and material details.
   - Standardize technical names into Vietnamese technical terms.
   - Assign exact material compositions (Polyamide PA6, Aluminum, Elastomer, Steel).
   - Assign exact reference HS codes (`3926.90.99`, `8479.89.99`, `4016.99.99`, `3917.40.00`, `3917.39.00`).
   - Export 2 separate workbooks:
     1. Technical Quote Workbook (`Murrplastik_Danh_sach_vat_tu_...xlsx`) with Drive/Shop hyperlinks.
     2. Customs Declaration Workbook (`Danh_sach_vat_tu_hai_quan_...xlsx`) with 3 sheets formatted in Burgundy `#800020` header styling.
