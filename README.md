
# 🏥 ClinicFlow - Hệ thống đặt lịch khám bệnh trực tuyến

Hệ thống đặt lịch khám bệnh hoàn chỉnh bằng **HTML/CSS/JavaScript thuần**, dùng **LocalStorage** để lưu dữ liệu, không cần backend hay framework!

## ✨ Tính năng chính
- ✅ Đăng ký/Đăng nhập (Vai trò: Bệnh nhân, Admin)
- ✅ Quản lý hồ sơ bệnh nhân
- ✅ Danh sách bác sĩ, lọc theo chuyên khoa
- ✅ Đặt lịch khám (chọn ngày, giờ; kiểm tra trùng lịch)
- ✅ Xem lịch sử và hủy lịch
- ✅ Dashboard quản trị (thống kê, xem tất cả lịch)
- ✅ Responsive mobile/tablet/desktop
- ✅ UI hiện đại (màu trắng-xanh y tế, toast, modal, hover mềm)

## 🚀 Cách chạy hệ thống

### 1. Dùng PowerShell (đề xuất)
Nhấp phải vào file **`start-server.ps1`** → chọn **Run with PowerShell**!

Nếu báo lỗi chính sách, chạy lệnh này trong PowerShell (quyền Admin):
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Dùng Python (nếu đã cài)
Mở thư mục dự án → chạy lệnh:
```powershell
python -m http.server 8000
```
Sau đó mở trình duyệt vào: http://localhost:8000

## 🔑 Tài khoản mẫu
| Vai trò | Email | Mật khẩu |
| ------- | ----- | -------- |
| Admin | admin@clinicflow.com | admin123 |
| Bệnh nhân | Tự đăng ký | - |

## 📂 Cấu trúc dự án
```
web bac si/
├── css/                # Tệp CSS
│   ├── base.css        # Biến, reset
│   ├── components.css  # Buttons, cards, modal...
│   ├── layout.css      # Navbar, hero, grid...
│   └── responsive.css  # Responsive mobile/tablet
├── js/                 # Tệp JavaScript
│   ├── storage.js      # Quản lý LocalStorage
│   ├── ui.js           # Toast, modal, format...
│   ├── auth.js         # Đăng ký/đăng nhập
│   ├── doctor.js       # Danh sách bác sĩ
│   └── appointment.js  # Đặt, xem, hủy lịch
├── data/
│   └── initial-data.js # Dữ liệu mẫu (bác sĩ, chuyên khoa)
├── index.html          # Trang chủ
├── login.html          # Đăng nhập
├── register.html       # Đăng ký
├── patient.html        # Trang bệnh nhân
├── admin.html          # Trang quản trị
├── start-server.ps1    # Script chạy server PowerShell
└── README.md
```

## 📝 Lưu ý
- Dữ liệu được lưu trong **LocalStorage** của trình duyệt → sẽ mất nếu xóa lịch sử trình duyệt
- Không dùng cho sản xuất thật (chưa mã hóa mật khẩu, không có HTTPS...)
- Dùng cho mục đích học tập và dự án môn học!

## 📬 Liên hệ
Nếu có thắc mắc, mở issue trên GitHub!
