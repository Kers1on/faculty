import React from "react";
import { useState, useEffect } from "react";
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

  const handleSave = async () => {
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

  // const handleDelete = async (id) => {
  //   if (window.confirm("Ви справді хочете видалити цього студента?")) {
  //     try {
  //       const response = await fetch(`http://localhost:8747/api/students/${id}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  
  //       if (response.ok) {
  //         fetchStudents();
  //       } else {
  //         console.error("Помилка при видаленні студента");
  //       }
  //     } catch (error) {
  //       console.error("Помилка видалення студента:", error);
  //     }
  //   }
  // };

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
      <div className="col-sm p-3 min-vh-100 content-area" style={{ backgroundColor: "rgb(231, 238, 247)" }}>
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
              <Form.Group className="mb-2">
                <Form.Label>ПІБ</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Введіть ПІБ" 
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Телефон</Form.Label>
                <Form.Control 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Введіть телефон" 
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Ел.пошта</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Введіть email" 
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Група</Form.Label>
                <Form.Control 
                  type="text" 
                  name="student_group" 
                  value={formData.student_group} 
                  onChange={handleChange} 
                  placeholder="Введіть групу" 
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Кафедра</Form.Label>
                <Form.Control 
                  type="text" 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  placeholder="Введіть кафедру" 
                />
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