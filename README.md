# Medical Booking Pro

Ứng dụng React/Vite mô phỏng hệ thống đặt lịch khám bệnh trực tuyến.

## Cấu trúc

- `public/index.html`: HTML entry.
- `src/components`: UI tái sử dụng.
- `src/layouts`: Header, Footer, Sidebar, AuthLayout.
- `src/pages`: Trang Home, Patient, Doctor.
- `src/routes`: Điều hướng client-side không reload trang.
- `src/services`: Service layer, hiện dùng localStorage và có thể thay bằng API thật.
- `src/store`: Auth context.
- `src/utils`: Formatter và validator.

## Chức năng

- Bệnh nhân lưu hồ sơ và đặt lịch khám.
- Bác sĩ xem lịch, xác nhận, hoàn tất hoặc hủy lịch.
- Kiểm tra khung giờ còn chỗ theo sức chứa của bác sĩ.
- Dashboard trang chủ lấy số liệu thật từ dữ liệu ứng dụng.
- Mô phỏng quy trình doanh nghiệp: khảo sát, thiết kế, phát triển, nghiệm thu.

## Chạy dự án

```bash
npm install
npm run dev
```

Sau khi chạy, mở địa chỉ Vite hiển thị trong terminal.
