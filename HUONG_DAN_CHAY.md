
# Hướng dẫn chạy hệ thống ClinicFlow

## Cách 1: Dùng PowerShell (đề xuất)
Nhấp phải vào file `run.ps1` → Chọn "Run with PowerShell"

## Cách 2: Chạy thủ công
### Bước 1: Chạy Backend
1. Mở Command Prompt (CMD) hoặc PowerShell
2. Đi vào thư mục `backend/`:
   ```
   cd backend
   ```
3. Chạy backend:
   ```
   npm start
   ```
   Backend sẽ chạy trên http://localhost:5000

### Bước 2: Chạy Frontend
1. Mở một cửa sổ Command Prompt/PowerShell mới
2. Đi vào thư mục `frontend/`:
   ```
   cd frontend
   ```
3. Chạy frontend:
   ```
   python -m http.server 8000
   ```
   Frontend sẽ chạy trên http://localhost:8000

### Bước 3: Mở trình duyệt
Truy cập địa chỉ: http://localhost:8000

## Tài khoản thử nghiệm
- Admin: `admin@clinicflow.com` / `admin123`
