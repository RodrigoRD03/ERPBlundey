import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./Contexts/UserContext";
import { Login, Layout } from "./views";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./App.css";
import ForgotPassword from "./views/ForgotPasswor/ForgotPassword";
import Maintenance from "./views/Maintenance/Maintenance";

function App() {

  const MAINTENANCE_MODE = false;
  
  return (
    <UserProvider>
      <Theme>

        {MAINTENANCE_MODE ? (
          // -------- MODO MANTENIMIENTO ---------
          <Routes>
            <Route path="/Maintenance" element={<Maintenance />} />
            {/* cualquier otra ruta te manda al mantenimiento */}
            <Route path="*" element={<Navigate to="/Maintenance" replace />} />
          </Routes>
        ) : (
          // -------- RUTAS NORMALES ---------
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/layout/*" element={<Layout />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        )}

      </Theme>
    </UserProvider>
  );
}

export default App;
