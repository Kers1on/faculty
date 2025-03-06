import React, { useState } from "react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
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
        {activeTab === "login" && (
          <div className="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
            <h2 className="text-center mb-4">Авторизація</h2>
            <form>
              <div className="form-group">
                <label htmlFor="login">Логін</label>
                <input type="text" className="form-control" id="login" name="login" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input type="password" className="form-control" id="password" name="password" required />
                {/* Забув пароль теж сторінку не робив, тому може видалити */}
                <a href="#" className="forgot-password d-block mt-2 text-secondary">
                  Забув пароль?
                </a>
              </div>
              {/* Запам'ятати мене */}
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="remember-me" name="remember-me" />
                <label className="form-check-label" htmlFor="remember-me">
                  Запам'ятати мене
                </label>
              </div>
              <button type="submit" className="btn btn-secondary btn-block mt-3">
                Увійти
              </button>
            </form>
            <a href="#register" className="register-link text-secondary" onClick={() => handleTabSwitch("register")}>
              Зареєструватися
            </a>
          </div>
        )}

        {/* Реєстрація */}
        {activeTab === "register" && (
          <div className="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
            <h2 className="text-center mb-4">Реєстрація</h2>
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
                <input
                  type="password"
                  className="form-control"
                  id="reg-confirm-password"
                  name="confirm-password"
                  required
                />
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="agree" name="agree" />
                <label className="form-check-label" htmlFor="agree">
                  Я типу погоджуюсь з умовами
                </label>
              </div>
              <button type="submit" className="btn btn-secondary btn-block mt-3">
                Зареєструватися
              </button>
            </form>
            <a href="#login" className="register-link text-secondary" onClick={() => handleTabSwitch("login")}>
              Вже маєте акаунт? Увійти
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
