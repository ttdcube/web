
# ClinicFlow - Hệ thống đặt lịch khám bệnh trực tuyến

Backend + Frontend riêng biệt

## Công nghệ sử dụng
- **Frontend**: HTML, CSS, JavaScript thuần, Responsive
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)

## Cài đặt và chạy

### 1. Cài đặt dependencies backend
```bash
cd backend
npm install
```

### 2. Chạy backend
```bash
cd backend
npm start
```
Backend sẽ chạy trên `http://localhost:5000`

### 3. Chạy frontend
Mở terminal mới, chạy:
```bash
cd frontend
python -m http.server 8000
```
Hoặc dùng file `start.bat` nếu có.

Mở trình duyệt vào `http://localhost:8000`

## Thông tin tài khoản
- **Admin**: `admin@clinicflow.com` / `admin123`
- Bệnh nhân: Tự đăng ký

## Cấu trúc thư mục
```
web bac si/
├── backend/
│   ├── server.js       # Server Express
│   ├── database.js     # CSDL SQLite
│   └── package.json
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── patient.html
    ├── admin.html
    ├── css/
    ├── js/
    └── assets/
```
