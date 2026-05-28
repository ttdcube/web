const STORAGE_KEY = "clinicflow-data-v1";

const doctors = [
  {
    id: "D001",
    name: "BS. Phạm Hoàng Nam",
    department: "Nội tổng quát",
    room: "201",
    slots: ["08:00 - 10:00", "10:00 - 11:30", "14:00 - 16:00"],
    capacity: 3,
  },
  {
    id: "D002",
    name: "BS. Đỗ Thu Hà",
    department: "Tim mạch",
    room: "305",
    slots: ["08:00 - 10:00", "13:30 - 15:00", "15:00 - 16:30"],
    capacity: 2,
  },
  {
    id: "D003",
    name: "BS. Nguyễn Quốc Huy",
    department: "Nhi khoa",
    room: "102",
    slots: ["07:30 - 09:00", "09:00 - 10:30", "14:00 - 16:00"],
    capacity: 4,
  },
  {
    id: "D004",
    name: "BS. Lê Minh Châu",
    department: "Da liễu",
    room: "404",
    slots: ["08:30 - 10:00", "10:00 - 11:30", "15:00 - 16:30"],
    capacity: 2,
  },
];

const sampleData = {
  patients: [
    { id: "BN001", name: "Nguyễn Văn An", phone: "0901234567", birthYear: 1994, gender: "Nam" },
    { id: "BN002", name: "Trần Thị Bình", phone: "0912345678", birthYear: 1981, gender: "Nữ" },
    { id: "BN003", name: "Lê Minh Khôi", phone: "0988111222", birthYear: 1999, gender: "Nam" },
  ],
  appointments: [
    {
      id: "LK001",
      patientId: "BN001",
      doctorId: "D001",
      date: today(),
      slot: "08:00 - 10:00",
      reason: "Đau đầu, mệt mỏi",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    },
    {
      id: "LK002",
      patientId: "BN002",
      doctorId: "D002",
      date: today(),
      slot: "13:30 - 15:00",
      reason: "Kiểm tra huyết áp",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ],
};

let state = loadState();

const departmentEl = document.querySelector("#department");
const doctorEl = document.querySelector("#doctor");
const timeSlotEl = document.querySelector("#timeSlot");
const dateEl = document.querySelector("#appointmentDate");
const formEl = document.querySelector("#bookingForm");
const messageEl = document.querySelector("#formMessage");
const patientSearchEl = document.querySelector("#patientSearch");
const statusFilterEl = document.querySelector("#statusFilter");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(sampleData);

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(sampleData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function moneyDate(dateValue) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(`${dateValue}T00:00:00`));
}

function normalizePhone(phone) {
  return phone.replace(/\s/g, "");
}

function getDoctor(id) {
  return doctors.find((doctor) => doctor.id === id);
}

function getPatient(id) {
  return state.patients.find((patient) => patient.id === id);
}

function getStatusText(status) {
  return {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    done: "Đã khám",
    cancelled: "Đã hủy",
  }[status];
}

function getActiveAppointments() {
  return state.appointments.filter((item) => item.status !== "cancelled");
}

function countBooked(doctorId, date, slot) {
  return getActiveAppointments().filter(
    (item) => item.doctorId === doctorId && item.date === date && item.slot === slot
  ).length;
}

function getAvailableSlots(doctorId, date) {
  const doctor = getDoctor(doctorId);
  if (!doctor) return [];

  return doctor.slots.map((slot) => {
    const booked = countBooked(doctorId, date, slot);
    return {
      slot,
      booked,
      remaining: Math.max(doctor.capacity - booked, 0),
      isFull: booked >= doctor.capacity,
    };
  });
}

function nextId(prefix, items) {
  const max = items.reduce((highest, item) => {
    const value = Number(String(item.id).replace(prefix, ""));
    return Number.isFinite(value) && value > highest ? value : highest;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

function renderSelects() {
  const departments = [...new Set(doctors.map((doctor) => doctor.department))];
  departmentEl.innerHTML = departments.map((item) => `<option>${item}</option>`).join("");
  dateEl.min = today();
  dateEl.value ||= today();
  renderDoctorsForDepartment();
}

function renderDoctorsForDepartment() {
  const department = departmentEl.value;
  const filteredDoctors = doctors.filter((doctor) => doctor.department === department);
  doctorEl.innerHTML = filteredDoctors
    .map((doctor) => `<option value="${doctor.id}">${doctor.name} - Phòng ${doctor.room}</option>`)
    .join("");
  renderSlots();
}

function renderSlots() {
  const doctorId = doctorEl.value;
  const date = dateEl.value || today();
  const slots = getAvailableSlots(doctorId, date);

  timeSlotEl.innerHTML = slots
    .map((item) => {
      const disabled = item.isFull ? "disabled" : "";
      return `<option value="${item.slot}" ${disabled}>${item.slot} - còn ${item.remaining} chỗ</option>`;
    })
    .join("");
}

function renderMetrics() {
  const todayAppointments = state.appointments.filter((item) => item.date === today() && item.status !== "cancelled");
  const pending = state.appointments.filter((item) => item.status === "pending");

  document.querySelector("#patientCount").textContent = state.patients.length;
  document.querySelector("#doctorCount").textContent = doctors.length;
  document.querySelector("#todayCount").textContent = todayAppointments.length;
  document.querySelector("#pendingCount").textContent = pending.length;
}

function renderDoctorList() {
  const date = dateEl.value || today();
  document.querySelector("#doctorList").innerHTML = doctors
    .map((doctor) => {
      const slots = getAvailableSlots(doctor.id, date)
        .map((item) => {
          const className = item.isFull ? "slot-pill full-slot" : "slot-pill";
          return `<span class="${className}">${item.slot}: ${item.remaining}/${doctor.capacity}</span>`;
        })
        .join("");

      return `
        <article class="doctor-card">
          <header>
            <div>
              <h3>${doctor.name}</h3>
              <p>${doctor.department} | Phòng ${doctor.room}</p>
            </div>
            <span class="status-pill status-confirmed">${doctor.capacity} chỗ/khung</span>
          </header>
          <div class="slot-row">${slots}</div>
        </article>
      `;
    })
    .join("");
}

function renderPatients() {
  const keyword = patientSearchEl.value.trim().toLowerCase();
  const filtered = state.patients.filter((patient) => {
    return patient.name.toLowerCase().includes(keyword) || patient.phone.includes(keyword);
  });

  const patientList = document.querySelector("#patientList");
  if (filtered.length === 0) {
    patientList.innerHTML = `<div class="empty-state">Không tìm thấy bệnh nhân phù hợp.</div>`;
    return;
  }

  patientList.innerHTML = filtered
    .map((patient) => {
      const appointmentCount = state.appointments.filter((item) => item.patientId === patient.id).length;
      return `
        <article class="patient-card">
          <header>
            <div>
              <h3>${patient.id} - ${patient.name}</h3>
              <p>${patient.gender}, sinh năm ${patient.birthYear} | SĐT: ${patient.phone}</p>
            </div>
            <span class="status-pill status-confirmed">${appointmentCount} lịch</span>
          </header>
        </article>
      `;
    })
    .join("");
}

function renderAppointments() {
  const status = statusFilterEl.value;
  const filtered = state.appointments
    .filter((appointment) => status === "all" || appointment.status === status)
    .sort((a, b) => `${b.date}${b.slot}`.localeCompare(`${a.date}${a.slot}`));

  const appointmentList = document.querySelector("#appointmentList");
  if (filtered.length === 0) {
    appointmentList.innerHTML = `<div class="empty-state">Chưa có lịch khám ở trạng thái này.</div>`;
    return;
  }

  appointmentList.innerHTML = filtered
    .map((appointment) => {
      const patient = getPatient(appointment.patientId);
      const doctor = getDoctor(appointment.doctorId);
      return `
        <article class="appointment-card">
          <header>
            <div>
              <h3>${appointment.id} - ${patient?.name || "Không rõ bệnh nhân"}</h3>
              <p>${appointment.reason || "Không ghi lý do khám"}</p>
            </div>
            <span class="status-pill status-${appointment.status}">${getStatusText(appointment.status)}</span>
          </header>
          <div class="appointment-meta">
            <span>Bác sĩ: ${doctor?.name || "Không rõ"}</span>
            <span>Khoa: ${doctor?.department || "Không rõ"}</span>
            <span>Ngày: ${moneyDate(appointment.date)}</span>
            <span>Giờ: ${appointment.slot}</span>
          </div>
          <div class="appointment-actions">
            <button class="small-btn" type="button" data-action="confirmed" data-id="${appointment.id}">Xác nhận</button>
            <button class="small-btn" type="button" data-action="done" data-id="${appointment.id}">Đã khám</button>
            <button class="danger-btn" type="button" data-action="cancelled" data-id="${appointment.id}">Hủy lịch</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAll() {
  renderMetrics();
  renderSlots();
  renderDoctorList();
  renderPatients();
  renderAppointments();
}

function findOrCreatePatient({ name, phone, birthYear, gender }) {
  const normalizedPhone = normalizePhone(phone);
  const existing = state.patients.find((patient) => patient.phone === normalizedPhone);
  if (existing) {
    existing.name = name;
    existing.birthYear = Number(birthYear);
    existing.gender = gender;
    return existing;
  }

  const patient = {
    id: nextId("BN", state.patients),
    name,
    phone: normalizedPhone,
    birthYear: Number(birthYear),
    gender,
  };
  state.patients.push(patient);
  return patient;
}

function validateBooking(data) {
  if (data.name.length < 3) return "Vui lòng nhập họ tên bệnh nhân.";
  if (!/^0\d{9}$/.test(normalizePhone(data.phone))) return "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.";
  if (!data.birthYear || Number(data.birthYear) < 1920 || Number(data.birthYear) > 2026) return "Năm sinh không hợp lệ.";
  if (!data.date) return "Vui lòng chọn ngày khám.";
  if (data.date < today()) return "Không thể đặt lịch cho ngày đã qua.";
  if (!data.slot) return "Khung giờ đã hết chỗ, vui lòng chọn khung khác.";
  if (countBooked(data.doctorId, data.date, data.slot) >= getDoctor(data.doctorId).capacity) return "Khung giờ này đã hết chỗ.";
  return "";
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const data = {
    name: document.querySelector("#patientName").value.trim(),
    phone: document.querySelector("#phone").value.trim(),
    birthYear: document.querySelector("#birthYear").value,
    gender: document.querySelector("#gender").value,
    doctorId: doctorEl.value,
    date: dateEl.value,
    slot: timeSlotEl.value,
    reason: document.querySelector("#reason").value.trim(),
  };

  const error = validateBooking(data);
  if (error) {
    messageEl.textContent = error;
    messageEl.classList.remove("success");
    return;
  }

  const patient = findOrCreatePatient(data);
  state.appointments.push({
    id: nextId("LK", state.appointments),
    patientId: patient.id,
    doctorId: data.doctorId,
    date: data.date,
    slot: data.slot,
    reason: data.reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  saveState();
  formEl.reset();
  dateEl.value = today();
  renderSelects();
  renderAll();

  messageEl.textContent = "Đã lưu lịch khám. Trạng thái hiện tại: Chờ xác nhận.";
  messageEl.classList.add("success");
}

function handleAppointmentAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const appointment = state.appointments.find((item) => item.id === button.dataset.id);
  if (!appointment) return;

  appointment.status = button.dataset.action;
  saveState();
  renderAll();
}

function resetData() {
  state = structuredClone(sampleData);
  saveState();
  renderSelects();
  renderAll();
  messageEl.textContent = "Đã khôi phục dữ liệu mẫu.";
  messageEl.classList.add("success");
}

departmentEl.addEventListener("change", renderDoctorsForDepartment);
doctorEl.addEventListener("change", renderSlots);
dateEl.addEventListener("change", () => {
  renderSlots();
  renderDoctorList();
});
formEl.addEventListener("submit", handleBookingSubmit);
patientSearchEl.addEventListener("input", renderPatients);
statusFilterEl.addEventListener("change", renderAppointments);
document.querySelector("#appointmentList").addEventListener("click", handleAppointmentAction);
document.querySelector("#resetDataBtn").addEventListener("click", resetData);

renderSelects();
renderAll();
