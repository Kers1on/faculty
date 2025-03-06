import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Layout from "../layout/layout";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:8747/api/teachers");
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({ name: "" });
  };

  const handleShow = (teacher = null) => {
    if (teacher) {
      setIsEditing(true);
      setEditingId(teacher.id);
      setFormData({ name: teacher.name });
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
      ? `http://localhost:8747/api/teachers/${editingId}`
      : "http://localhost:8747/api/teachers";

    try {
      await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      handleClose();
      fetchTeachers();
    } catch (error) {
      console.error("Помилка збереження викладача:", error);
    }
  };

  const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:8747/api/teachers/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) fetchTeachers();
      } catch (error) {
        console.error(error);
      }
  };

  return (
    <Layout>
      <div className="col-sm p-3 min-vh-100 content-area">
        <h2 className="text-center w-100 bg">Викладачі</h2>
        <hr />
        <Table striped bordered hover size="sm">
          <thead className="table-dark">
            <tr className="text-center">
              <th>ПІБ Викладача</th>
              <th style={{ width: "10%" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td className="text-center">
                  <Button variant="secondary" size="sm" onClick={() => handleShow(teacher)} className="me-2">
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(teacher.id)}>
                    <MdDeleteForever />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="secondary" className="w-100 mt-3" onClick={() => handleShow()}>+ Додати</Button>

        {/* Модальне вікно */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? "Редагувати викладача" : "Додати викладача"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>ПІБ</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Введіть ПІБ" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSave}>Зберегти</Button>
            <Button variant="secondary" onClick={handleClose}>Закрити</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default Teachers;