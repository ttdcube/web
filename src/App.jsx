import { AppRoutes } from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./store/authStore.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
