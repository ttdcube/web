export function Sidebar({ activePage, onNavigate }) {
  const items = [
    ["home", "Trang chủ"],
    ["patient", "Bệnh nhân"],
    ["doctor", "Bác sĩ"],
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span>CF</span>
        <div>
          <strong>ClinicFlow</strong>
          <small>Medical Booking</small>
        </div>
      </div>
      <nav>
        {items.map(([key, label]) => (
          <button className={activePage === key ? "active" : ""} key={key} type="button" onClick={() => onNavigate(key)}>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
