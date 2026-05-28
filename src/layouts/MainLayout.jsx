import { Footer } from "./Footer.jsx";
import { Sidebar } from "./Sidebar.jsx";

export function MainLayout({ activePage, onNavigate, children }) {
  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="app-shell">
        {children}
        <Footer />
      </div>
    </div>
  );
}
