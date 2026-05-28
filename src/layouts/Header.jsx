export function Header({ title, subtitle, actions }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">ClinicFlow</p>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="topbar-actions">{actions}</div>
    </header>
  );
}
