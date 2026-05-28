import { Header } from "../../layouts/Header.jsx";
import { useMemo, useState } from "react";
import { BookingForm } from "../../components/specific/BookingForm.jsx";
import { AppointmentCard } from "../../components/specific/AppointmentCard.jsx";
import { PatientProfileForm } from "../../components/specific/PatientProfileForm.jsx";
import { readData } from "../../services/api.js";
import { savePatient } from "../../services/patientService.js";

export function PatientPage() {
  const [data, setData] = useState(readData);
  const activePatient = data.patients.at(-1);
  const appointments = useMemo(
    () => data.appointments.filter((item) => item.patientId === activePatient?.id),
    [data.appointments, activePatient?.id]
  );

  function refresh() {
    setData(readData());
  }

  return (
    <>
      <Header title="Khu vực bệnh nhân" subtitle="Quản lý hồ sơ và đặt lịch khám." />
      <main className="page">
        <section className="two-column">
          <article className="panel">
            <p className="eyebrow">Hồ sơ</p>
            <h2>Thông tin bệnh nhân</h2>
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
            <h2>Chọn bác sĩ và khung giờ</h2>
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
