import { Header } from "../../layouts/Header.jsx";

export function PatientPage() {
  return (
    <>
      <Header title="Khu vực bệnh nhân" subtitle="Quản lý hồ sơ và đặt lịch khám." />
      <main className="page">
        <section className="panel">
          <p className="eyebrow">Đang hoàn thiện</p>
          <h2>Form hồ sơ và đặt lịch sẽ nằm tại đây</h2>
          <p>Giai đoạn tiếp theo sẽ nối dữ liệu thật bằng localStorage và service layer.</p>
        </section>
      </main>
    </>
  );
}
