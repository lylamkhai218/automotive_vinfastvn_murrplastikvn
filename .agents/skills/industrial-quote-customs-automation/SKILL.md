---
name: industrial-quote-customs-automation
description: Automation pipeline to parse multi-page industrial invoices/quotes (PDF/XLS/XLSX), search shop.murrplastik.com with strict Order No (e.g. 83201208) + English product name matching to extract exact product links, images, and technical specs, generate technical proposal Excel workbooks, and build Customs declaration Excel files with Vietnamese translations, material compositions, usage descriptions, HS code lookup, and Drive hyperlinks.
---

# QUY TRÌNH CHUẨN (SOP) - TỰ ĐỘNG HÓA BÁO GIÁ & KHAI BÁO HẢI QUAN HÀNG CÔNG NGHIỆP / MURRPLASTIK

Quy trình này hướng dẫn tự động hóa xử lý các hóa đơn, báo giá, bảng kê hải quan dài từ vài trang đến hàng chục/hàng trăm trang (PDF/Excel) từ hãng cấp Murrplastik (Đức) hoặc các nhà cung cấp công nghiệp.

---

## 🏗️ CẤU TRÚC PIPELINE TỰ ĐỘNG HÓA 5 BƯỚC

```mermaid
graph TD
    A[PDF / Excel Invoice / Báo giá 50+ trang] --> B[1a. Trích xuất Mã Order No + Tên hàng tiếng Anh]
    B --> B2[1b. Auto-Search shop.murrplastik.com với Thuật toán Lọc Chính xác 3 Lớp]
    B2 --> C[2. Bóc tách Link Sản phẩm Chuẩn, Ảnh thực tế & Thông số Kỹ thuật]
    C --> D[3. Chuẩn hóa & Map Từ điển Tiếng Việt + HS Code + Chất liệu]
    D --> E[4. Xuất Báo giá Kỹ thuật .xlsx kèm Hyperlink Shop & Ảnh]
    D --> F[5. Xuất Bảng kê Hải quan 3-Sheet .xlsx]
```

---

## 📌 BƯỚC 1: TRÍCH XUẤT DỮ LIỆU & THUẬT TOÁN BẮT SẢN PHẨM CHÍNH XÁC 100% (EXACT MATCH ALGORITHM)

### 1a. Trích xuất cặp dữ liệu từ Invoice:
- Đọc đồng thời cặp thông tin từ Invoice: `[Mã Order No]` + `[Tên sản phẩm tiếng Anh]` (Ví dụ: `83201208` + `EW-R-PP M12/P09`).

### 1b. Thuật toán Lọc Sản phẩm Chính xác 3 Lớp (3-Layer Exact Match):

Do kết quả tìm kiếm trên `shop.murrplastik.com/search-page?q=83201208` có thể trả về cả các sản phẩm có chứa chuỗi con tương tự (VD: `SVY 201208` có mã `83701428`), hệ thống áp dụng thuật toán lọc 3 lớp:

1. **Lớp 1: Strict Order No Verification (Lọc khớp 100% Mã Order No):**
   - Quét từng thẻ sản phẩm trả về trong danh sách kết quả (`Variants`).
   - Đọc trường `Order no.: XXXXXXXX` trong HTML. BẮT BUỘC `Order no.` phải bằng đúng `83201208` (Loại bỏ ngay `SVY 201208` vì mã của nó là `83701428`).

2. **Lớp 2: Product Name Cross-Validation (Đối chiếu Tên sản phẩm tiếng Anh từ Invoice):**
   - Lấy Tên sản phẩm tiếng Anh trên Invoice (VD: `EW-R-PP`, `SH 56/70-M`, `R-Tec Liner`, `KEG/AK`, `A-ZS`).
   - Đối chiếu từ khóa tiền tố (Prefix / Family Name) với Tiêu đề sản phẩm trên web để chọn đúng biến thể chuẩn 100%.

3. **Lớp 3: Direct Parameter Match (`matnr={Order_No}`):**
   - Định tuyến thẳng tới URL chứa tham số gốc `matnr={Order_No}` (VD: `https://shop.murrplastik.com/p/cable-protection-conduits-ew-r-pp-185461?matnr=83201208`).

---

## 📌 BƯỚC 2: QUY TRÌNH CHUẨN HÓA VÀ ÁP MÃ HẢI QUAN (CUSTOMS DATA MAPPING)

Tự động kết hợp dữ liệu cào từ hãng với **Từ điển Danh mục Kỹ thuật Việt hóa** (Technical Dictionary):

### Bảng tra cứu Chuẩn hóa Hàng Murrplastik & Công nghiệp:

| Nhóm hàng | Tên Việt hóa Hải quan | Chất liệu cấu thành | Mã HS Code tham khảo | Công dụng |
| --- | --- | --- | --- | --- |
| **System Holder (SH)** | Giá đỡ ống luồn dây cáp bằng nhựa PA6 có nắp kim loại | Nhựa Polyamide PA6 + Nắp Thép | `3926.90.99` hoặc `7326.90.99` | Định vị gá đỡ ống dẫn hướng cáp trên robot |
| **R-Tec Liner** | Hộp cơ cấu thu hồi cáp tự động tích hợp lò xo | Nhựa PA6 + Lò xo Thép + Hợp kim Nhôm | `8479.89.99` hoặc `3926.90.99` | Tự động kéo rút đàn hồi bảo vệ cáp nguồn robot |
| **Strain Relief / A-ZS / R-ZL** | Vòng đệm / Tấm đệm cao su giảm ứng lực căng cáp | Cao su đàn hồi Elastomer | `4016.99.99` | Siết chặt giảm ứng lực căng kéo thắt cáp |
| **Ball Joint (KEG/KMG)** | Khớp nối cầu vạn năng định hướng ống luồn | Nhựa Polyamide PA6 | `3917.40.00` hoặc `3926.90.99` | Khớp nối xoay đa hướng cho ống luồn cáp |
| **Conduit Ring (SRF)** | Vòng định vị kẹp giữ ống luồn | Nhựa Polyamide PA6 | `3917.40.00` | Định vị hành trình co gập của ống |
| **Tubing (EW / EWX / EW-R-PP)** | Ống gợn sóng bảo vệ đường dây điện | Nhựa Polypropylene / Polyamide | `3917.39.00` | Bọc bảo vệ cáp điện nguồn và tín hiệu |

---

## 📌 BƯỚC 3: XUẤT 2 FILE EXCEL CHUẨN KÈM HYPERLINK SẢN PHẨM & ẢNH HÃNG

### File 1: `Murrplastik_Danh_sach_vat_tu_Bao_gia_[Campaign].xlsx`
- **Mục đích:** Chào giá Kỹ thuật cho Khách hàng (VinFast, v.v.).
- **Định dạng:** 
  - Chia Sheet theo từng Dòng Máy / Robot (VD: Sheet `ABB IRB 7600`, Sheet `ABB IRB 6700`).
  - Gắn Hyperlink tự động dẫn đến **Shop Murrplastik chính hãng** (URL chính xác 100%) và **Thư mục Ảnh thực tế Google Drive**.

### File 2: `Danh_sach_vat_tu_hai_quan_Murrplastik_[Campaign].xlsx`
- **Mục đích:** Khai báo & Giải trình Hải quan cho bộ phận XNK.
- **Cấu trúc 3 Sheet:**
  1. `Tong_hop_Hai_quan`: Danh mục gom tất cả mặt hàng + HS Code + Tên Việt Hóa + Chất liệu + Công dụng.
  2. `Chi_tiet_[Robot_1]`: Chi tiết phân bổ cho Robot 1.
  3. `Chi_tiet_[Robot_2]`: Chi tiết phân bổ cho Robot 2.
- **Định dạng giao diện:** Font Arial/Inter, Header màu Burgundy `#800020` chữ trắng, kẻ ô viền mảnh, căn lề văn bản tự động, tự động độ rộng cột (`autofit_columns`).

---

## 🛠️ CÁCH SỬ DỤNG SCRIPT TỰ ĐỘNG (PYTHON SCRIPT EXECUTION)

Chạy script Python trong thư mục `scripts/parse_and_export.py` để xử lý file Invoice 50+ trang và cào shop với thuật toán lọc chính xác:

```bash
python .agents/skills/industrial-quote-customs-automation/scripts/parse_and_export.py --input "[Duong_dan_file_Invoice.pdf_hoac_xlsx]" --fetch-shop --exact-match --output-dir "./"
```
