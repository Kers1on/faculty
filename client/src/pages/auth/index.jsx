import React, { useState } from "react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container bg-light p-5 rounded shadow">
      {/* Вкладки для перемикання між авторизацією та реєстрацією */}
      <ul className="nav nav-tabs" id="authTab" role="tablist">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "login" ? "active text-secondary" : "text-secondary"}`}
            onClick={() => handleTabSwitch("login")}
            role="tab"
            aria-controls="login"
            aria-selected={activeTab === "login"}
          >
            Авторизація
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "register" ? "active text-secondary" : "text-secondary"}`}
            onClick={() => handleTabSwitch("register")}
            role="tab"
            aria-controls="register"
            aria-selected={activeTab === "register"}
          >
            Реєстрація
          </a>
        </li>
      </ul>

      {/* Вміст вкладок */}
      <div className="tab-content form-container" id="authTabContent">
        {/* Авторизація */}
        <div className={`tab-pane fade ${activeTab === "login" ? "show active" : ""}`} id="login" role="tabpanel" aria-labelledby="login-tab">
          <h2 className="text-center mb-4 mt-2">Авторизація</h2>
          <form>
            <div className="form-group">
              <label htmlFor="login">Логін</label>
              <input type="text" className="form-control" id="login" name="login" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input type="password" className="form-control" id="password" name="password" required />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-secondary mt-3 w-100">
                Увійти
              </button>
            </div>
          </form>
        </div>

        {/* Реєстрація */}
        <div className={`tab-pane fade ${activeTab === "register" ? "show active" : ""}`} id="register" role="tabpanel" aria-labelledby="register-tab">
          <h2 className="text-center mb-4 mt-2">Реєстрація</h2>
          <form>
            <div className="form-group">
              <label htmlFor="reg-login">Логін</label>
              <input type="text" className="form-control" id="reg-login" name="login" required />
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Пароль</label>
              <input type="password" className="form-control" id="reg-password" name="password" required />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm-password">Підтвердження паролю</label>
              <input type="password" className="form-control" id="reg-confirm-password" name="confirm-password" required />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-secondary mt-3 w-100">
                Зареєструватися
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;