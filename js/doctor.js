
// doctor.js - Quản lý danh sách bác sĩ
const Doctor = {
  // Lọc bác sĩ theo chuyên khoa
  filterBySpecialty(specialty) {
    const doctors = Storage.getDoctors();
    if (specialty === "Tất cả") return doctors;
    return doctors.filter(d => d.specialty === specialty);
  },

  // Render danh sách bác sĩ
  renderGrid(containerId, specialty = "Tất cả") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const doctors = this.filterBySpecialty(specialty);
    
    if (doctors.length === 0) {
      UI.showEmpty(containerId, "Không tìm thấy bác sĩ");
      return;
    }

    container.innerHTML = doctors.map(doctor => `
      <div class="card doctor-card">
        <img src="${doctor.avatar}" alt="${doctor.name}" class="doctor-avatar" />
        <h3 class="doctor-name">${doctor.name}</h3>
        <p class="doctor-specialty">${doctor.specialty}</p>
        <p class="doctor-price">${UI.formatCurrency(doctor.price)}/lượt khám</p>
        <p style="color:var(--color-gray-500);font-size:0.875rem;margin-bottom:1rem;">${doctor.bio}</p>
        <button class="btn btn-primary btn-block" onclick="Doctor.openBookingModal(${doctor.id})">
          Đặt lịch khám
        </button>
      </div>
    `).join('');
  },

  // Mở modal đặt lịch
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,

  openBookingModal(doctorId) {
    const user = Auth.getCurrentUser();
    if (!user) {
      UI.showToast("Vui lòng đăng nhập để đặt lịch!", "warning");
      window.location.href = "login.html";
      return;
    }

    this.selectedDoctor = Storage.getDoctors().find(d => d.id === doctorId);
    this.selectedDate = null;
    this.selectedTime = null;

    const modal = document.getElementById('booking-modal');
    const doctorInfo = document.getElementById('modal-doctor-info');
    if (doctorInfo) {
      doctorInfo.innerHTML = `
        <h3>${this.selectedDoctor.name}</h3>
        <p style="color:var(--color-primary);">${this.selectedDoctor.specialty}</p>
      `;
    }

    // Đặt tối thiểu là hôm nay
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = '';
    }

    document.getElementById('time-slots-container').innerHTML = '<p class="empty-state" style="padding:1.5rem;">Vui lòng chọn ngày khám</p>';
    UI.openModal('booking-modal');
  },

  // Xử lý khi chọn ngày
  onDateChange() {
    const date = document.getElementById('booking-date').value;
    if (!date) return;

    if (UI.isDateInPast(date)) {
      UI.showToast("Không thể đặt lịch trong quá khứ!", "error");
      return;
    }

    this.selectedDate = date;
    this.selectedTime = null;
    this.renderTimeSlots();
  },

  // Render khung giờ
  renderTimeSlots() {
    const container = document.getElementById('time-slots-container');
    const slots = Appointment.getAvailableSlots(this.selectedDoctor.id, this.selectedDate);

    if (slots.length === 0) {
      container.innerHTML = '<p class="empty-state" style="padding:1.5rem;">Không có khung giờ trống vào ngày này</p>';
      return;
    }

    container.innerHTML = `
      <p style="margin-bottom:0.5rem;color:var(--color-gray-600);">Chọn khung giờ:</p>
      <div class="time-slots">
        ${slots.map(time => `
          <div class="time-slot" onclick="Doctor.selectTime('${time}')" data-time="${time}">
            ${time}
          </div>
        `).join('')}
      </div>
    `;
  },

  // Chọn giờ
  selectTime(time) {
    this.selectedTime = time;
    document.querySelectorAll('.time-slot').forEach(el => {
      el.classList.toggle('selected', el.dataset.time === time);
    });
  },

  // Xác nhận đặt lịch
  confirmBooking() {
    if (!this.selectedDate || !this.selectedTime) {
      UI.showToast("Vui lòng chọn đầy đủ ngày và giờ!", "warning");
      return;
    }

    const reason = document.getElementById('booking-reason').value;
    const user = Auth.getCurrentUser();

    const result = Appointment.create({
      doctorId: this.selectedDoctor.id,
      patientId: user.id,
      date: this.selectedDate,
      time: this.selectedTime,
      reason: reason
    });

    if (result.success) {
      UI.showToast(result.message, "success");
      UI.closeModal('booking-modal');
      // Reset form
      document.getElementById('booking-reason').value = '';
    } else {
      UI.showToast(result.message, "error");
    }
  },

  // Render danh sách chuyên khoa cho select
  renderSpecialtySelect(selectId) {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = INITIAL_DATA.specialties.map(s => `<option value="${s}">${s}</option>`).join('');
    }
  }
};
