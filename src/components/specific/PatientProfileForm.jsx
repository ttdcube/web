import { useMemo, useState } from "react";
import { validateBirthYear, validateEmail, validatePhone } from "../../utils/validators.js";
import { Button } from "../common/Button.jsx";
import { Input } from "../common/Input.jsx";

export function PatientProfileForm({ initialProfile, onSave }) {
  const [profile, setProfile] = useState(
    initialProfile || {
      name: "",
      phone: "",
      email: "",
      birthYear: "",
      gender: "Nam",
      bloodType: "Chưa rõ",
      allergies: "",
      medicalHistory: "",
    }
  );
  const [message, setMessage] = useState("");

  const errors = useMemo(
    () => ({
      name: profile.name.trim() && profile.name.trim().length < 3 ? "Họ tên tối thiểu 3 ký tự." : "",
      phone: profile.phone && !validatePhone(profile.phone) ? "SĐT phải có 10 chữ số và bắt đầu bằng 0." : "",
      email: profile.email && !validateEmail(profile.email) ? "Email chưa đúng định dạng." : "",
      birthYear: profile.birthYear && !validateBirthYear(profile.birthYear) ? "Năm sinh không hợp lệ." : "",
    }),
    [profile]
  );

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();
    const hasError = Object.values(errors).some(Boolean);

    if (!profile.name.trim() || !profile.phone || !profile.birthYear) {
      setMessage("Vui lòng nhập đầy đủ họ tên, số điện thoại và năm sinh.");
      return;
    }

    if (hasError) {
      setMessage("Vui lòng kiểm tra lại các trường đang báo lỗi.");
      return;
    }

    onSave({
      ...profile,
      name: profile.name.trim(),
      phone: profile.phone.replace(/\s/g, ""),
      birthYear: Number(profile.birthYear),
      allergies: profile.allergies.trim(),
      medicalHistory: profile.medicalHistory.trim(),
    });
    setMessage("Đã lưu hồ sơ bệnh nhân.");
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <fieldset>
        <legend>Thông tin hành chính</legend>
        <Input
          className={errors.name ? "invalid" : ""}
          label="Họ và tên"
          value={profile.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        {errors.name ? <small className="field-error">{errors.name}</small> : null}

        <Input
          className={errors.phone ? "invalid" : ""}
          label="Số điện thoại"
          value={profile.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        {errors.phone ? <small className="field-error">{errors.phone}</small> : null}

        <Input
          className={errors.email ? "invalid" : ""}
          label="Email"
          type="email"
          value={profile.email || ""}
          onChange={(event) => updateField("email", event.target.value)}
        />
        {errors.email ? <small className="field-error">{errors.email}</small> : null}

        <Input
          className={errors.birthYear ? "invalid" : ""}
          label="Năm sinh"
          type="number"
          value={profile.birthYear}
          onChange={(event) => updateField("birthYear", event.target.value)}
        />
        {errors.birthYear ? <small className="field-error">{errors.birthYear}</small> : null}

        <label className="field">
          <span>Giới tính</span>
          <select value={profile.gender} onChange={(event) => updateField("gender", event.target.value)}>
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Thông tin y tế</legend>
        <label className="field">
          <span>Nhóm máu</span>
          <select value={profile.bloodType} onChange={(event) => updateField("bloodType", event.target.value)}>
            <option>Chưa rõ</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </label>
        <label className="field">
          <span>Dị ứng nghiêm trọng</span>
          <input
            value={profile.allergies || ""}
            onChange={(event) => updateField("allergies", event.target.value)}
            placeholder="Ví dụ: Penicillin, hải sản"
          />
        </label>
        <label className="field">
          <span>Tiền sử bệnh</span>
          <textarea
            value={profile.medicalHistory || ""}
            onChange={(event) => updateField("medicalHistory", event.target.value)}
            placeholder="Ví dụ: tăng huyết áp, hen suyễn"
          />
        </label>
      </fieldset>

      <p className={`form-message ${message.includes("Đã") ? "success" : ""}`}>{message}</p>
      <div className="form-actions">
        <Button type="submit">Lưu hồ sơ</Button>
      </div>
    </form>
  );
}
