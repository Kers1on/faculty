import React, { useState, useEffect } from "react";
import FacultativeCard from "./FacultativeCard";
import Layout from "../layout/layout";
import AddSubjectModal from "./AddFacultyModal";

const FacultativesPage = () => {
  const [facultatives, setFacultatives] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    fetch("http://localhost:8747/api/faculty")
      .then((res) => res.json())
      .then((data) => setFacultatives(data));
  }, []);

  return (
    <Layout>
      <div className="col-sm p-3 min-vh-100 content-area">
        <h1 className="text-xl font-bold">Факультативи</h1>
        {facultatives.map((facultative) => (
          <FacultativeCard key={facultative.id} facultative={facultative} />
        ))}
        <button type="button" className="btn btn-outline-secondary w-100 mt-3" onClick={handleOpenModal}>
          + Додати новий факультатив
        </button>
      </div>
      <AddSubjectModal show={showModal} onClose={handleCloseModal} />
    </Layout>
  );
};

export default FacultativesPage;
