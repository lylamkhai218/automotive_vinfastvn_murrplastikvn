# Kế hoạch triển khai - Báo cáo sự cố và giải pháp Dress Pack Robot Vinfast

Chúng tôi sẽ xây dựng một trang web báo cáo dạng **Landing Page một trang duy nhất (Single-page)** hiện đại, cao cấp với phong cách thiết kế kính mờ (glassmorphism) kết hợp tông màu đỏ/đen của Murrplastik. Trang web sẽ bao gồm tất cả các phần nội dung chảy dọc từ trên xuống dưới với hiệu ứng cuộn mượt mà (smooth scrolling) và thanh điều hướng cố định (sticky navigation). Đồng thời, tạo một tập lệnh python sử dụng Playwright để kết xuất trang Landing Page này thành báo cáo PDF khổ A4 chất lượng cao có cùng thiết kế giao diện sang trọng.

## Yêu cầu ý kiến người dùng

> [!IMPORTANT]
> **Các quyết định kỹ thuật & thiết kế chính:**
> 1. **Cấu trúc Landing Page:** Thiết kế cuộn dọc một trang duy nhất giúp tạo trải nghiệm liền mạch, chuyên nghiệp như một trang giới thiệu sản phẩm cao cấp của Apple hoặc Murrplastik. Điều này cũng giúp tệp PDF khi in ra tự động phân trang một cách tự nhiên và liên tục.
> 2. **Chủ đề & Màu sắc:** Nền đen tối sang trọng (`#0d0d0d`) kết hợp các hiệu ứng phát sáng mờ (ambient glow) đỏ Murrplastik (`#d51e29`), các thẻ kính mờ (glassmorphism cards) sử dụng đường viền mảnh phát sáng nhẹ và nền mờ sâu (`backdrop-filter: blur(16px)`).
> 3. **Trình xem 3D tương tác:** Đưa mô hình 3D của tệp STL đã chuyển đổi (`R-Tec_Liner_550mm.stl`) vào khu vực "Giải pháp đề xuất", cho phép khách hàng xoay và zoom trực quan trên web.
> 4. **Trình chiếu ảnh/video sự cố & giải pháp:** Sử dụng bố cục so sánh trực quan (trước/sau hoặc lỗi/sửa đổi) cho các bức ảnh hiện trạng bị vỡ cáp và ảnh giải pháp lắp ráp mới.
> 5. **Phương pháp tạo file PDF:** Dùng Playwright mở trang Landing Page (thông qua máy chủ HTTP cục bộ chạy ngầm để đảm bảo tải đầy đủ tài nguyên 3D) và xuất thành tệp PDF khổ A4 với cấu hình ngắt trang tối ưu (`page-break-inside: avoid` cho các thẻ thông tin).

## Các thay đổi đề xuất

### [Ứng dụng Web & Báo cáo]

#### [NEW] [index.html](file:///d:/T&TVina/Campain/Vinfast/index.html)
- Cấu trúc HTML chính cho trang Landing Page.
- Thanh menu điều hướng cố định ở đầu trang (Sticky Header) hiển thị logo T&T Vina, Murrplastik và Vinfast, kèm các nút cuộn nhanh đến các phần và nút tải bản PDF.
- Bố cục dọc gồm các chương mục rõ ràng:
  - **Phần 1: Hero Section** (Tiêu đề lớn, thông tin chung cuộc họp 3 bên, lời mở đầu).
  - **Phần 2: Biên bản cuộc họp** (Thông tin tóm tắt cuộc họp 23/06/2026, đối tác tham gia, nguyên nhân cốt lõi).
  - **Phần 3: Hiện trạng thực tế** (Trình bày các hình ảnh chụp thực tế cáp Becker cũ bị vỡ, quấn băng dính tại Vinfast).
  - **Phần 4: Giải pháp cải tiến** (Thông tin về R-Tec Liner của Murrplastik, kèm trình xem 3D trực quan, bản vẽ kỹ thuật mặt cắt, mặt trên, và video mô phỏng).
  - **Phần 5: Danh mục vật tư chi tiết** (Hiển thị bảng vật tư kèm hình ảnh phụ kiện thực tế WebP cho dòng robot ABB IRB 7600 và IRB 6700).
  - **Phần 6: Kế hoạch hành động & Phân công** (Bảng đầu việc và phân công trách nhiệm cho các bên gồm Vinfast, T&T Vina và Murrplastik, **không hiển thị thời gian cụ thể**).

#### [NEW] [style.css](file:///d:/T&TVina/Campain/Vinfast/style.css)
- Định nghĩa hệ thống màu sắc chủ đạo đỏ/đen, phông chữ cao cấp (Montserrat/Inter).
- Thiết lập giao diện kính mờ cao cấp với các đường viền chuyển màu tinh tế (gradient borders), bóng đổ mờ ảo (drop shadows) và chuyển động mượt mà (transitions) khi di chuyển chuột.
- Các quy tắc `@media print` tối ưu hóa in ấn:
  - Ẩn thanh menu cố định (sticky header) và các nút điều khiển mô hình 3D.
  - Định cấu hình ngắt trang (`page-break-before: always` cho các chương mục lớn để khi in PDF, mỗi chương mục bắt đầu ở một trang mới tinh tế).
  - Đảm bảo hiển thị đầy đủ màu nền tối sang trọng trong tệp PDF.

#### [NEW] [app.js](file:///d:/T&TVina/Campain/Vinfast/app.js)
- Xử lý hiệu ứng cuộn mượt (smooth scroll) khi bấm vào thanh menu điều hướng.
- Khởi tạo môi trường Three.js hiển thị mô hình STL 3D của R-Tec Liner với ánh sáng dạng studio chuyên nghiệp (directional & ambient lights).
- Hỗ trợ hiển thị hộp thoại phóng to ảnh phụ kiện (Lightbox) khi người dùng nhấp vào ảnh linh kiện trong bảng vật tư.
- Kích hoạt sự kiện `'model-loaded'` báo hiệu cho Playwright tiến hành xuất PDF khi mô hình 3D hoàn tất hiển thị.

#### [NEW] [generate_pdf.py](file:///d:/T&TVina/Campain/Vinfast/generate_pdf.py)
- Khởi chạy một server HTTP Python nhẹ ở chế độ nền.
- Khởi chạy trình duyệt Playwright Chromium.
- Truy cập vào địa chỉ `http://localhost:8000/index.html`.
- Đợi sự kiện `'model-loaded'` từ JavaScript để đảm bảo ảnh 3D đã được vẽ lên màn hình.
- Xuất trang thành tệp PDF chất lượng cao `Bao_cao_giai_phap_Vinfast_Murrplastik.pdf` với các tùy chọn căn lề chuẩn A4.
- Đóng máy chủ HTTP và hoàn tất.

## Kế hoạch kiểm tra xác nhận

### Kiểm tra tự động
- Chạy lệnh `python generate_pdf.py` để biên dịch trang web ra tập tin PDF.
- Kiểm tra dung lượng tập tin PDF và xác nhận tập tin đã được tạo thành công trong thư mục làm việc.

### Kiểm tra thủ công
- Mở `index.html` trên trình duyệt để tương tác trực tiếp với mô hình 3D, kiểm tra khả năng tương thích hiển thị trên giao diện điện thoại di động và các bộ sưu tập ảnh linh kiện.
- Mở tệp `Bao_cao_giai_phap_Vinfast_Murrplastik.pdf` bằng trình đọc PDF để kiểm tra chất lượng hiển thị hình ảnh 3D, tính rõ ràng của văn bản và sự thẳng hàng của các trang in.
