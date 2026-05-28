import { useMemo, useState } from "react";
import { saveAppointment } from "../../services/doctorService.js";
import { Button } from "../common/Button.jsx";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingForm({ data, activePatient, onSaved }) {
  const [department, setDepartment] = useState(data.doctors[0]?.department || "");
  const [doctorId, setDoctorId] = useState(data.doctors[0]?.id || "");
  const [date, setDate] = useState(today());
  const [slot, setSlot] = useState(data.doctors[0]?.slots[0] || "");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const departments = useMemo(() => [...new Set(data.doctors.map((doctor) => doctor.department))], [data.doctors]);
  const doctors = data.doctors.filter((doctor) => doctor.department === department);
  const selectedDoctor = data.doctors.find((doctor) => doctor.id === doctorId) || doctors[0];

  function bookedCount(nextSlot) {
    return data.appointments.filter(
      (item) => item.doctorId === selectedDoctor?.id && item.date === date && item.slot === nextSlot && item.status !== "cancelled"
    ).length;
  }

  function submit(event) {
    event.preventDefault();
    if (!activePatient) {
      setMessage("Vui lòng lưu hồ sơ bệnh nhân trước khi đặt lịch.");
      return;
    }
    if (!selectedDoctor || !slot) {
      setMessage("Vui lòng chọn bác sĩ và khung giờ.");
      return;
    }
    if (bookedCount(slot) >= selectedDoctor.capacity) {
      setMessage("Khung giờ này đã hết chỗ.");
      return;
    }

    saveAppointment({
      patientId: activePatient.id,
      doctorId: selectedDoctor.id,
      date,
      slot,
      reason,
    });
    setReason("");
    setMessage("Đã gửi lịch khám. Trạng thái hiện tại: chờ xác nhận.");
    onSaved();
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label className="field">
        <span>Chuyên khoa</span>
        <select
          value={department}
          onChange={(event) => {
            const nextDepartment = event.target.value;
            const nextDoctor = data.doctors.find((doctor) => doctor.department === nextDepartment);
            setDepartment(nextDepartment);
            setDoctorId(nextDoctor?.id || "");
            setSlot(nextDoctor?.slots[0] || "");
          }}
        >
          {departments.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Bác sĩ</span>
        <select value={doctorId} onChange={(event) => setDoctorId(event.target.value)}>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - Phòng {doctor.room}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Ngày khám</span>
        <input type="date" min={today()} value={date} onChange={(event) => setDate(event.target.value)} />
      </label>
      <label className="field">
        <span>Khung giờ</span>
        <select value={slot} onChange={(event) => setSlot(event.target.value)}>
          {(selectedDoctor?.slots || []).map((item) => {
            const remaining = selectedDoctor.capacity - bookedCount(item);
            return (
              <option key={item} value={item} disabled={remaining <= 0}>
                {item} - còn {remaining} chỗ
              </option>
            );
          })}
        </select>
      </label>
      <label className="field full">
        <span>Lý do khám</span>
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Mô tả triệu chứng" />
      </label>
      <p className={`form-message ${message.includes("Đã") ? "success" : ""}`}>{message}</p>
      <div className="form-actions">
        <Button type="submit">Đặt lịch khám</Button>
      </div>
    </form>
  );
}
