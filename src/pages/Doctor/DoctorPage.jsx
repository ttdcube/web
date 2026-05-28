import { Header } from "../../layouts/Header.jsx";
import { useState } from "react";
import { AppointmentCard } from "../../components/specific/AppointmentCard.jsx";
import { readData } from "../../services/api.js";
import { updateAppointmentStatus } from "../../services/doctorService.js";

export function DoctorPage() {
  const [data, setData] = useState(readData);

  function changeStatus(id, status) {
    updateAppointmentStatus(id, status);
    setData(readData());
  }

  return (
    <>
      <Header title="Khu vực bác sĩ" subtitle="Quản lý thời gian rảnh và danh sách bệnh nhân đã đặt lịch." />
      <main className="page">
        <section className="two-column">
          <article className="panel">
            <p className="eyebrow">Thời gian rảnh</p>
            <h2>Lịch làm việc bác sĩ</h2>
            <div className="card-list">
              {data.doctors.map((doctor) => (
                <article className="doctor-card" key={doctor.id}>
                  <h3>{doctor.name}</h3>
                  <p>
                    {doctor.department} | Phòng {doctor.room}
                  </p>
                  <div className="slot-row">
                    {doctor.slots.map((slot) => (
                      <span key={slot}>{slot}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Danh sách</p>
            <h2>Bệnh nhân đã đặt lịch</h2>
            <div className="card-list">
              {data.appointments.map((appointment) => (
                <AppointmentCard
                  appointment={appointment}
                  doctor={data.doctors.find((doctor) => doctor.id === appointment.doctorId)}
                  key={appointment.id}
                  onStatusChange={changeStatus}
                  patient={data.patients.find((patient) => patient.id === appointment.patientId)}
                />
              ))}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
