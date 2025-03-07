import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const AddFacultyModal = ({ show, onClose, fetchFaculty, initialData = null }) => {
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
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8747/api/teachers", {
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Помилка отримання викладачів:", error);
      }
    };
  
    if (show) {
      fetchTeachers();
      if (initialData) {
        setFormData({
          name: initialData.name,
          department: initialData.department,
          teacher_id: initialData.teacher_name,
          language: initialData.language,
          form: initialData.form,
          hour: initialData.hour,
          labor_hours: initialData.labor_hours,
        });
      } else {
        setFormData({
          name: "",
          department: "",
          teacher_id: "",
          language: "Українська",
          form: "Лекція",
          hour: "",
          labor_hours: "",
        });
      }
    }
  }, [show, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `http://localhost:8747/api/faculty/${initialData.id}`
        : "http://localhost:8747/api/faculty";

      const response = await fetch(url, {
        method,
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Не вдалося зберегти факультатив");
      }
      onClose();
      await fetchFaculty()    
    } catch (error) {
      console.error("Помилка збереження факультативу:", error);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} centered animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Редагувати факультатив" : "Додати новий факультатив"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" className="mt-2">
            <Form.Label>Назва факультативу</Form.Label>
            <Form.Control type="text" value={formData.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="department" className="mt-2">
            <Form.Label>Кафедра</Form.Label>
            <Form.Control type="text" value={formData.department} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="teacher_id" className="mt-2">
            <Form.Label>Викладач</Form.Label>
            <Form.Control as="select" value={formData.teacher_id} onChange={handleChange} required>
              <option value="">Оберіть викладача</option>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))
              ) : (
                <option>Завантаження...</option>
              )}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="language" className="mt-2">
            <Form.Label>Мова викладання</Form.Label>
            <Form.Control as="select" value={formData.language} onChange={handleChange}>
              <option value="Українська">Українська</option>
              <option value="Англійська">Англійська</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="form" className="mt-2">
            <Form.Label>Тип занять</Form.Label>
            <Form.Control as="select" value={formData.form} onChange={handleChange}>
              <option value="Лекція">Лекція</option>
              <option value="Лабораторна">Лабораторна робота</option>
              <option value="Лекція/Лабораторна">Лекція/Лабораторна робота</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="hour" className="mt-2">
            <Form.Label>Кількість годин</Form.Label>
            <Form.Control type="number" value={formData.hour} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="labor_hours" className="mt-2">
            <Form.Label>Кількість лабораторних робіт</Form.Label>
            <Form.Control type="number" value={formData.labor_hours} onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            {initialData ? "Зберегти зміни" : "Додати"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddFacultyModal;
