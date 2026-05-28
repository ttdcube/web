import { Header } from "../../layouts/Header.jsx";
import { Button } from "../../components/common/Button.jsx";
import { readData } from "../../services/api.js";

export function HomePage({ onNavigate }) {
  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = data.appointments.filter((item) => item.date === today && item.status !== "cancelled");
  const pendingAppointments = data.appointments.filter((item) => item.status === "pending");

  return (
    <>
      <Header
        title="Hệ thống đặt lịch khám bệnh trực tuyến"
        subtitle="Quản lý hồ sơ bệnh nhân, thời gian khám của bác sĩ và điều phối lịch hẹn trong một ứng dụng."
        actions={<Button onClick={() => onNavigate("patient")}>Đặt lịch khám</Button>}
      />
      <main className="page">
        <section className="metric-grid">
          <article className="metric-card">
            <span>{data.patients.length}</span>
            <p>Hồ sơ bệnh nhân</p>
          </article>
          <article className="metric-card">
            <span>{data.doctors.length}</span>
            <p>Bác sĩ</p>
          </article>
          <article className="metric-card">
            <span>{todayAppointments.length}</span>
            <p>Lịch khám hôm nay</p>
          </article>
          <article className="metric-card">
            <span>{pendingAppointments.length}</span>
            <p>Lịch chờ xác nhận</p>
          </article>
        </section>

        <section className="hero-grid">
          <article className="panel">
            <p className="eyebrow">Bệnh nhân</p>
            <h2>Đặt lịch nhanh</h2>
            <p>Nhập hồ sơ, chọn chuyên khoa, bác sĩ và khung giờ còn trống.</p>
          </article>
          <article className="panel">
            <p className="eyebrow">Bác sĩ</p>
            <h2>Quản lý lịch khám</h2>
            <p>Theo dõi danh sách bệnh nhân đã đặt lịch và cập nhật trạng thái khám.</p>
          </article>
          <article className="panel">
            <p className="eyebrow">Doanh nghiệp</p>
            <h2>Quy trình rõ ràng</h2>
            <p>Mô phỏng tiếp nhận yêu cầu, phân tích, triển khai, kiểm thử và nghiệm thu.</p>
          </article>
        </section>

        <section className="panel section-gap">
          <p className="eyebrow">Quy trình làm việc thực tế</p>
          <h2>Mô phỏng triển khai tại doanh nghiệp</h2>
          <div className="workflow-grid">
            <article>
              <span>01</span>
              <h3>Khảo sát</h3>
              <p>Business Analyst thu thập yêu cầu từ phòng khám và bệnh nhân.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Thiết kế</h3>
              <p>Nhóm thiết kế luồng đặt lịch, dữ liệu bệnh nhân và lịch bác sĩ.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Phát triển</h3>
              <p>Frontend, service layer và state được chia thành các module rõ ràng.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Nghiệm thu</h3>
              <p>Kiểm tra đặt lịch, xác nhận, hủy lịch và responsive trước khi deploy.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
