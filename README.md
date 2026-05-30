
# 🏥 ClinicFlow - Hệ thống đặt lịch khám bệnh

Đồ án quản lý lịch khám bệnh với đầy đủ chức năng cho bệnh nhân, bác sĩ và quản trị viên!

## 📋 Tính năng chính

### 👨‍⚕️ Vai trò
- **Quản trị viên**: Quản lý bác sĩ, xem thống kê, quản lý lịch hẹn
- **Bác sĩ**: Xem lịch khám, quản lý bệnh nhân, cập nhật lịch làm việc
- **Bệnh nhân**: Đặt lịch khám, xem lịch sử, cập nhật hồ sơ

## 🛠️ Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript (vanilla JS)
- Responsive Design, hỗ trợ Dark Mode
- Giao diện hiện đại, dễ dùng

### Backend
- Node.js + Express
- Cơ sở dữ liệu SQLite (better-sqlite3)
- Xác thực JWT
- Mã hóa mật khẩu bcrypt

## 🚀 Cách chạy dự án

### Yêu cầu
- Node.js (v16+)
- Python 3.x (cho frontend dev server)

### Cách 1: Dùng script (dễ nhất)
Nhấn đúp vào file `start.bat` (Windows) hoặc chạy:
```powershell
.\start.ps1
```

### Cách 2: Dùng npm
```bash
# Cài đặt toàn bộ dependencies
npm run install:all

# Khởi động cả backend và frontend
npm start
```

### Cách 3: Chạy riêng lẻ
```bash
# Backend (http://localhost:5000)
cd backend
npm install
npm start

# Frontend (http://localhost:8000)
cd frontend
python -m http.server 8000
```

## 👤 Tài khoản thử nghiệm

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Quản trị viên | admin@clinicflow.com | admin123 |
| Bác sĩ (mặc định) | doctor@clinicflow.com | (tạo trong DB) |
| Bệnh nhân | Đăng ký bằng form đăng ký | |

## 📁 Cấu trúc thư mục

```
clinicflow/
├── backend/
│   ├── server.js          # Express API server
│   ├── database.js        # Cơ sở dữ liệu SQLite
│   └── package.json
├── frontend/
│   ├── index.html         # Trang chủ
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   │   ├── core/          # Auth, API, Storage, UI
│   │   └── features/      # Logic từng trang
│   └── pages/             # Tất cả các trang
├── start.bat              # Khởi động hệ thống (Windows)
├── start.ps1              # Khởi động hệ thống (PowerShell)
└── package.json           # Script quản lý dự án
```

## 📝 Ghi chú
- Dữ liệu được lưu trong `backend/clinicflow.db`
- Đổi cổng trong `backend/server.js` nếu cần
- File database sẽ được tạo tự động khi chạy lần đầu

## 📄 License
MIT
