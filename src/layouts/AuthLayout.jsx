export function AuthLayout({ children }) {
  return (
    <main className="auth-layout">
      <section className="auth-panel">{children}</section>
    </main>
  );
}
