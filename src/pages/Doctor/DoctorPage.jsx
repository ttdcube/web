import { useState } from "react";
import { AppointmentCard } from "../../components/specific/AppointmentCard.jsx";
import { DoctorCalendar } from "../../components/specific/DoctorCalendar.jsx";
import { Header } from "../../layouts/Header.jsx";
import { readData } from "../../services/api.js";
import { updateAppointmentStatus } from "../../services/doctorService.js";

export function DoctorPage() {
  const [data, setData] = useState(readData);
  const patientAppointments = data.appointments.filter((appointment) => appointment.status !== "busy");

  function refresh() {
    setData(readData());
  }

  function changeStatus(id, status) {
    updateAppointmentStatus(id, status);
    refresh();
  }

  return (
    <>
      <Header
        title="Lịch làm việc bác sĩ"
        subtitle="Giao diện calendar trực quan, màu xanh là giờ rảnh, xám là đã đặt, vàng là bác sĩ bận."
      />
      <main className="page doctor-dashboard">
        <section className="panel">
          <p className="eyebrow">Calendar view</p>
          <h2>Quản lý thời gian khám</h2>
          <p className="section-note">Bác sĩ click một lần vào slot xanh để đánh dấu bận đột xuất, không chuyển trang.</p>
          <DoctorCalendar data={data} onChanged={refresh} />
        </section>

        <section className="panel section-gap">
          <p className="eyebrow">Danh sách</p>
          <h2>Bệnh nhân đã đặt lịch</h2>
          <div className="card-list">
            {patientAppointments.map((appointment) => (
              <AppointmentCard
                appointment={appointment}
                doctor={data.doctors.find((doctor) => doctor.id === appointment.doctorId)}
                key={appointment.id}
                onStatusChange={changeStatus}
                patient={data.patients.find((patient) => patient.id === appointment.patientId)}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
