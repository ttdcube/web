
const DoctorSchedules = {
  days: [
    { id: 2, name: 'Thứ 2' },
    { id: 3, name: 'Thứ 3' },
    { id: 4, name: 'Thứ 4' },
    { id: 5, name: 'Thứ 5' },
    { id: 6, name: 'Thứ 6' },
    { id: 7, name: 'Thứ 7' },
    { id: 1, name: 'Chủ nhật' }
  ],
  schedules: {},

  init: function() {
    console.log('DoctorSchedules.init() called');
    this.loadSchedules();
    this.render();
  },

  loadSchedules: function() {
    const doctor = Auth.getCurrentDoctor();
    console.log('Loading schedules for doctor:', doctor);
    if (!doctor) return;

    this.schedules = {};
    this.days.forEach(day => {
      const enabled = doctor.availableDays ? doctor.availableDays.includes(day.id) : [2,3,4,5,6].includes(day.id);
      const start = doctor.availableTimeStart || '08:00';
      const end = doctor.availableTimeEnd || '17:00';
      this.schedules[day.id] = {
        enabled: enabled,
        slots: [{ start: start, end: end }]
      };
    });
    console.log('Schedules loaded:', this.schedules);
  },

  render: function() {
    console.log('DoctorSchedules.render() called');
    const container = document.getElementById('schedule-week');
    if (!container) {
      console.error('Container #schedule-week not found!');
      return;
    }
    container.innerHTML = this.days.map(day => {
      const sched = this.schedules[day.id];
      return `
        <div class="day-card ${sched.enabled ? 'selected' : ''}" data-day="${day.id}">
          <div class="day-header" onclick="DoctorSchedules.toggleDay(${day.id})">
            ${day.name}
          </div>
          <div class="day-body">
            <div id="slots-${day.id}">
              ${(sched.slots || []).map((slot, idx) => this.renderSlot(day.id, idx, slot)).join('')}
            </div>
            <button class="btn btn-secondary btn-small" style="width:100%;" onclick="DoctorSchedules.addSlot(${day.id})">
              ➕ Thêm khung giờ
            </button>
          </div>
        </div>
      `;
    }).join('');
    console.log('Rendered schedule');
  },

  renderSlot: function(dayId, slotIdx, slot) {
    return `
      <div class="time-slot" data-day="${dayId}" data-slot="${slotIdx}">
        <input type="time" value="${slot.start}" onchange="DoctorSchedules.updateSlot(${dayId}, ${slotIdx}, 'start', this.value)">
        <span>→</span>
        <input type="time" value="${slot.end}" onchange="DoctorSchedules.updateSlot(${dayId}, ${slotIdx}, 'end', this.value)">
        <button class="btn btn-danger btn-small" onclick="DoctorSchedules.removeSlot(${dayId}, ${slotIdx})">✕</button>
      </div>
    `;
  },

  toggleDay: function(dayId) {
    this.schedules[dayId].enabled = !this.schedules[dayId].enabled;
    this.render();
  },

  addSlot: function(dayId) {
    const sched = this.schedules[dayId];
    if (!sched.slots) sched.slots = [];
    const lastSlot = sched.slots[sched.slots.length - 1];
    sched.slots.push({
      start: lastSlot ? lastSlot.end : '08:00',
      end: lastSlot ? this.add30Mins(lastSlot.end) : '17:00'
    });
    this.render();
  },

  removeSlot: function(dayId, slotIdx) {
    if (this.schedules[dayId].slots.length <= 1) {
      UI.toast('Phải có ít nhất 1 khung giờ!', 'warning');
      return;
    }
    this.schedules[dayId].slots.splice(slotIdx, 1);
    this.render();
  },

  updateSlot: function(dayId, slotIdx, field, value) {
    this.schedules[dayId].slots[slotIdx][field] = value;
  },

  add30Mins: function(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    let newH = h;
    let newM = m + 30;
    if (newM >= 60) {
      newH += 1;
      newM -= 60;
    }
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  },

  copyToAll: function() {
    const selectedDay = this.days.find(d => this.schedules[d.id] && this.schedules[d.id].enabled);
    if (!selectedDay) {
      UI.toast('Vui lòng chọn 1 ngày làm mẫu!', 'warning');
      return;
    }
    const source = this.schedules[selectedDay.id];
    this.days.forEach(day => {
      this.schedules[day.id] = {
        enabled: this.schedules[day.id].enabled,
        slots: JSON.parse(JSON.stringify(source.slots))
      };
    });
    UI.toast('Đã sao chép thời gian cho tất cả các ngày!', 'success');
    this.render();
  },

  saveSchedules: function() {
    const doctor = Auth.getCurrentDoctor();
    if (!doctor) return;

    const enabledDays = this.days
      .map(d => d.id)
      .filter(d => this.schedules[d].enabled);

    if (enabledDays.length === 0) {
      UI.toast('Vui lòng chọn ít nhất 1 ngày làm việc!', 'error');
      return;
    }

    const firstDay = enabledDays[0];
    const firstSlot = this.schedules[firstDay].slots[0];

    Storage.updateDoctor(doctor.id, {
      availableDays: enabledDays,
      availableTimeStart: firstSlot.start,
      availableTimeEnd: firstSlot.end,
      schedules: this.schedules
    });

    UI.toast('Đã cập nhật lịch làm việc!', 'success');
  }
};
