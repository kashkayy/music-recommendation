import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import "./App.css";
import Home from "./pages/Home";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/Protect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminContent from "./containers/AdminContent";
import AdminProtectedRoute from "./auth/AdminProtect";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/auth/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />}></Route>
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminContent />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  );
}
export default App;
