
/**
 * doctors.js - Quản lý danh sách bác sĩ, tìm kiếm, filter, xem chi tiết
 */

const Doctors = {
  filters: {
    search: '',
    specialty: 'All'
  },
  currentPage: 1,
  itemsPerPage: 6,

  /**
   * Lấy danh sách chuyên khoa
   */
  getSpecialties: function() {
    const doctors = Storage.getDoctors();
    const specialties = new Set(doctors.map(d => d.specialty));
    return ['All', ...Array.from(specialties)];
  },

  /**
   * Lọc và tìm kiếm bác sĩ
   */
  getFilteredDoctors: function() {
    let doctors = Storage.getDoctors();

    // Lọc theo chuyên khoa
    if (this.filters.specialty !== 'All') {
      doctors = doctors.filter(d => d.specialty === this.filters.specialty);
    }

    // Tìm kiếm theo tên hoặc chuyên khoa
    if (this.filters.search.trim()) {
      const searchLower = this.filters.search.toLowerCase();
      doctors = doctors.filter(d =>
        d.fullName.toLowerCase().includes(searchLower) ||
        d.specialty.toLowerCase().includes(searchLower)
      );
    }

    return doctors;
  },

  /**
   * Lấy trang hiện tại sau khi phân trang
   */
  getPaginatedDoctors: function() {
    const all = this.getFilteredDoctors();
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return {
      data: all.slice(start, end),
      total: all.length,
      totalPages: Math.ceil(all.length / this.itemsPerPage)
    };
  },

  /**
   * Render danh sách bác sĩ vào container
   */
  renderGrid: function(containerId) {
    const container = document.getElementById(containerId);
    UI.showSkeleton(containerId, 3);

    // Giả lập loading để đẹp
    setTimeout(() => {
      const result = this.getPaginatedDoctors();
      if (result.data.length === 0) {
        UI.showEmpty(containerId, 'Không tìm thấy bác sĩ nào phù hợp', '👨‍⚕️');
        this.renderPagination(containerId + '-pagination', result);
        return;
      }

      container.innerHTML = result.data.map(doctor => `
        <div class="doctor-card card" data-doctor-id="${doctor.id}">
          <div class="doctor-card-header">
            <img src="${doctor.avatar}" alt="${doctor.fullName}" class="doctor-card-avatar">
            <div class="doctor-card-info">
              <h3 class="doctor-card-name">${doctor.fullName}</h3>
              <p class="doctor-card-specialty">${doctor.specialty}</p>
              <div class="doctor-card-rating">
                <span class="rating-star">⭐</span>
                <span>${doctor.rating ? doctor.rating.toFixed(1) : '5.0'} (${doctor.totalReviews || 120} đánh giá)</span>
              </div>
            </div>
          </div>
          <p class="doctor-card-bio">${doctor.bio}</p>
          <div class="doctor-card-footer">
            <div class="doctor-card-price">${UI.formatCurrency(doctor.price)}</div>
            <div style="display:flex; gap:0.5rem">
              <button class="btn btn-secondary btn-sm" onclick="window.location.href='doctor-detail.html?id=${doctor.id}'">Xem chi tiết</button>
              <button class="btn btn-primary btn-sm" onclick="Doctors.openBookingModal('${doctor.id}')">Đặt lịch</button>
            </div>
          </div>
        </div>
      `).join('');

      this.renderPagination(containerId + '-pagination', result);
    }, 400);
  },

  /**
   * Render phân trang
   */
  renderPagination: function(containerId, result) {
    const container = document.getElementById(containerId);
    if (!container || result.totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let html = '<div class="pagination">';
    if (this.currentPage > 1) {
      html += `<button class="btn btn-secondary btn-sm" onclick="Doctors.goToPage(${this.currentPage - 1})">← Trước</button>`;
    }
    for (let i = 1; i <= result.totalPages; i++) {
      const isActive = i === this.currentPage;
      html += `<button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="Doctors.goToPage(${i})">${i}</button>`;
    }
    if (this.currentPage < result.totalPages) {
      html += `<button class="btn btn-secondary btn-sm" onclick="Doctors.goToPage(${this.currentPage + 1})">Sau →</button>`;
    }
    html += '</div>';

    container.innerHTML = html;
  },

  goToPage: function(page) {
    this.currentPage = page;
    this.renderGrid('doctors-grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * Render filter chuyên khoa
   */
  renderSpecialtyFilter: function(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const specialties = this.getSpecialties();
    select.innerHTML = specialties.map(s =>
      `<option value="${s}" ${this.filters.specialty === s ? 'selected' : ''}>${s}</option>`
    ).join('');
  },

  /**
   * Mở modal đặt lịch
   */
  openBookingModal: function(doctorId) {
    if (!Auth.isAuthenticated()) {
      UI.toast('Vui lòng đăng nhập để đặt lịch', 'warning');
      setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/')) {
          window.location.href = 'login.html';
        } else {
          window.location.href = 'pages/login.html';
        }
      }, 800);
      return;
    }

    const doctor = Storage.getDoctorById(doctorId);
    if (!doctor) return;

    // Đổ dữ liệu vào modal
    document.getElementById('booking-doctor-name').textContent = doctor.fullName;
    document.getElementById('booking-doctor-specialty').textContent = doctor.specialty;
    document.getElementById('booking-doctor-price').textContent = UI.formatCurrency(doctor.price);
    document.getElementById('booking-date').value = '';
    document.getElementById('booking-time-slots').innerHTML = '<p class="text-muted">Vui lòng chọn ngày</p>';
    document.getElementById('booking-reason').value = '';

    // Lưu doctorId để dùng sau
    window.currentBookingDoctorId = doctorId;
    window.currentBookingTime = null;

    UI.openModal('booking-modal');
  },

  /**
   * Khi chọn ngày, render giờ khám
   */
  onDateChange: async function(dateInput) {
    const date = dateInput.value;
    const container = document.getElementById('booking-time-slots');
    if (!date) {
      container.innerHTML = '<p class="text-muted">Vui lòng chọn ngày</p>';
      return;
    }

    if (Utils.isDateInPast(date)) {
      UI.toast('Không thể đặt lịch trong quá khứ', 'error');
      dateInput.value = '';
      container.innerHTML = '<p class="text-muted">Vui lòng chọn ngày</p>';
      return;
    }

    const doctorId = window.currentBookingDoctorId;
    const doctor = Storage.getDoctorById(doctorId);
    if (!doctor) return;

    // Kiểm tra ngày có nằm trong ngày làm việc của bác sĩ không
    const dayOfWeek = new Date(date).getDay();
    if (!doctor.availableDays.includes(dayOfWeek)) {
      container.innerHTML = `<div class="empty-state"><p>Bác sĩ không làm việc vào ngày này</p></div>`;
      return;
    }

    // Render giờ khám
    let slotsHtml = '<div class="time-slots">';
    const [startHour, startMin] = doctor.availableTimeStart.split(':').map(Number);
    const [endHour, endMin] = doctor.availableTimeEnd.split(':').map(Number);
    let h = startHour;
    let m = startMin;

    while (h < endHour || (h === endHour && m < endMin)) {
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const isAvailable = Storage.isSlotAvailable(doctorId, date, timeStr);
      const selectedClass = window.currentBookingTime === timeStr ? 'selected' : '';

      if (isAvailable) {
        slotsHtml += `<div class="time-slot ${selectedClass}" onclick="Doctors.selectTime('${timeStr}')">${timeStr}</div>`;
      } else {
        slotsHtml += `<div class="time-slot disabled">${timeStr}</div>`;
      }

      m += 30;
      if (m >= 60) { m = 0; h++; }
    }
    slotsHtml += '</div>';
    container.innerHTML = slotsHtml;
  },

  selectTime: function(time) {
    window.currentBookingTime = time;
    document.querySelectorAll('#booking-time-slots .time-slot').forEach(el => {
      el.classList.toggle('selected', el.textContent === time);
    });
  },

  /**
   * Xác nhận đặt lịch
   */
  confirmBooking: function() {
    const doctorId = window.currentBookingDoctorId;
    const date = document.getElementById('booking-date').value;
    const time = window.currentBookingTime;
    const reason = document.getElementById('booking-reason').value;

    if (!date) { UI.toast('Vui lòng chọn ngày khám', 'warning'); return; }
    if (!time) { UI.toast('Vui lòng chọn giờ khám', 'warning'); return; }

    const patient = Auth.getCurrentPatient();
    if (!patient) {
      UI.toast('Có lỗi xảy ra, vui lòng đăng nhập lại', 'error');
      return;
    }

    // Kiểm tra lại có trùng không
    if (!Storage.isSlotAvailable(doctorId, date, time)) {
      UI.toast('Giờ này vừa được đặt, vui lòng chọn giờ khác', 'error');
      this.onDateChange(document.getElementById('booking-date'));
      return;
    }

    // Tạo lịch
    const appointment = {
      id: Utils.uuid(),
      appointmentCode: Utils.generateAppointmentCode(),
      patientId: patient.id,
      doctorId: doctorId,
      appointmentDate: date,
      appointmentTime: time,
      reason: reason,
      status: 'confirmed',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    Storage.addAppointment(appointment);

    UI.toast('Đặt lịch thành công! Mã lịch: ' + appointment.appointmentCode, 'success');
    UI.closeModal('booking-modal');

    // Nếu ở trang patient, reload danh sách
    if (window.location.pathname.includes('patient')) {
      setTimeout(() => Appointments.renderPatientList('patient-appointments'), 500);
    }
  }
};

