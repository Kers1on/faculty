import React, { useState, useEffect } from "react";
import FacultativeCard from "./FacultativeCard";
import Layout from "../layout/layout";

const FacultativesPage = () => {
  const [facultatives, setFacultatives] = useState([]);

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
        <button type="button" className="btn btn-outline-secondary w-100 mt-3" data-bs-toggle="modal" data-bs-target="#addSubjectModal"> + Додати новий факультатив</button>
      </div>
    </Layout>
  );
};

export default FacultativesPage;