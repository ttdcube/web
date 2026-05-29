
// appointment.js - Quan ly lich kham
const Appointment = {
  async renderPatientList(containerId) {
    const container = document.getElementById(containerId);
    UI.showLoading(containerId);
    try {
      const appointments = await api.getMyAppointments();
      if (appointments.length === 0) {
        UI.showEmpty(containerId, 'Chua co lich kham nao');
        return;
      }
      container.innerHTML = appointments.map(a => `
        <div class="card appointment-card">
          <h3>${a.doctor_name}</h3>
          <p class="appointment-specialty">${a.specialty}</p>
          <div class="appointment-info">
            <div class="appointment-info-item">
              <span class="appointment-info-label">Ngay kham</span>
              <span class="appointment-info-value">${UI.formatDate(a.appointment_date)}</span>
            </div>
            <div class="appointment-info-item">
              <span class="appointment-info-label">Gio kham</span>
              <span class="appointment-info-value">${a.appointment_time}</span>
            </div>
          </div>
          ${a.reason ? `<p style="color: var(--color-gray-500); font-size: 0.875rem; margin-top: 0.75rem;">Ly do: ${a.reason}</p>` : ''}
          <span class="appointment-status status-${a.status}">${a.status === 'confirmed' ? 'Da xac nhan' : a.status === 'cancelled' ? 'Da huy' : 'Cho xac nhan'}</span>
          ${a.status === 'confirmed' ? `<button class="btn btn-danger btn-sm btn-block" style="margin-top: 0.75rem;" onclick="Appointment.cancel(${a.id})">Huy lich</button>` : ''}
        </div>
      `).join('');
    } catch (err) {
      UI.showToast(err.message, 'error');
    }
  },

  async cancel(id) {
    if (!confirm('Ban co chac muon huy lich nay?')) return;
    try {
      await api.cancelAppointment(id);
      UI.showToast('Huy lich thanh cong!', 'success');
      this.renderPatientList('patient-appointments');
    } catch (err) {
      UI.showToast(err.message, 'error');
    }
  },

  async renderAdminList(containerId) {
    const container = document.getElementById(containerId);
    UI.showLoading(containerId);
    try {
      const appointments = await api.getAllAppointments();
      if (appointments.length === 0) {
        UI.showEmpty(containerId, 'Chua co lich kham nao');
        return;
      }
      container.innerHTML = appointments.map(a => `
        <div class="card appointment-card">
          <h3>${a.patient_name} → ${a.doctor_name}</h3>
          <div class="appointment-info">
            <div class="appointment-info-item">
              <span class="appointment-info-label">Ngay kham</span>
              <span class="appointment-info-value">${UI.formatDate(a.appointment_date)}</span>
            </div>
            <div class="appointment-info-item">
              <span class="appointment-info-label">Gio kham</span>
              <span class="appointment-info-value">${a.appointment_time}</span>
            </div>
          </div>
          <span class="appointment-status status-${a.status}">${a.status === 'confirmed' ? 'Da xac nhan' : a.status === 'cancelled' ? 'Da huy' : 'Cho xac nhan'}</span>
        </div>
      `).join('');
    } catch (err) {
      UI.showToast(err.message, 'error');
    }
  }
};
