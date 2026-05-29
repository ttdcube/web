
const DoctorProfile = {
  render: function() {
    const doctor = Auth.getCurrentDoctor();
    if (!doctor) return;

    document.getElementById('profile-avatar').src = doctor.avatar;
    document.getElementById('profile-name').textContent = doctor.fullName;

    document.getElementById('fullName').value = doctor.fullName;
    document.getElementById('specialty').value = doctor.specialty;
    document.getElementById('phone').value = doctor.phone;
    document.getElementById('email').value = doctor.email;
    document.getElementById('bio').value = doctor.bio;
    document.getElementById('price').value = doctor.price;

    document.getElementById('profile-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const updates = {
        fullName: document.getElementById('fullName').value,
        specialty: document.getElementById('specialty').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value,
        price: Number(document.getElementById('price').value)
      };

      Storage.updateDoctor(doctor.id, updates);
      UI.toast('Cập nhật hồ sơ thành công!', 'success');

      const updatedDoctor = Auth.getCurrentDoctor();
      document.getElementById('topbar-name').textContent = updatedDoctor.fullName;
      document.getElementById('profile-name').textContent = updatedDoctor.fullName;
    });
  }
};
