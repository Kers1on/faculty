import React, { useState, useEffect } from "react";
import FacultativeCard from "./FacultativeCard";
import Layout from "../layout/layout";
import AddFacultyModal from "./AddFacultyModal";

const FacultativesPage = () => {
  const [facultatives, setFacultatives] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await fetch("http://localhost:8747/api/faculty", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFacultatives(data);
    } catch (error) {
      console.error("Помилка отримання факультативів:", error);
    }
  };

  const deleteFaculty = async (facultyId) => {
    try {
      const response = await fetch(`http://localhost:8747/api/faculty/${facultyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faculty_id: facultyId }),
      });

      if (response.ok) {
        setFacultatives(facultatives.filter(fac => fac.id !== facultyId));
      } 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="col-sm p-3 min-vh-100 content-area" style={{ backgroundColor: "rgb(231, 238, 247)" }}>
        <h1 className="text-xl font-bold text-center">Факультативи</h1>
        {facultatives.map((facultative) => (
          <FacultativeCard             
            key={facultative.id}
            facultative={facultative}
            deleteFaculty={deleteFaculty}
            fetchFaculty={fetchFaculty} />
        ))}
        <button type="button" className="btn btn-outline-secondary w-100 mt-3" onClick={handleOpenModal}>
          + Додати новий факультатив
        </button>
      </div>
      <AddFacultyModal show={showModal} onClose={handleCloseModal} fetchFaculty={fetchFaculty} />
    </Layout>
  );
};

export default FacultativesPage;