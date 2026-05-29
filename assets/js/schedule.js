document.addEventListener("DOMContentLoaded", () => {
  const data = ClinicAPI.read();
  initPatientBooking(data);
  renderDoctorCalendar(data);
  renderDoctorAppointments(data);
});

function getUpcomingDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

function formatDateLabel(dateValue) {
  return new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }).format(new Date(`${dateValue}T00:00:00`));
}

function initPatientBooking(data) {
  const form = document.querySelector("#bookingForm");
  if (!form) return;

  let selectedDoctorId = data.doctors[0]?.id;
  let selectedDate = ClinicAPI.today();
  let selectedSlot = "";

  const doctorPicker = document.querySelector("#patientDoctorPicker");
  const dateStrip = document.querySelector("#patientDateStrip");
  const timeGrid = document.querySelector("#patientTimeGrid");

  function renderDoctors() {
    doctorPicker.innerHTML = data.doctors.map((doctor) => `
      <button class="doctor-option ${doctor.id === selectedDoctorId ? "selected" : ""}" type="button" data-id="${doctor.id}">
        <strong>${doctor.name}</strong>
        <span>${doctor.department}</span>
        <small>Phòng ${doctor.room}</small>
      </button>
    `).join("");
  }

  function renderDates() {
    dateStrip.innerHTML = getUpcomingDays().map((date) => `
      <button class="date-chip ${date === selectedDate ? "selected" : ""}" type="button" data-date="${date}">
        <span>${formatDateLabel(date).split(",")[0]}</span>
        <strong>${new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(new Date(`${date}T00:00:00`))}</strong>
      </button>
    `).join("");
  }

  function renderSlots() {
    const fresh = ClinicAPI.read();
    const doctor = fresh.doctors.find((item) => item.id === selectedDoctorId);
    timeGrid.innerHTML = doctor.slots.map((slot) => {
      const booked = ClinicAPI.countBooked(fresh, doctor.id, selectedDate, slot);
      const remaining = doctor.capacity - booked;
      const disabled = remaining <= 0;
      return `
        <button class="time-slot ${slot === selectedSlot ? "selected" : ""} ${disabled ? "unavailable" : "available"}" type="button" data-slot="${slot}" ${disabled ? "disabled" : ""}>
          <strong>${slot}</strong>
          <span>${disabled ? "Đã kín" : `Còn ${remaining} chỗ`}</span>
        </button>
      `;
    }).join("");
  }

  renderDoctors();
  renderDates();
  renderSlots();

  doctorPicker.addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (!button) return;
    selectedDoctorId = button.dataset.id;
    selectedSlot = "";
    renderDoctors();
    renderSlots();
  });

  dateStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-date]");
    if (!button) return;
    selectedDate = button.dataset.date;
    selectedSlot = "";
    renderDates();
    renderSlots();
  });

  timeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-slot]");
    if (!button || button.disabled) return;
    selectedSlot = button.dataset.slot;
    renderSlots();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.querySelector("#bookingMessage");
    const fresh = ClinicAPI.read();
    const patient = fresh.patients.at(-1);
    const reason = document.querySelector("#bookingReason").value.trim();

    if (!patient) {
      message.textContent = "Vui lòng lưu hồ sơ bệnh nhân trước khi đặt lịch.";
      message.classList.remove("success");
      return;
    }

    if (!selectedSlot) {
      message.textContent = "Vui lòng chọn một khung giờ còn trống.";
      message.classList.remove("success");
      return;
    }

    ClinicAPI.saveAppointment({ patientId: patient.id, doctorId: selectedDoctorId, date: selectedDate, slot: selectedSlot, reason });
    selectedSlot = "";
    document.querySelector("#bookingReason").value = "";
    renderSlots();
    message.textContent = "Đặt lịch thành công. Lịch đang chờ bác sĩ xác nhận.";
    message.classList.add("success");
  });
}

function renderDoctorCalendar(data) {
  const calendar = document.querySelector("#doctorCalendar");
  if (!calendar) return;

  const days = getUpcomingDays();
  calendar.innerHTML = data.doctors.map((doctor) => `
    <section class="doctor-calendar">
      <h2>${doctor.name}</h2>
      <p>${doctor.department} | Phòng ${doctor.room}</p>
      <div class="calendar-grid">
        ${days.map((day) => `
          <article class="calendar-day">
            <strong>${formatDateLabel(day)}</strong>
            ${doctor.slots.map((slot) => renderCalendarSlot(data, doctor, day, slot)).join("")}
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");

  calendar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-doctor-id]");
    if (!button || button.disabled) return;
    const fresh = ClinicAPI.read();
    const patient = fresh.patients[0];
    ClinicAPI.saveAppointment({
      patientId: patient.id,
      doctorId: button.dataset.doctorId,
      date: button.dataset.date,
      slot: button.dataset.slot,
      reason: "Bác sĩ bận đột xuất",
      status: "busy",
    });
    const nextData = ClinicAPI.read();
    renderDoctorCalendar(nextData);
    renderDoctorAppointments(nextData);
  }, { once: true });
}

function renderCalendarSlot(data, doctor, date, slot) {
  const appointments = data.appointments.filter((item) => item.doctorId === doctor.id && item.date === date && item.slot === slot && item.status !== "cancelled");
  const status = appointments.some((item) => item.status === "busy") ? "busy" : appointments.length >= doctor.capacity ? "booked" : "free";
  return `<button class="calendar-slot ${status}" type="button" data-doctor-id="${doctor.id}" data-date="${date}" data-slot="${slot}" ${status === "free" ? "" : "disabled"}>${slot}</button>`;
}

function renderDoctorAppointments(data) {
  const list = document.querySelector("#doctorAppointmentList");
  if (!list) return;

  const labels = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    done: "Đã khám",
    cancelled: "Đã hủy",
    busy: "Bác sĩ bận",
  };

  const appointments = data.appointments.filter((item) => item.status !== "busy");
  list.innerHTML = appointments.length ? appointments.map((appointment) => {
    const patient = data.patients.find((item) => item.id === appointment.patientId);
    const doctor = data.doctors.find((item) => item.id === appointment.doctorId);
    return `
      <article class="appointment-card">
        <strong>${appointment.id} - ${patient?.name || "Không rõ bệnh nhân"}</strong>
        <p>${doctor?.name || "Không rõ bác sĩ"} | ${doctor?.department || "Không rõ khoa"}</p>
        <p>${appointment.date} | ${appointment.slot}</p>
        <span class="status-pill status-${appointment.status}">${labels[appointment.status]}</span>
      </article>
    `;
  }).join("") : `<p class="appointment-card">Chưa có lịch khám nào.</p>`;
}
