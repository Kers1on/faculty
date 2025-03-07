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

  const [errors, setErrors] = useState({
    name: "",
    department: "",
    teacher_id: "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Назва факультативу є обов'язковою";
    if (!formData.department) newErrors.department = "Кафедра є обов'язковою";
    if (!formData.teacher_id) newErrors.teacher_id = "Вибір викладача є обов'язковим";

    if (isNaN(formData.hour) || formData.hour <= 0) {
      newErrors.hour = "Кількість годин повинна бути числом більше за 0";
    }

    if (isNaN(formData.labor_hours) || formData.labor_hours < 0) {
      newErrors.labor_hours = "Кількість лабораторних робіт повинна бути числом більше або рівним 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `http://localhost:8747/api/faculty/${initialData.id}`
        : "http://localhost:8747/api/faculty";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Не вдалося зберегти факультатив");
      }
      onClose();
      await fetchFaculty();
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
            <Form.Control
              type="text"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="department" className="mt-2">
            <Form.Label>Кафедра</Form.Label>
            <Form.Control
              type="text"
              value={formData.department}
              onChange={handleChange}
              isInvalid={!!errors.department}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="teacher_id" className="mt-2">
            <Form.Label>Викладач</Form.Label>
            <Form.Control
              as="select"
              value={formData.teacher_id}
              onChange={handleChange}
              isInvalid={!!errors.teacher_id}
              required
            >
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
            <Form.Control.Feedback type="invalid">{errors.teacher_id}</Form.Control.Feedback>
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
            <Form.Control
              type="number"
              value={formData.hour}
              onChange={handleChange}
              isInvalid={!!errors.hour}
            />
            <Form.Control.Feedback type="invalid">{errors.hour}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="labor_hours" className="mt-2">
            <Form.Label>Кількість лабораторних робіт</Form.Label>
            <Form.Control
              type="number"
              value={formData.labor_hours}
              onChange={handleChange}
              isInvalid={!!errors.labor_hours}
            />
            <Form.Control.Feedback type="invalid">{errors.labor_hours}</Form.Control.Feedback>
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
