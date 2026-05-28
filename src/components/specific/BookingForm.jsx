import { useMemo, useState } from "react";
import { saveAppointment } from "../../services/doctorService.js";
import { Button } from "../common/Button.jsx";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function upcomingDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export function BookingForm({ data, activePatient, onSaved }) {
  const [doctorId, setDoctorId] = useState(data.doctors[0]?.id || "");
  const [date, setDate] = useState(today());
  const [slot, setSlot] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const selectedDoctor = data.doctors.find((doctor) => doctor.id === doctorId) || data.doctors[0];
  const days = useMemo(upcomingDays, []);

  function bookedCount(nextSlot) {
    return data.appointments.filter(
      (item) => item.doctorId === selectedDoctor?.id && item.date === date && item.slot === nextSlot && item.status !== "cancelled"
    ).length;
  }

  function remaining(nextSlot) {
    return Math.max((selectedDoctor?.capacity || 0) - bookedCount(nextSlot), 0);
  }

  function submit(event) {
    event.preventDefault();
    if (!activePatient) {
      setMessage("Vui lòng lưu hồ sơ bệnh nhân trước khi đặt lịch.");
      return;
    }
    if (!selectedDoctor || !slot) {
      setMessage("Vui lòng chọn bác sĩ, ngày khám và khung giờ còn trống.");
      return;
    }
    if (remaining(slot) <= 0) {
      setMessage("Khung giờ này đã được đặt hết.");
      return;
    }

    saveAppointment({
      patientId: activePatient.id,
      doctorId: selectedDoctor.id,
      date,
      slot,
      reason,
    });
    setSlot("");
    setReason("");
    setMessage("Đặt lịch thành công. Hệ thống đã chuyển lịch về trạng thái chờ xác nhận.");
    onSaved();
  }

  return (
    <form className="booking-flow" onSubmit={submit}>
      <section>
        <h3>1. Chọn bác sĩ</h3>
        <div className="doctor-picker">
          {data.doctors.map((doctor) => (
            <button
              className={doctor.id === selectedDoctor?.id ? "doctor-option selected" : "doctor-option"}
              key={doctor.id}
              type="button"
              onClick={() => {
                setDoctorId(doctor.id);
                setSlot("");
              }}
            >
              <strong>{doctor.name}</strong>
              <span>{doctor.department}</span>
              <small>Phòng {doctor.room}</small>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3>2. Chọn ngày khám</h3>
        <div className="date-strip">
          {days.map((item) => (
            <button
              className={item === date ? "date-chip selected" : "date-chip"}
              key={item}
              type="button"
              onClick={() => {
                setDate(item);
                setSlot("");
              }}
            >
              <span>{new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(new Date(`${item}T00:00:00`))}</span>
              <strong>{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(new Date(`${item}T00:00:00`))}</strong>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3>3. Chọn khung giờ</h3>
        <div className="time-grid">
          {(selectedDoctor?.slots || []).map((item) => {
            const left = remaining(item);
            const disabled = left <= 0;
            return (
              <button
                className={`time-slot ${slot === item ? "selected" : ""} ${disabled ? "unavailable" : "available"}`}
                disabled={disabled}
                key={item}
                type="button"
                onClick={() => setSlot(item)}
              >
                <strong>{item}</strong>
                <span>{disabled ? "Đã kín" : `Còn ${left} chỗ`}</span>
              </button>
            );
          })}
        </div>
      </section>

      <label className="field full">
        <span>Lý do khám</span>
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Mô tả triệu chứng chính" />
      </label>

      <p className={`form-message ${message.includes("thành công") ? "success" : ""}`}>{message}</p>
      <div className="form-actions">
        <Button type="submit">Xác nhận đặt lịch</Button>
      </div>
    </form>
  );
}
