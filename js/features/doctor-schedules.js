
const DoctorSchedules = {
  render: function() {
    const doctor = Auth.getCurrentDoctor();
    if (!doctor) return;

    (doctor.availableDays || []).forEach(day => {
      const checkbox = document.getElementById(`day-${day}`);
      if (checkbox) checkbox.checked = true;
    });

    document.getElementById('startTime').value = doctor.availableTimeStart;
    document.getElementById('endTime').value = doctor.availableTimeEnd;

    document.getElementById('schedule-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const selectedDays = [];
      for (let day = 1; day <= 7; day++) {
        const checkbox = document.getElementById(`day-${day}`);
        if (checkbox && checkbox.checked) {
          selectedDays.push(day);
        }
      }

      if (selectedDays.length === 0) {
        UI.toast('Vui lòng chọn ít nhất 1 ngày làm việc!', 'error');
        return;
      }

      const updates = {
        availableDays: selectedDays,
        availableTimeStart: document.getElementById('startTime').value,
        availableTimeEnd: document.getElementById('endTime').value
      };

      Storage.updateDoctor(doctor.id, updates);
      UI.toast('Cập nhật lịch làm việc thành công!', 'success');
    });
  }
};
