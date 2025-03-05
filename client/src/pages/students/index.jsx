import React from "react"
import { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Layout from "../layout/layout";

const Students = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    group: "",
    department: "",
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSave = () => {
    console.log("Saving student:", formData);
    handleClose();
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
                    <th style={{ width: "20%" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Тут будуть студенти */}
                </tbody>
              </Table>
              <Button variant="secondary" className="w-100 mt-3" onClick={handleShow}>
                + Додати
              </Button>
            </div>
          </div>
        </div>

        {/* Модальне вікно */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Додати студента</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>ПІБ</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Введіть ПІБ" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Телефон</Form.Label>
                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Введіть телефон" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Ел.пошта</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Введіть email" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Група</Form.Label>
                <Form.Control type="text" name="group" value={formData.group} onChange={handleChange} placeholder="Введіть групу" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Кафедра</Form.Label>
                <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Введіть кафедру" />
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
  )
}

export default Students;