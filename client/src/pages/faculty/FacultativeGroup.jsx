import React, { useState } from "react";

const FacultativeGroup = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-body">
      <div className="card mb-2">
        <div className="card-header d-flex justify-content-between align-items-center bg-secondary text-white">
          <span>6.04.122.010.21.1</span>
          <button
            className="btn btn-secondary bg-opacity-50 border-0 shadow-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "🔽" : "▶️"}
          </button>
        </div>
        {expanded && (
          <div className="card-body p-2">
            <table className="table table-bordered table-hover table-sm table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ПІБ</th>
                  <th>ЛР1</th>
                  <th>ЛР2</th>
                  <th>ЛР3</th>
                  <th>ЛР4</th>
                  <th>Кінцева оцінка</th>
                  <th>Дата закінчення</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Белка Максим</td>
                  <td>5</td>
                  <td>6</td>
                  <td>4</td>
                  <td>7</td>
                  <td>7</td>
                  <td>01.04.2025</td>
                </tr>
                <tr>
                  <td>Протопопов Максим</td>
                  <td>+</td>
                  <td>+</td>
                  <td>+</td>
                  <td>+</td>
                  <td>+</td>
                  <td>+</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <button
        type="button"
        className="btn btn-outline-secondary w-100 mt-3"
        data-bs-toggle="modal"
        data-bs-target="#addGroupModal"
      >
        + Додати нову групу
      </button>
    </div>
  );
};

export default FacultativeGroup;
