
// doctor.js - Quan ly danh sach bac si
const Doctor = {
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,

  async renderGrid(containerId, specialty = 'All') {
    const container = document.getElementById(containerId);
    UI.showLoading(containerId);
    try {
      const doctors = await api.getDoctors(specialty);
      if (doctors.length === 0) {
        UI.showEmpty(containerId, 'Khong tim thay bac si');
        return;
      }
      container.innerHTML = doctors.map(d => `
        <div class="card doctor-card">
          <img src="${d.avatar}" alt="${d.name}" class="doctor-avatar">
          <h3 class="doctor-name">${d.name}</h3>
          <p class="doctor-specialty">${d.specialty}</p>
          <p class="doctor-price">${UI.formatCurrency(d.price)}/luot kham</p>
          <p style="color: var(--color-gray-500); font-size: 0.875rem; margin-bottom: 1rem;">${d.bio}</p>
          <button class="btn btn-primary btn-block" onclick="Doctor.openBookingModal(${d.id})">Dat lich kham</button>
        </div>
      `).join('');
    } catch (err) {
      UI.showToast(err.message, 'error');
    }
  },

  async renderSpecialtySelect(selectId) {
    const select = document.getElementById(selectId);
    const specialties = await api.getSpecialties();
    select.innerHTML = specialties.map(s => `<option value="${s}">${s}</option>`).join('');
  },

  openBookingModal(doctorId) {
    const user = api.getCurrentUser();
    if (!user) {
      UI.showToast('Vui long dang nhap de dat lich!', 'warning');
      window.location.href = 'login.html';
      return;
    }

    api.getDoctors().then(doctors => {
      this.selectedDoctor = doctors.find(d => d.id === doctorId);
      this.selectedDate = null;
      this.selectedTime = null;

      const modalDoctorInfo = document.getElementById('modal-doctor-info');
      modalDoctorInfo.innerHTML = `
        <h3>${this.selectedDoctor.name}</h3>
        <p style="color: var(--color-primary);">${this.selectedDoctor.specialty}</p>
      `;
      document.getElementById('booking-date').value = '';
      document.getElementById('time-slots-container').innerHTML = '<p class="empty-state" style="padding:1.5rem;">Vui long chon ngay kham</p>';
      document.getElementById('booking-reason').value = '';
      UI.openModal('booking-modal');
    });
  },

  async onDateChange() {
    const date = document.getElementById('booking-date').value;
    if (!date) return;
    if (new Date(date) < new Date().toDateString()) {
      UI.showToast('Khong the dat lich trong qua khu!', 'error');
      return;
    }
    this.selectedDate = date;
    this.selectedTime = null;
    await this.renderTimeSlots();
  },

  async renderTimeSlots() {
    const container = document.getElementById('time-slots-container');
    UI.showLoading('time-slots-container');
    try {
      const slots = await api.getDoctorAvailability(this.selectedDoctor.id, this.selectedDate);
      if (slots.length === 0) {
        container.innerHTML = '<p class="empty-state" style="padding:1.5rem;">Khong co gio trong vao ngay nay</p>';
        return;
      }
      container.innerHTML = `
        <p style="margin-bottom:0.5rem; color: var(--color-gray-600);">Chon gio kham:</p>
        <div class="time-slots">
          ${slots.map(time => `
            <div class="time-slot" onclick="Doctor.selectTime('${time}')" data-time="${time}">${time}</div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      UI.showToast(err.message, 'error');
    }
  },

  selectTime(time) {
    this.selectedTime = time;
    document.querySelectorAll('.time-slot').forEach(el => {
      el.classList.toggle('selected', el.dataset.time === time);
    });
  },

  async confirmBooking() {
    if (!this.selectedDate || !this.selectedTime) {
      UI.showToast('Vui long chon ngay va gio!', 'warning');
      return;
    }
    try {
      const reason = document.getElementById('booking-reason').value;
      await api.bookAppointment({
        doctorId: this.selectedDoctor.id,
        date: this.selectedDate,
        time: this.selectedTime,
        reason: reason
      });
      UI.showToast('Dat lich thanh cong!', 'success');
      UI.closeModal('booking-modal');
    } catch (err) {
      UI.showToast(err.message, 'error');
    }
  }
};
