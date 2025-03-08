import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({ name: "", password: "", confirmPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const endpoint = activeTab === "login" ? "/api/auth/login" : "/api/auth/register";
    const requestData =
      activeTab === "login"
        ? { name: formData.name, password: formData.password }
        : { name: formData.name, password: formData.password, confirmPassword: formData.confirmPassword };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Помилка сервера");
      }

      localStorage.setItem("token", data.token);
      navigate("/faculty");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container bg-light p-5 rounded shadow">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "login" ? "active text-secondary" : "text-secondary"}`} onClick={() => handleTabSwitch("login")}>
            Авторизація
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "register" ? "active text-secondary" : "text-secondary"}`} onClick={() => handleTabSwitch("register")}>
            Реєстрація
          </button>
        </li>
      </ul>

      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

      <div className="tab-content form-container">
        {activeTab === "login" ? (
          <div className="tab-pane fade show active">
            <h2 className="text-center mb-4 mt-2">Авторизація</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Логін</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-secondary mt-3 w-100">Увійти</button>
            </form>
          </div>
        ) : (
          <div className="tab-pane fade show active">
            <h2 className="text-center mb-4 mt-2">Реєстрація</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Логін</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Підтвердження паролю</label>
                <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-secondary mt-3 w-100">Зареєструватися</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;