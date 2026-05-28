import { useMemo, useState } from "react";
import { AppointmentCard } from "../../components/specific/AppointmentCard.jsx";
import { BookingForm } from "../../components/specific/BookingForm.jsx";
import { PatientProfileForm } from "../../components/specific/PatientProfileForm.jsx";
import { PatientSummaryCard } from "../../components/specific/PatientSummaryCard.jsx";
import { Header } from "../../layouts/Header.jsx";
import { readData } from "../../services/api.js";
import { savePatient } from "../../services/patientService.js";

export function PatientPage() {
  const [data, setData] = useState(readData);
  const activePatient = data.patients.at(-1);
  const appointments = useMemo(
    () => data.appointments.filter((item) => item.patientId === activePatient?.id && item.status !== "busy"),
    [data.appointments, activePatient?.id]
  );

  function refresh() {
    setData(readData());
  }

  return (
    <>
      <Header
        title="Dashboard bệnh nhân"
        subtitle="Một không gian riêng để quản lý hồ sơ y tế, xem cảnh báo quan trọng và đặt lịch khám không độ trễ."
      />
      <main className="page patient-dashboard">
        <PatientSummaryCard patient={activePatient} />

        <section className="two-column section-gap">
          <article className="panel">
            <p className="eyebrow">Hồ sơ</p>
            <h2>Thông tin bệnh nhân</h2>
            <p className="section-note">Form được chia theo nhóm để dễ nhập và giảm lỗi cho người dùng lớn tuổi.</p>
            <PatientProfileForm
              initialProfile={activePatient}
              onSave={(profile) => {
                savePatient(profile);
                refresh();
              }}
            />
          </article>
          <article className="panel">
            <p className="eyebrow">Đặt lịch</p>
            <h2>Chọn bác sĩ, ngày và giờ</h2>
            <p className="section-note">Các giờ đã kín tự động mờ đi, bệnh nhân chỉ chọn được khung còn trống.</p>
            <BookingForm data={data} activePatient={activePatient} onSaved={refresh} />
          </article>
        </section>

        <section className="panel section-gap">
          <p className="eyebrow">Lịch của tôi</p>
          <h2>Lịch khám đã đặt</h2>
          <div className="card-list">
            {appointments.length ? (
              appointments.map((appointment) => (
                <AppointmentCard
                  appointment={appointment}
                  doctor={data.doctors.find((doctor) => doctor.id === appointment.doctorId)}
                  key={appointment.id}
                  patient={activePatient}
                />
              ))
            ) : (
              <p className="empty-state">Chưa có lịch khám nào.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
