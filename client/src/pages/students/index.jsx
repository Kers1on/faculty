import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Layout from "../layout/layout";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    student_group: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8747/api/students", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Помилка отримання студентів:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      student_group: "",
      department: "",
    });
    setFormErrors({});
  };

  const handleShow = (student = null) => {
    if (student) {
      setIsEditing(true);
      setEditingId(student.id);
      setFormData({
        name: student.name,
        phone: student.phone,
        email: student.email,
        student_group: student.student_group,
        department: student.department,
      });
    } else {
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, phone, email, student_group, department } = formData;
    let errors = {};
    
    if (!name) errors.name = "Поле ПІБ є обов'язковим";
    if (!phone) errors.phone = "Поле Телефон є обов'язковим";
    if (!email) errors.email = "Поле Ел.пошта є обов'язковим";
    if (!student_group) errors.student_group = "Поле Група є обов'язковим";
    if (!department) errors.department = "Поле Кафедра є обов'язковим";

    const phoneRegex = /^[0-9]+$/;
    if (phone && !phoneRegex.test(phone)) {
      errors.phone = "Телефон має містити тільки цифри";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      errors.email = "Будь ласка, введіть коректну електронну пошту";
    }

    const groupRegex = /^[0-9_]+$/;
    if (student_group && !groupRegex.test(student_group)) {
      errors.student_group = "Група може містити лише цифри та символ нижнього підкреслення (_)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:8747/api/students/${editingId}`
      : "http://localhost:8747/api/students";

    try {
      await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      handleClose();
      fetchStudents();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleShowDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8747/api/students/${deleteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        fetchStudents();
      } else {
        console.error("Помилка при видаленні студента");
      }
    } catch (error) {
      console.error("Помилка видалення студента:", error);
    }
    setShowDeleteModal(false);
  };

  return (
    <Layout>
      <div className="col-sm p-3 min-vh-100 content-area">
        <h2 className="text-center w-100 bg">Студенти</h2>
        <hr />
        <div className="container-fluid">
          <div className="justify-content-between align-items-center">
            <div id="studentsPage" className="page">
              <Table striped bordered hover size="sm">
                <thead className="table-dark">
                  <tr className="text-center">
                    <th>ПІБ</th>
                    <th>Телефон</th>
                    <th>Ел.пошта</th>
                    <th>Група</th>
                    <th>Кафедра</th>
                    <th style={{ width: "10%" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.phone}</td>
                      <td>{student.email}</td>
                      <td>{student.student_group}</td>
                      <td>{student.department}</td>
                      <td className="text-center">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleShow(student)} 
                          className="me-2"
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleShowDeleteModal(student.id)}
                        >
                          <MdDeleteForever />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="secondary" className="w-100 mt-3" onClick={() => handleShow()}>
                + Додати
              </Button>
            </div>
          </div>
        </div>

        {/* Модальне вікно */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? "Редагувати студента" : "Додати студента"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className={`mb-2 ${formErrors.name ? 'has-error' : ''}`}>
                <Form.Label>ПІБ</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Введіть ПІБ" 
                  isInvalid={formErrors.name}
                />
                {formErrors.name && <Form.Text className="text-danger">{formErrors.name}</Form.Text>}
              </Form.Group>
              <Form.Group className={`mb-2 ${formErrors.phone ? 'has-error' : ''}`}>
                <Form.Label>Телефон</Form.Label>
                <Form.Control 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Введіть телефон" 
                  isInvalid={formErrors.phone}
                />
                {formErrors.phone && <Form.Text className="text-danger">{formErrors.phone}</Form.Text>}
              </Form.Group>
              <Form.Group className={`mb-2 ${formErrors.email ? 'has-error' : ''}`}>
                <Form.Label>Ел.пошта</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Введіть email" 
                  isInvalid={formErrors.email}
                />
                {formErrors.email && <Form.Text className="text-danger">{formErrors.email}</Form.Text>}
              </Form.Group>
              <Form.Group className={`mb-2 ${formErrors.student_group ? 'has-error' : ''}`}>
                <Form.Label>Група</Form.Label>
                <Form.Control 
                  type="text" 
                  name="student_group" 
                  value={formData.student_group} 
                  onChange={handleChange} 
                  placeholder="Введіть групу" 
                  isInvalid={formErrors.student_group}
                />
                {formErrors.student_group && <Form.Text className="text-danger">{formErrors.student_group}</Form.Text>}
              </Form.Group>
              <Form.Group className={`mb-2 ${formErrors.department ? 'has-error' : ''}`}>
                <Form.Label>Кафедра</Form.Label>
                <Form.Control 
                  type="text" 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  placeholder="Введіть кафедру" 
                  isInvalid={formErrors.department}
                />
                {formErrors.department && <Form.Text className="text-danger">{formErrors.department}</Form.Text>}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSave}>
              {isEditing ? "Зберегти зміни" : "Зберегти"}
            </Button>
            <Button variant="secondary" onClick={handleClose}>Закрити</Button>
          </Modal.Footer>
        </Modal>

        {/* Модальне вікно підтвердження видалення */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Підтвердження видалення</Modal.Title>
          </Modal.Header>
          <Modal.Body>Ви справді хочете видалити цього студента?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete}>Видалити</Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Скасувати</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default Students;