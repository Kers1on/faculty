import React, { useState, useEffect } from "react";

const AddSubjectModal = ({ show, onClose }) => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    teacher_id: "",
    language: "uk",
    form: "lecture",
    hour: "",
    labor_hours: "",
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:8747/api/teachers");
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (show) {
      fetchTeachers();
    }
  }, [show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:8747/api/faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!show) return null; 

  return (
    <div className="modal fade show" style={{ display: "block" }} id="addSubjectModal" tabIndex="-1" aria-labelledby="addSubjectModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content"> 
          <div className="modal-header">
            <h5 className="modal-title" id="addSubjectModalLabel">Додати новий факультатив</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="addFacultyForm">
              <div className="mt-2">
                <label htmlFor="facultyName" className="form-label">Назва факультативу</label>
                <input type="text" className="form-control" id="facultyName" required />
              </div>
              <div className="mt-2">
                <label htmlFor="department" className="form-label">Кафедра</label>
                <input type="text" className="form-control" id="department" required />
              </div>
              {/* Поле "Викладач" с выпадающим списком */}
              <div className="mt-2">
                <label htmlFor="teacher" className="form-label">Викладач</label>
                <select id="teacher" className="form-select" required>
                  <option value="">Выберите преподавателя</option>
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))
                  ) : (
                    <option>Загрузка...</option>
                  )}
                </select>
              </div>
              <div className="mt-2">
                <label htmlFor="language" className="form-label">Мова викладання</label>
                <select id="language" className="form-select">
                  <option value="uk">Українська</option>
                  <option value="en">Англійська</option>
                </select>
              </div>
              <div className="mt-2">
                <label htmlFor="type" className="form-label">Тип занять</label>
                <select id="type" className="form-select">
                  <option value="lecture">Лекція</option>
                  <option value="lab">Лабораторна робота</option>
                  <option value="both">Лекція/Лабораторна робота</option>
                </select>
              </div>
              <div className="mt-2">
                <label htmlFor="hours" className="form-label">Кількість годин</label>
                <input type="number" id="hours" className="form-control" />
              </div>
              <div className="mt-2">
                <label htmlFor="labs" className="form-label">Кількість лабораторних робіт</label>
                <input type="number" id="labs" className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">Додати</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
