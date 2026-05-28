import { useState } from "react";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { HomePage } from "../pages/Home/HomePage.jsx";
import { PatientPage } from "../pages/Patient/PatientPage.jsx";
import { DoctorPage } from "../pages/Doctor/DoctorPage.jsx";

export function AppRoutes() {
  const [page, setPage] = useState("home");

  return (
    <MainLayout activePage={page} onNavigate={setPage}>
      {page === "home" ? <HomePage onNavigate={setPage} /> : null}
      {page === "patient" ? <PatientPage /> : null}
      {page === "doctor" ? <DoctorPage /> : null}
    </MainLayout>
  );
}
