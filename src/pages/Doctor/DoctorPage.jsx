import { Header } from "../../layouts/Header.jsx";

export function DoctorPage() {
  return (
    <>
      <Header title="Khu vực bác sĩ" subtitle="Quản lý thời gian rảnh và danh sách bệnh nhân đã đặt lịch." />
      <main className="page">
        <section className="panel">
          <p className="eyebrow">Đang hoàn thiện</p>
          <h2>Bảng lịch và danh sách bệnh nhân sẽ nằm tại đây</h2>
          <p>Giai đoạn tiếp theo sẽ bổ sung thao tác xác nhận, hoàn tất và hủy lịch.</p>
        </section>
      </main>
    </>
  );
}
