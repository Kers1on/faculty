import React, { useState, memo } from "react";
import FacultativeGroup from "./FacultativeGroup";
import AddFacultyModal from "./AddFacultyModal"; 

const FacultativeCard = memo(({ facultative, deleteFaculty, fetchFaculty, }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleModule = () => setIsOpen(!isOpen);
  const handleDelete = async () => await deleteFaculty(facultative.id);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  return (
    <div className="facultative-cards">
      <div key={facultative.id} className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center bg-secondary text-white">
          <span className="text-center flex-grow-1">
            {`${facultative.name} | ${facultative.department} | ${facultative.teacher_name} | ${facultative.form} | ${facultative.language} | ${facultative.hour} год. | ЛР: ${facultative.labor_hours}`}
          </span>
          <div className="btn-group">
            <button className="btn btn-secondary bg-opacity-50 border-0 shadow-sm" onClick={openEditModal}>Редагувати</button>
            <button className="btn btn-secondary bg-opacity-50 border-0 shadow-sm" onClick={handleDelete}>Видалити</button>
            <button className="btn btn-secondary bg-opacity-50 border-0 shadow-sm" onClick={toggleModule}>
              {isOpen ? "▲" : "▼"}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="card-body">
              <FacultativeGroup  facultative={facultative} />
          </div>

        )}
      </div>

      <AddFacultyModal 
        show={isEditModalOpen} 
        onClose={closeEditModal} 
        fetchFaculty={fetchFaculty} 
        initialData={facultative}
      />
    </div>
  );
});

export default FacultativeCard;
