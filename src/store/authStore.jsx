import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("clinicflow-user");
    return saved ? JSON.parse(saved) : { name: "Người dùng demo", role: "patient" };
  });

  const value = useMemo(
    () => ({
      user,
      login(nextUser) {
        setUser(nextUser);
        localStorage.setItem("clinicflow-user", JSON.stringify(nextUser));
      },
      logout() {
        setUser(null);
        localStorage.removeItem("clinicflow-user");
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
