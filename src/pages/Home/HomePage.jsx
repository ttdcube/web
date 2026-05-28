import { Header } from "../../layouts/Header.jsx";
import { Button } from "../../components/common/Button.jsx";

export function HomePage({ onNavigate }) {
  return (
    <>
      <Header
        title="Hệ thống đặt lịch khám bệnh trực tuyến"
        subtitle="Quản lý hồ sơ bệnh nhân, thời gian khám của bác sĩ và điều phối lịch hẹn trong một ứng dụng."
        actions={<Button onClick={() => onNavigate("patient")}>Đặt lịch khám</Button>}
      />
      <main className="page">
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
      </main>
    </>
  );
}
