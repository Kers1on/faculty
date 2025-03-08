import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Students from "./pages/students";
import Teachers from "./pages/teachers";
import Faculty from "./pages/faculty/FacultativesPage";
import Auth from "./pages/auth";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? element : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/faculty" replace /> : element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute element={<Auth />} />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/students" element={<PrivateRoute element={<Students />} />} />
        <Route path="/teachers" element={<PrivateRoute element={<Teachers />} />} />
        <Route path="/faculty" element={<PrivateRoute element={<Faculty />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;