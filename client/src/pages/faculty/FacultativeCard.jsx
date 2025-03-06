import React, { useState, memo } from "react";
import FacultativeGroup from "./FacultativeGroup";

const FacultativeCard = memo(({ facultative }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModule = () => setIsOpen(!isOpen);

  return (
    <div className="facultative-cards">
      <div key={facultative.id} className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center bg-secondary text-white">
          <span className="text-center flex-grow-1">
            {`${facultative.name} | ${facultative.department} | ${facultative.teacher_name} | ${facultative.form} | ${facultative.language} | ${facultative.hour} год. | ЛР: ${facultative.labor_hours}`}
          </span>
          <div className="btn-group">
            <button className="btn btn-secondary bg-opacity-50 border-0">Редагувати</button>
            <button className="btn btn-secondary bg-opacity-50 border-0">Видалити</button>
            <button className="btn btn-secondary bg-opacity-50 border-0" onClick={toggleModule}>
              {isOpen ? "∧" : "∨"}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="card-body">
            <FacultativeGroup />
          </div>
        )}
      </div>
    </div>
  );
});

export default FacultativeCard;