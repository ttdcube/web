# Medical Booking HTML

Ứng dụng HTML/CSS/JS thuần mô phỏng hệ thống đặt lịch khám bệnh trực tuyến.

## Cấu trúc

- `index.html`: Trang chủ giới thiệu và chuyển hướng.
- `patient-profile.html`: Giao diện bệnh nhân xem/cập nhật hồ sơ và đặt lịch.
- `doctor-schedule.html`: Giao diện bác sĩ quản lý lịch rảnh.
- `assets/css/base.css`: Reset CSS, biến màu trắng/xanh ngọc và font.
- `assets/css/layout.css`: Header, main layout, grid/flex.
- `assets/css/components.css`: Button, input, card, calendar UI.
- `assets/css/responsive.css`: Media queries mobile-first.
- `assets/js/api.js`: Lớp dữ liệu mô phỏng API bằng localStorage.
- `assets/js/profile.js`: Load/lưu hồ sơ bệnh nhân.
- `assets/js/schedule.js`: Render khung giờ, chọn/hủy giờ.
- `assets/js/validation.js`: Kiểm tra SĐT, email, năm sinh.

## Chức năng

- Bệnh nhân lưu hồ sơ, xem cảnh báo y tế và đặt lịch khám.
- Bác sĩ xem calendar, click 1 lần để đánh dấu bận đột xuất.
- Kiểm tra khung giờ còn chỗ theo sức chứa của bác sĩ.
- Giao diện tối giản, trắng/xanh ngọc, tối ưu mobile.
- Validate tức thì cho SĐT, email và năm sinh.

## Chạy dự án

Mở trực tiếp `index.html` bằng trình duyệt. Không cần `npm install`.
