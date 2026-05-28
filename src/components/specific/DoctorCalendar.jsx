import { saveAppointment } from "../../services/doctorService.js";

function weekDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export function DoctorCalendar({ data, onChanged }) {
  const days = weekDays();
  const demoPatient = data.patients[0];

  function slotStatus(doctor, date, slot) {
    const used = data.appointments.filter(
      (item) => item.doctorId === doctor.id && item.date === date && item.slot === slot && item.status !== "cancelled"
    );
    if (used.some((item) => item.status === "busy")) return "busy";
    if (used.length >= doctor.capacity) return "booked";
    return "free";
  }

  function createBusySlot(doctor, date, slot) {
    if (!demoPatient || slotStatus(doctor, date, slot) !== "free") return;
    saveAppointment({
      patientId: demoPatient.id,
      doctorId: doctor.id,
      date,
      slot,
      reason: "Bác sĩ bận đột xuất",
      status: "busy",
    });
    onChanged();
  }

  return (
    <div className="calendar-view">
      <div className="calendar-legend">
        <span className="legend-free">Giờ rảnh</span>
        <span className="legend-booked">Đã đặt</span>
        <span className="legend-busy">Bác sĩ bận</span>
      </div>
      {data.doctors.map((doctor) => (
        <section className="doctor-calendar" key={doctor.id}>
          <header>
            <div>
              <h3>{doctor.name}</h3>
              <p>
                {doctor.department} | Phòng {doctor.room}
              </p>
            </div>
          </header>
          <div className="calendar-grid">
            {days.map((day) => (
              <article className="calendar-day" key={day}>
                <strong>
                  {new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }).format(
                    new Date(`${day}T00:00:00`)
                  )}
                </strong>
                {doctor.slots.map((slot) => {
                  const status = slotStatus(doctor, day, slot);
                  return (
                    <button
                      className={`calendar-slot ${status}`}
                      disabled={status !== "free"}
                      key={slot}
                      type="button"
                      onClick={() => createBusySlot(doctor, day, slot)}
                    >
                      {slot}
                    </button>
                  );
                })}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
