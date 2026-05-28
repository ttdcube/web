import { formatDate, statusText } from "../../utils/formatters.js";
import { Button } from "../common/Button.jsx";

export function AppointmentCard({ appointment, patient, doctor, onStatusChange }) {
  return (
    <article className="appointment-card">
      <header>
        <div>
          <h3>
            {appointment.id} - {patient?.name || "Không rõ bệnh nhân"}
          </h3>
          <p>{appointment.reason || "Không ghi lý do khám"}</p>
        </div>
        <span className={`status-pill status-${appointment.status}`}>{statusText(appointment.status)}</span>
      </header>
      <div className="appointment-meta">
        <span>Bác sĩ: {doctor?.name || "Không rõ"}</span>
        <span>Khoa: {doctor?.department || "Không rõ"}</span>
        <span>Ngày: {formatDate(appointment.date)}</span>
        <span>Giờ: {appointment.slot}</span>
      </div>
      {onStatusChange ? (
        <div className="card-actions">
          <Button variant="soft" onClick={() => onStatusChange(appointment.id, "confirmed")}>
            Xác nhận
          </Button>
          <Button variant="soft" onClick={() => onStatusChange(appointment.id, "done")}>
            Đã khám
          </Button>
          <Button variant="danger" onClick={() => onStatusChange(appointment.id, "cancelled")}>
            Hủy
          </Button>
        </div>
      ) : null}
    </article>
  );
}
