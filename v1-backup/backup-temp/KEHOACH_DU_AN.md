
# KẾ HOẠCH DỰ ÁN: HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH ONLINE (CLINICFLOW)

---

## Giới thiệu

Tài liệu này trình bày kế hoạch chi tiết cho dự án phát triển hệ thống đặt lịch khám bệnh trực tuyến ClinicFlow, bao gồm phân tích yêu cầu, thiết kế luồng người dùng, cơ sở dữ liệu, kiến trúc hệ thống và lộ trình thực hiện.

---

## Mục lục
1.  [Nghiên cứu nền tảng (Phase 1: Nghiên cứu nền tảng
2.  [Phân tích yêu cầu hệ thống
3.  [Thiết kế User Flow
4.  [Thiết kế cơ sở dữ liệu chuẩn
5.  [Đề xuất kiến trúc hệ thống tối ưu
6.  [Giải thích lý do chọn kiến trúc
7.  [Lộ trình thực hiện (Sprint Planning)

---

## Phần 1: Nghiên cứu nền tảng

### Tổng kết nghiên cứu
Dựa trên nghiên cứu các hệ thống đặt lịch khám hiện đại, dashboard quản lý bệnh viện và giao diện health-tech, chúng tôi rút ra các điểm chính:

1.  **Thiết kế ưu tiên di động (Mobile-first)
    - 80% người dùng truy cập trang healthcare qua điện thoại di động
    - Nút bấm lớn, dễ thao tác, bố cục đơn giản

2.  **Quyền truy cập dựa trên vai trò (RBAC - Role-Based Access Control)
    - 3 vai trò chính: Bệnh nhân, Bác sĩ, Quản trị viên
    - Mỗi vai trò có dashboard và quyền truy cập riêng

3.  **Thiết kế giao diện tin cậy
    - Màu xanh dương/xanh lá cây tạo cảm giác yên tâm
    - Không rườm rà, tập trung vào nội dung chính
    - Độ tương phản cao, dễ đọc cho mọi đối tượng người dùng

4.  **Thiết kế luồng đặt lịch
    - Nhiều bước nhưng rõ ràng, có chỉ báo tiến trình
    - Yêu cầu thông tin tối thiểu ở bước đầu tiên, mở rộng sau

5.  **Thiết kế RESTful API chuẩn
    - Sử dụng JWT để xác thực
    - Phân lớp rõ ràng: Controller - Service - Repository

---

## Phần 2: Phân tích yêu cầu hệ thống

### Yêu cầu chức năng
| Module | Yêu cầu chi tiết |
|--------|-----------------|
| **Xác thực người dùng | - Đăng ký/Đăng nhập bằng JWT - Mật khẩu được mã hóa BCrypt - Phân quyền dựa trên vai trò |
| **Hồ sơ bệnh nhân | - Xem/Cập nhật thông tin cá nhân - Lưu thông tin y tế (nhóm máu, dị ứng, tiền sử bệnh |
| **Đặt lịch khám | - Tìm kiếm bác sĩ theo chuyên khoa - Xem lịch trống theo thời gian thực - Chọn ngày, giờ, lý do khám - Xác nhận lịch - Nhận nhắc lại qua SMS/Email |
| **Quản lý lịch bác sĩ | - Xem lịch tuần - Đánh dấu khoảng thời gian bận - Xác nhận/từ chối yêu cầu đặt lịch - Xem danh sách bệnh nhân đã đặt lịch |
| **Dashboard quản trị | - Quản lý người dùng - Tổng quan về lịch khám - Thống kê, báo cáo |
| **Tránh trùng lịch | - Hoạt động nguyên tử (Atomic Operations) để khóa slot trong quá trình đặt lịch |

### Yêu cầu phi chức năng
- **Hiệu suất**: Thời gian phản hồi &lt; 2 giây cho các thao tác đặt lịch
- **An ninh**: Dữ liệu được mã hóa, tuân thủ HIPAA (nếu cần mở rộng quy mô)
- **Khả năng mở rộng**: Hỗ trợ hơn 1000 lượt đặt lịch đồng thời
- **Khả dụng**: 99.9% thời gian hoạt động
- **Tính dễ sử dụng**: Độ tương phản cao, tuân thủ tiêu chuẩn WCAG

---

## Phần 3: Thiết kế User Flow

### 3.1 Luồng của Bệnh nhân
```
Trang chủ → (Đăng nhập (tùy chọn) → Tìm kiếm bác sĩ → Chọn bác sĩ → Xem lịch trống → Chọn ngày/giờ → Điền thông tin đặt lịch → Xác nhận → Dashboard cá nhân
```

### 3.2 Luồng của Bác sĩ
```
Đăng nhập → Dashboard → Xem lịch hôm nay → Đánh dấu bận → Xem xét lịch hẹn → Xem hồ sơ bệnh nhân
```

### 3.3 Luồng của Quản trị viên
```
Đăng nhập → Tổng quan Dashboard → Quản lý bác sĩ/bệnh nhân → Xem thống kê → Cấu hình hệ thống
```

---

## Phần 4: Thiết kế cơ sở dữ liệu chuẩn (3NF)

### 4.1 Bảng Người dùng (Users)
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| user_id | INT (PK, Auto Increment | ID người dùng |
| username | VARCHAR(50) UNIQUE | Tên đăng nhập |
| email | VARCHAR(100) UNIQUE | Email |
| password_hash | VARCHAR(255) | Mật khẩu mã hóa |
| role | ENUM('PATIENT','DOCTOR','ADMIN') | Vai trò |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |

**Index**: idx_role (role)**

### 4.2 Bảng Bệnh nhân (Patients)
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| patient_id | INT (PK, Auto Increment) | ID bệnh nhân |
| user_id | INT (FK, UNIQUE) | Liên kết với bảng Users |
| full_name | VARCHAR(100) | Họ tên đầy đủ |
| phone | VARCHAR(20) | Số điện thoại |
| birth_date | DATE | Ngày sinh |
| gender | ENUM('M','F','OTHER') | Giới tính |
| blood_type | VARCHAR(5) | Nhóm máu |
| allergies | TEXT | Dị ứng |
| medical_history | TEXT | Tiền sử bệnh |

**Index**: idx_patient_name (full_name)

### 4.3 Bảng Bác sĩ (Doctors)
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| doctor_id | INT (PK, Auto Increment) | ID bác sĩ |
| user_id | INT (FK, UNIQUE) | Liên kết với bảng Users |
| full_name | VARCHAR(100) | Họ tên đầy đủ |
| specialization | VARCHAR(100) | Chuyên khoa |
| phone | VARCHAR(20) | Số điện thoại |
| bio | TEXT | Tiểu sử |

**Index**: idx_specialization (specialization)

### 4.4 Bảng Thời gian trống của bác sĩ (Doctor Availability)
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| slot_id | INT (PK, Auto Increment) | ID slot |
| doctor_id | INT (FK) | Liên kết với bảng Doctors |
| slot_date | DATE | Ngày khám |
| start_time | TIME | Giờ bắt đầu |
| end_time | TIME | Giờ kết thúc |
| status | ENUM('AVAILABLE','BOOKED','BUSY') DEFAULT 'AVAILABLE' | Trạng thái slot |

**Constraints: UNIQUE KEY idx_doctor_slot (doctor_id, slot_date, start_time)
**Index**: idx_date_status (slot_date, status)

### 4.5 Bảng Lịch hẹn (Appointments)
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| appointment_id | INT (PK, Auto Increment) | ID lịch hẹn |
| patient_id | INT (FK) | Liên kết với bảng Patients |
| doctor_id | INT (FK) | Liên kết với bảng Doctors |
| slot_id | INT (FK) | Liên kết với bảng Doctor Availability |
| reason | TEXT | Lý do khám |
| status | ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED') DEFAULT 'CONFIRMED' | Trạng thái lịch hẹn |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |

**Index**: idx_appointment_date (slot_id), idx_patient_doctor (patient_id, doctor_id)

---

## Phần 5: Đề xuất kiến trúc hệ thống tối ưu

### 5.1 Kiến trúc 3 lớp
```
┌─────────────────────────────────────────────────┐
│ Presentation Layer (Giao diện) │
│ • React SPA (Responsive) │
│ • Portal Bệnh nhân & Dashboard Bác sĩ/Quản trị │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Application Layer (Backend) │
│ • Node.js + Express │
│ • RESTful API + Xác thực JWT │
│ • Service Layer: │
│   - User/Auth Service │
│   - Patient Profile Service │
│   - Scheduling Service │
│   - Reminder Service │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Data Layer (Dữ liệu) │
│ • MySQL (Dữ liệu quan hệ) │
│ • Redis (Cache & Khóa slot) │
└─────────────────────────────────────────┘
```

---

## Phần 6: Giải thích lý do chọn kiến trúc

1.  **React + Express + MySQL**:
    - MERN-adjacent stack, đã được chứng minh cho các hệ thống đặt lịch healthcare
    - React cho giao diện phản hồi nhanh, dễ bảo trì
    - MySQL cho tính nhất quán dữ liệu, hỗ trợ ACID

2.  **Redis cho Cache & Khóa Slot**:
    - Ngăn chặn race condition trong quá trình đặt lịch
    - Lưu lịch trống của bác sĩ để truy cập nhanh hơn
    - Giảm tải truy vấn cơ sở dữ liệu

3.  **Tách biệt các lớp rõ ràng (Separation of Concerns):
    - Lớp API cho logic nghiệp vụ, lớp cơ sở dữ liệu cho lưu trữ
    - Dễ phát triển, kiểm thử, mở rộng

4.  **Middleware phân quyền dựa trên vai trò:
    - Kiểm soát truy cập ở lớp API, đảm bảo an ninh

---

## Phần 7: Lộ trình thực hiện (Sprint Planning)

| Sprint | Kết quả cần đạt được |
|--------|---------------------|
| **Sprint 1: Cấu trúc & Xác thực | - Cấu trúc dự án - Định nghĩa bảng CSDL - Xác thực JWT - Giao diện đăng ký/đăng nhập |
| **Sprint 2: Hồ sơ bệnh nhân & bác sĩ | - CRUD hồ sơ - Lưu thông tin y tế bệnh nhân - Quản lý chuyên khoa bác sĩ |
| **Sprint 3: Lịch hẹn cốt lõi | - Quản lý thời gian trống - Luồng đặt lịch với kiểm tra trùng lặp |
| **Sprint 4: Dashboard | - Portal bệnh nhân - Lịch bác sĩ - Tổng quan admin với thống kê |
| **Sprint 5: Hoàn thiện & Triển khai | - Tinh chỉnh UI/UX - Nhắc nhở tự động - Tích hợp GitHub - Triển khai lên hosting |

---

## Tài liệu tham khảo
- Nguồn nghiên cứu:
  - Modern healthcare websites guide 2025
  - Doctor booking platform case study
  - REST API best practices
  - Hospital management system schema
