
// charts.js - Biểu đồ thống kê cho Admin Dashboard

const Charts = {
  renderAppointmentChart: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Lấy dữ liệu 7 ngày gần nhất
    const labels = [];
    const dataCounts = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      labels.push(date.getDate() + '/' + (date.getMonth() + 1));

      // Đếm số lịch theo ngày
      const count = Storage.getAppointments().filter(a =>
        a.appointmentDate === dateStr && a.status !== 'cancelled'
      ).length;
      dataCounts.push(count);
    }

    const maxVal = Math.max(...dataCounts, 1);

    container.innerHTML = `
      <h3 style="margin-bottom:1.5rem;text-align:center">Thống kê lịch khám 7 ngày</h3>
      <div style="display:flex;align-items:flex-end;gap:0.75rem;height:220px;padding:0 0.5rem">
        ${labels.map((label, i) => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center">
            <div style="
              width:100%;
              background:linear-gradient(to top, var(--color-primary), #a5d8ff);
              border-radius:0.5rem 0.5rem 0 0;
              transition:all 0.3s ease;
              height: ${(dataCounts[i] / maxVal) * 180}px;
              min-height: 4px;
            "></div>
            <div style="font-size:0.875rem;margin-top:0.5rem;color:var(--text-muted)">${label}</div>
            <div style="font-weight:600;color:var(--color-primary)">${dataCounts[i]}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderStatusDonut: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const allAppointments = Storage.getAppointments();
    const pending = allAppointments.filter(a => a.status === 'pending').length;
    const confirmed = allAppointments.filter(a => a.status === 'confirmed').length;
    const completed = allAppointments.filter(a => a.status === 'completed').length;
    const cancelled = allAppointments.filter(a => a.status === 'cancelled').length;

    container.innerHTML = `
      <h3 style="margin-bottom:1.5rem;text-align:center">Trạng thái lịch hẹn</h3>
      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem">
        <div style="
          width:180px;height:180px;border-radius:50%;
          background:conic-gradient(
            #ffd43b 0 ${pending}%,
            #3498db ${pending}% ${pending + confirmed}%,
            #2ecc71 ${pending + confirmed}% ${pending + confirmed + completed}%,
            #e74c3c ${pending + confirmed + completed}% 100%
          );
          display:flex;align-items:center;justify-content:center;position:relative;
        ">
          <div style="
            width:120px;height:120px;background:var(--bg-color);border-radius:50%;
            display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;
          ">${allAppointments.length}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;width:100%">
          <div class="card" style="padding:0.75rem;text-align:center">
            <span style="color:#ffd43b;font-size:1.25rem;margin-right:0.25rem">●</span>
            <span style="font-weight:500">Pending</span>
            <div style="font-size:1.25rem;font-weight:700;color:#ffd43b">${pending}</div>
          </div>
          <div class="card" style="padding:0.75rem;text-align:center">
            <span style="color:#3498db;font-size:1.25rem;margin-right:0.25rem">●</span>
            <span style="font-weight:500">Confirmed</span>
            <div style="font-size:1.25rem;font-weight:700;color:#3498db">${confirmed}</div>
          </div>
          <div class="card" style="padding:0.75rem;text-align:center">
            <span style="color:#2ecc71;font-size:1.25rem;margin-right:0.25rem">●</span>
            <span style="font-weight:500">Completed</span>
            <div style="font-size:1.25rem;font-weight:700;color:#2ecc71">${completed}</div>
          </div>
          <div class="card" style="padding:0.75rem;text-align:center">
            <span style="color:#e74c3c;font-size:1.25rem;margin-right:0.25rem">●</span>
            <span style="font-weight:500">Cancelled</span>
            <div style="font-size:1.25rem;font-weight:700;color:#e74c3c">${cancelled}</div>
          </div>
        </div>
      </div>
    `;
  }
};
