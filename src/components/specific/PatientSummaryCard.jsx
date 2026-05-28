export function PatientSummaryCard({ patient }) {
  if (!patient) {
    return (
      <article className="patient-summary empty">
        <p className="eyebrow">Dashboard cá nhân</p>
        <h2>Chưa có hồ sơ bệnh nhân</h2>
        <p>Lưu thông tin hành chính và thông tin y tế trước khi đặt lịch khám.</p>
      </article>
    );
  }

  const allergies = patient.allergies?.trim() || "Không ghi nhận";

  return (
    <article className="patient-summary">
      <div>
        <p className="eyebrow">Dashboard cá nhân</p>
        <h2>{patient.name}</h2>
        <p>
          Mã bệnh nhân: <strong>{patient.id}</strong> | SĐT: {patient.phone}
        </p>
      </div>
      <div className="health-alerts">
        <div>
          <span>Nhóm máu</span>
          <strong>{patient.bloodType || "Chưa rõ"}</strong>
        </div>
        <div className={allergies === "Không ghi nhận" ? "" : "warning"}>
          <span>Dị ứng nghiêm trọng</span>
          <strong>{allergies}</strong>
        </div>
      </div>
    </article>
  );
}
