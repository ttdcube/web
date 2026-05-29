
# 🏥 ClinicFlow - Hệ thống Đặt Lịch Khám Bệnh Trực Tuyến

## Giới thiệu
ClinicFlow là một hệ thống quản lý đặt lịch khám bệnh trực tuyến hiện đại, được xây dựng với HTML, CSS, JavaScript thuần và LocalStorage để lưu trữ dữ liệu. Hệ thống cung cấp trải nghiệm người dùng hoàn chỉnh cho bệnh nhân, bác sĩ và quản trị viên.

## Tính năng chính

### 👤 Bệnh nhân
- Trang chủ giới thiệu dịch vụ chuyên nghiệp
- Đăng ký / Đăng nhập tài khoản
- Đặt lịch khám với bác sĩ
- Xem và quản lý lịch hẹn
- Chỉnh sửa hồ sơ cá nhân
- Tìm kiếm và lọc bác sĩ
- Chế độ tối (Dark Mode)
- Thông báo Toast

### 👨‍⚕️ Bác sĩ
- Dashboard tổng quan thống kê
- Quản lý lịch khám (xác nhận, hoàn thành, hủy)
- Danh sách bệnh nhân đã khám
- Chỉnh sửa hồ sơ bác sĩ
- Cấu hình lịch làm việc
- Lọc và tìm kiếm cuộc hẹn
- Chế độ tối

### 🛡️ Quản trị viên
- Dashboard thống kê hệ thống
- Quản lý bác sĩ (thêm, sửa, xóa)
- Quản lý bệnh nhân (xem, sửa, xóa)
- Quản lý lịch hẹn (thay đổi trạng thái)
- Biểu đồ thống kê đơn giản
- Lọc và tìm kiếm nâng cao
- Chế độ tối

## Công nghệ sử dụng
- **HTML5** - Cấu trúc trang web
- **CSS3** - Giao diện và responsive
- **JavaScript (ES6+)** - Xử lý logic và tương tác
- **LocalStorage** - Lưu trữ dữ liệu trên trình duyệt
- **Font Awesome (emoji)** - Icons đơn giản

## Cách cài đặt và chạy

### Yêu cầu
- Trình duyệt hiện đại (Chrome, Firefox, Edge, Safari)
- Python 3.x (để chạy server đơn giản)

### Chạy hệ thống
1. **Clone repo về máy** (nếu chưa):
   ```bash
   git clone https://github.com/ttdcube/web.git
   cd web
   ```
2. **Chạy server** (2 cách):
   - Cách 1 (dễ nhất): Nhấp đôi file `start.bat`
   - Cách 2 (sử dụng terminal):
     ```bash
     python -m http.server 8000
     ```
3. **Mở trình duyệt** và truy cập: http://localhost:8000

## Tài khoản thử nghiệm

| Vai trò    | Email                     | Mật khẩu   | Mô tả                               |
|------------|---------------------------|------------|-------------------------------------|
| Admin      | `admin@clinicflow.com`    | `admin123` | Quản lý toàn bộ hệ thống           |
| Bác sĩ     | `doctor@clinicflow.com`   | `123456`   | Quản lý lịch khám và hồ sơ bệnh nhân |
| Bệnh nhân  | `patient@example.com`     | `123456`   | Đặt lịch khám và xem hồ sơ cá nhân |

## Cấu trúc thư mục
```
web bac si/
├── css/
│   ├── base.css         # Biến CSS và reset
│   ├── components.css   # Component như nút, form, modal
│   ├── layout.css       # Layout chung, sidebar, navbar
│   └── responsive.css   # Responsive design
├── data/
│   └── seed.js          # Dữ liệu mẫu ban đầu
├── js/
│   ├── utils.js         # Hàm tiện ích chung
│   ├── core/
│   │   ├── auth.js      # Xử lý đăng nhập/đăng ký
│   │   ├── storage.js   # Quản lý LocalStorage
│   │   └── ui.js        # Xử lý giao diện (toast, modal, theme)
│   └── features/        # Chức năng chính
│       ├── doctors.js
│       ├── appointments.js
│       ├── dashboard.js
│       ├── doctor-dashboard.js
│       ├── doctor-appointments.js
│       ├── doctor-patients.js
│       ├── doctor-profile.js
│       ├── doctor-schedules.js
│       ├── doctors-admin.js
│       ├── patients-admin.js
│       ├── appointments-admin.js
│       └── charts.js
├── pages/
│   ├── index.html (Landing page)
│   ├── login.html
│   ├── register.html
│   ├── doctors.html
│   ├── doctor-detail.html
│   ├── patient/         # Dashboard bệnh nhân
│   ├── doctor/          # Dashboard bác sĩ
│   └── admin/           # Dashboard admin
├── v1-backup/           # Phiên bản cũ (backup)
├── index.html
├── start.bat
└── README.md
```

## Hướng dẫn sử dụng cơ bản

### Đặt lịch khám (Bệnh nhân)
1. Đăng nhập với tài khoản bệnh nhân
2. Vào trang "Bác sĩ"
3. Chọn bác sĩ mong muốn
4. Chọn ngày và giờ khám
5. Nhấn "Xác nhận đặt lịch"

### Quản lý lịch khám (Bác sĩ)
1. Đăng nhập với tài khoản bác sĩ
2. Vào trang "Lịch khám"
3. Thay đổi trạng thái cuộc hẹn (Xác nhận, Hoàn thành, Hủy)

### Quản lý hệ thống (Admin)
1. Đăng nhập với tài khoản admin
2. Truy cập các trang quản lý (Bác sĩ, Bệnh nhân, Lịch hẹn)
3. Thực hiện các thao tác thêm, sửa, xóa

## Lưu ý quan trọng
- Dữ liệu được lưu trong LocalStorage, vì vậy **xóa dữ liệu trình duyệt sẽ mất toàn bộ thông tin**
- Hệ thống không dùng backend, không dùng cơ sở dữ liệu thật
- Đây là phiên bản demo, phù hợp cho đồ án hoặc mục đích học tập

## Liên hệ
Nếu có thắc mắc, vui lòng tạo issue trên repo GitHub!

---
**ClinicFlow - Đặt lịch khám dễ dàng, tiết kiệm thời gian!** 💙
