import React, { useState, useEffect } from "react";

const AddFacultyModal = ({ show, onClose, fetchFaculty }) => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    teacher_id: "",
    language: "Українська",
    form: "Лекція",
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
        console.error("Помилка отримання викладачів:", error);
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
      const response = await fetch("http://localhost:8747/api/faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Не вдалося додати факультатив");
      }

      onClose();
      fetchFaculty();
    } catch (error) {
      console.error("Помилка збереження факультативу:", error);
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
            <form onSubmit={handleSubmit}>
              <div className="mt-2">
                <label htmlFor="name" className="form-label">Назва факультативу</label>
                <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mt-2">
                <label htmlFor="department" className="form-label">Кафедра</label>
                <input type="text" className="form-control" id="department" value={formData.department} onChange={handleChange} required />
              </div>
              <div className="mt-2">
                <label htmlFor="teacher_id" className="form-label">Викладач</label>
                <select id="teacher_id" className="form-select" value={formData.teacher_id} onChange={handleChange} required>
                  <option value="">Оберіть викладача</option>
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))
                  ) : (
                    <option>Завантаження...</option>
                  )}
                </select>
              </div>
              <div className="mt-2">
                <label htmlFor="language" className="form-label">Мова викладання</label>
                <select id="language" className="form-select" value={formData.language} onChange={handleChange}>
                  <option value="Українська">Українська</option>
                  <option value="Англійська">Англійська</option>
                </select>
              </div>
              <div className="mt-2">
                <label htmlFor="form" className="form-label">Тип занять</label>
                <select id="form" className="form-select" value={formData.form} onChange={handleChange}>
                  <option value="Лекція">Лекція</option>
                  <option value="Лабораторна">Лабораторна робота</option>
                  <option value="Лекція/Лабораторна">Лекція/Лабораторна робота</option>
                </select>
              </div>
              <div className="mt-2">
                <label htmlFor="hour" className="form-label">Кількість годин</label>
                <input type="number" id="hour" className="form-control" value={formData.hour} onChange={handleChange} />
              </div>
              <div className="mt-2">
                <label htmlFor="labor_hours" className="form-label">Кількість лабораторних робіт</label>
                <input type="number" id="labor_hours" className="form-control" value={formData.labor_hours} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary mt-3">Додати</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFacultyModal;