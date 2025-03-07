import React, { useState, useEffect } from "react";

const FacultativeGroup = ({ facultative }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    fetch("http://localhost:8747/api/students")
      .then((res) => res.json())
      .then((data) => {
        const uniqueGroups = [...new Set(data.map((student) => student.student_group))];
        setGroups(uniqueGroups);
      })
      .catch((err) => console.error("Ошибка загрузки групп:", err));
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetch("http://localhost:8747/api/faculty/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_name: selectedGroup,
          faculty_id: facultative.id,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          fetch(`http://localhost:8747/api/faculty/group?group_name=${selectedGroup}&faculty_id=${facultative.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              const filteredStudents = data.filter(student => student.student_group === selectedGroup);
              setStudents(filteredStudents);
              console.log(filteredStudents);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  }, [selectedGroup, facultative.id]);

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setShowModal(false);
    setIsOpen(false);
  };

  const laborHours = facultative.labor_hours || 1;

  const handleGradeChange = (studentId, labName, grade) => {
    fetch(`http://localhost:8747/api/faculty/group/${studentId}/${labName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_name: selectedGroup,
        faculty_id: facultative.id,
        student_id: studentId,
        lab_name: labName,
        lab_score: grade,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="card-body">
      {selectedGroup && (
        <div className="mt-3">
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            <div className="card mb-2">
              <div className="card-header d-flex justify-content-between align-items-center bg-secondary text-white">
                <span>{selectedGroup}</span>
                <button
                  className="btn btn-secondary bg-opacity-50 border-0 shadow-sm"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? "<" : ">"}
                </button>
              </div>
              {isOpen && (
                <div className="card-body p-2">
                  <table className="table table-bordered table-hover table-sm table-striped" style={{ minWidth: "600px" }}>
                    <thead className="table-dark">
                      <tr>
                        <th>ПІБ</th>
                        {[...Array(laborHours)].map((_, idx) => (
                          <th key={idx}>ЛР{idx + 1}</th>
                        ))}
                        <th>Кінцева оцінка</th>
                        <th>Дата закінчення</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <tr key={student.id}>
                            <td>{student.name}</td>
                            {[...Array(laborHours)].map((_, idx) => (
                              <td key={idx}>
                                <input
                                  type="number"
                                  defaultValue={student[`lr${idx + 1}`] || ""}
                                  onBlur={(e) => handleGradeChange(student.id, `lr${idx + 1}`, e.target.value)}
                                />
                              </td>
                            ))}
                            <td>
                              <input
                                type="number"
                                defaultValue={student.final_grade || ""}
                                onBlur={(e) => handleGradeChange(student.id, "final_grade", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                defaultValue={student.completion_date || ""}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={laborHours + 2}>Немає студентів у цій групі.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Оберіть групу</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <select
                  id="groupSelect"
                  className="form-select"
                  value={selectedGroup}
                  onChange={(e) => handleGroupSelection(e.target.value)}
                >
                  <option value="">Оберіть групу</option>
                  {groups.map((group, index) => (
                    <option key={index} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button type="button" className="btn btn-outline-secondary w-100 mt-3" onClick={() => setShowModal(true)}>
        Вибрати групу
      </button>
    </div>
  );
};

export default FacultativeGroup;

