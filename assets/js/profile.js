document.addEventListener("DOMContentLoaded", () => {
  const data = ClinicAPI.read();

  renderHomeMetrics(data);
  renderProfilePage(data);
});

function renderHomeMetrics(data) {
  const patientCount = document.querySelector("#homePatientCount");
  if (!patientCount) return;

  const todayAppointments = data.appointments.filter((item) => item.date === ClinicAPI.today() && item.status !== "cancelled");
  patientCount.textContent = data.patients.length;
  document.querySelector("#homeDoctorCount").textContent = data.doctors.length;
  document.querySelector("#homeTodayCount").textContent = todayAppointments.length;
}

function renderProfilePage(data) {
  const form = document.querySelector("#profileForm");
  if (!form) return;

  const patient = data.patients.at(-1);
  const fields = {
    name: document.querySelector("#patientName"),
    phone: document.querySelector("#patientPhone"),
    email: document.querySelector("#patientEmail"),
    birthYear: document.querySelector("#patientBirthYear"),
    gender: document.querySelector("#patientGender"),
    bloodType: document.querySelector("#patientBloodType"),
    allergies: document.querySelector("#patientAllergies"),
    medicalHistory: document.querySelector("#patientHistory"),
  };

  if (patient) {
    Object.entries(fields).forEach(([key, input]) => {
      if (input) input.value = patient[key] || "";
    });
  }

  updateSummary(patient);

  fields.name.addEventListener("input", () => {
    ClinicValidation.setFieldState(fields.name, fields.name.value.trim().length >= 3 ? "" : "Họ tên tối thiểu 3 ký tự.");
  });
  fields.phone.addEventListener("input", () => {
    ClinicValidation.setFieldState(fields.phone, ClinicValidation.phone(fields.phone.value) ? "" : "SĐT phải có 10 chữ số và bắt đầu bằng 0.");
  });
  fields.email.addEventListener("input", () => {
    ClinicValidation.setFieldState(fields.email, ClinicValidation.email(fields.email.value) ? "" : "Email chưa đúng định dạng.");
  });
  fields.birthYear.addEventListener("input", () => {
    ClinicValidation.setFieldState(fields.birthYear, ClinicValidation.birthYear(fields.birthYear.value) ? "" : "Năm sinh không hợp lệ.");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.querySelector("#profileMessage");
    const profile = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()]));

    if (profile.name.length < 3 || !ClinicValidation.phone(profile.phone) || !ClinicValidation.email(profile.email) || !ClinicValidation.birthYear(profile.birthYear)) {
      message.textContent = "Vui lòng kiểm tra lại các trường đang báo lỗi.";
      message.classList.remove("success");
      return;
    }

    const nextData = ClinicAPI.savePatient({ ...profile, birthYear: Number(profile.birthYear) });
    updateSummary(nextData.patients.at(-1));
    message.textContent = "Đã lưu hồ sơ bệnh nhân.";
    message.classList.add("success");
  });
}

function updateSummary(patient) {
  const summary = document.querySelector("#patientSummary");
  if (!summary || !patient) return;

  const allergies = patient.allergies || "Không ghi nhận";
  summary.innerHTML = `
    <p class="eyebrow">Dashboard cá nhân</p>
    <h1>${patient.name}</h1>
    <p>Mã bệnh nhân: <strong>${patient.id}</strong> | SĐT: ${patient.phone}</p>
    <div class="health-grid">
      <div class="health-cell">
        <span>Nhóm máu</span>
        <strong>${patient.bloodType || "Chưa rõ"}</strong>
      </div>
      <div class="health-cell ${allergies === "Không ghi nhận" ? "" : "warning"}">
        <span>Dị ứng nghiêm trọng</span>
        <strong>${allergies}</strong>
      </div>
    </div>
  `;
}
