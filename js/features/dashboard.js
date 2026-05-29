
/**
 * dashboard.js - Render thống kê dashboard cho patient và admin
 */

const Dashboard = {
  /**
   * Render dashboard bệnh nhân
   */
  renderPatient: function() {
    const patient = Auth.getCurrentPatient();
    if (!patient) return;

    // Thống kê
    const appointments = Storage.getAppointmentsByPatientId(patient.id);
    const upcomingCount = appointments.filter(a =>
      a.status === 'confirmed' && !Utils.isDateInPast(a.appointmentDate)
    ).length;
    const completedCount = appointments.filter(a => a.status === 'completed').length;

    // Cập nhật stats
    const upcomingEl = document.getElementById('stat-upcoming');
    const completedEl = document.getElementById('stat-completed');
    const totalEl = document.getElementById('stat-total');
    if (upcomingEl) upcomingEl.textContent = upcomingCount;
    if (completedEl) completedEl.textContent = completedCount;
    if (totalEl) totalEl.textContent = appointments.length;

    // Cập nhật profile preview
    const nameEl = document.getElementById('patient-preview-name');
    const phoneEl = document.getElementById('patient-preview-phone');
    const avatarEl = document.getElementById('patient-preview-avatar');
    if (nameEl) nameEl.textContent = patient.fullName;
    if (phoneEl) phoneEl.textContent = patient.phone;
    if (avatarEl) avatarEl.src = patient.avatar;
  },

  /**
   * Render dashboard admin
   */
  renderAdmin: function() {
    // Thống kê
    const users = Storage.getUsers();
    const patients = Storage.getPatients();
    const doctors = Storage.getDoctors();
    const appointments = Storage.getAppointments();

    const todayAppts = appointments.filter(a => Utils.isSameDay(a.appointmentDate, Utils.getToday())).length;
    const confirmedAppts = appointments.filter(a => a.status === 'confirmed').length;

    // Cập nhật stats
    const totalUsersEl = document.getElementById('stat-total-users');
    const totalDoctorsEl = document.getElementById('stat-total-doctors');
    const totalApptsEl = document.getElementById('stat-total-appointments');
    const todayApptsEl = document.getElementById('stat-today-appointments');

    if (totalUsersEl) totalUsersEl.textContent = users.length;
    if (totalDoctorsEl) totalDoctorsEl.textContent = doctors.length;
    if (totalApptsEl) totalApptsEl.textContent = appointments.length;
    if (todayApptsEl) todayApptsEl.textContent = todayAppts;

    // Render biểu đồ đơn giản (JS thuần)
    this.renderChart('admin-chart');
  },

  /**
   * Render biểu đồ đơn giản (biểu đồ cột)
   */
  renderChart: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Lấy dữ liệu 7 ngày gần nhất
    const appointments = Storage.getAppointments();
    const days = [];
    const counts = [];

    for (let i = 6; i >= 0; i--) {
      const date = Utils.addDays(Utils.getToday(), -i);
      days.push(new Date(date).getDate() + '/' + (new Date(date).getMonth() + 1));
      const count = appointments.filter(a => a.appointmentDate === date && a.status !== 'cancelled').length;
      counts.push(count);
    }

    // Tìm max height
    const maxCount = Math.max(...counts, 1);

    // Render HTML
    container.innerHTML = `
      <div class="chart">
        <div class="chart-title">Lịch khám 7 ngày gần nhất</div>
        <div class="chart-bars">
          ${days.map((day, i) => `
            <div class="chart-bar-container">
              <div class="chart-bar" style="height: ${(counts[i]/maxCount)*100}%"></div>
              <div class="chart-label">${day}</div>
              <div class="chart-value">${counts[i]}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

