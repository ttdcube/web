import { useState } from "react";
import { validateBirthYear, validatePhone } from "../../utils/validators.js";
import { Button } from "../common/Button.jsx";
import { Input } from "../common/Input.jsx";

export function PatientProfileForm({ initialProfile, onSave }) {
  const [profile, setProfile] = useState(
    initialProfile || { name: "", phone: "", birthYear: "", gender: "Nam" }
  );
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (profile.name.trim().length < 3) {
      setMessage("Vui lòng nhập họ tên bệnh nhân.");
      return;
    }
    if (!validatePhone(profile.phone)) {
      setMessage("Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.");
      return;
    }
    if (!validateBirthYear(profile.birthYear)) {
      setMessage("Năm sinh không hợp lệ.");
      return;
    }

    onSave({
      ...profile,
      name: profile.name.trim(),
      phone: profile.phone.replace(/\s/g, ""),
      birthYear: Number(profile.birthYear),
    });
    setMessage("Đã lưu hồ sơ bệnh nhân.");
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <Input label="Họ và tên" value={profile.name} onChange={(event) => updateField("name", event.target.value)} />
      <Input label="Số điện thoại" value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} />
      <Input
        label="Năm sinh"
        type="number"
        value={profile.birthYear}
        onChange={(event) => updateField("birthYear", event.target.value)}
      />
      <label className="field">
        <span>Giới tính</span>
        <select value={profile.gender} onChange={(event) => updateField("gender", event.target.value)}>
          <option>Nam</option>
          <option>Nữ</option>
          <option>Khác</option>
        </select>
      </label>
      <p className={`form-message ${message.includes("Đã") ? "success" : ""}`}>{message}</p>
      <div className="form-actions">
        <Button type="submit">Lưu hồ sơ</Button>
      </div>
    </form>
  );
}
