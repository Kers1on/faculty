import React, { useState, useEffect } from "react";

const FacultativeCard = ({ facultative }) => {
  const [isOpen, setIsOpen] = useState({});
  const [groups, setGroups] = useState([]);
  const [facultyData, setFacultyData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [errors, setErrors] = useState({});

  const handleAddFacultativeGroup = async (group) => {
    if (!group) {
      alert("Будь ласка, виберіть групу.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8747/api/faculty/group", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_name: group,
          faculty_id: facultative.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Помилка додавання групи: ${response.status}`);
      }

      const data = await response.json();
      setFacultyData((prevData) => ({
        ...prevData,
        [group]: [...(prevData[group] || []), ...(Array.isArray(data) ? data : [])],
      }));

      fetchFacultyData(group, facultative.id);
    } catch (err) {
      console.error("Помилка при додаванні групи:", err);
      alert("Не вдалося додати групу. Спробуйте ще раз.");
    }
  };
  
  const toggleModule = (groupName) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [groupName]: !prevState[groupName],
    }));
  };

  const fetchFacultyData = async (groupName, facultyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8747/api/faculty/group?group_name=${groupName}&faculty_id=${facultyId}`, {
        method: "GET", 
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error(`Ошибка запроса для ${groupName}, ${facultyId}: ${response.status}`);
        return;
      }
      const data = await response.json();
      if (data) {
        setFacultyData((prevData) => ({
          ...prevData,
          [groupName]: [...(prevData[groupName] || []), ...data],
        }));
      }
    } catch (err) {
      console.error("Ошибка при запросе данных факультета:", err);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8747/api/students", {
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const uniqueGroups = [...new Set(data.map((student) => student.student_group))];
        setGroups(uniqueGroups);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      groups.forEach((group) => {
        fetchFacultyData(group, facultative.id);
      });
    }
  }, [groups, facultative.id]);

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setShowModal(false); 
    handleAddFacultativeGroup(group);
    setSelectedGroup("");
  };

  const laborHours = facultative.labor_hours || 1;

  const handleGradeChange = async (studentId, labName, grade, groupName) => {
    const numericGrade = Number(grade);
    if (labName !== "completion_date" && (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [studentId]: { ...prevErrors[studentId], [labName]: "Оцінка повинна бути від 0 до 100" }
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [studentId]: { ...prevErrors[studentId], [labName]: "" }
    }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8747/api/faculty/group/${studentId}/${labName}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_name: groupName,
          faculty_id: facultative.id,
          student_id: studentId,
          lab_name: labName,
          lab_score: grade,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Помилка при оновленні оцінки: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error("Помилка при оновленні оцінки:", err);
    }
  };  

  const handleDeleteFacultativeGroup = (group) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8747/api/faculty/group/${group}/${facultative.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_name: group,
        faculty_id: facultative.id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Помилка видалення групи: ${res.status}`);
        }
        setFacultyData((prevData) => {
          const newData = { ...prevData };
          delete newData[group];
          return newData;
        });
      })
      .catch((err) => {
        console.error("Помилка при видаленні групи:", err);
        alert("Не вдалося видалити групу. Спробуйте ще раз.");
      });
  };  

  return (
    <div className="card-body">
      <div className="card mb-2">
        <div>
        </div>

        {groups.map((groupName) => {
          if (!facultyData[groupName] || facultyData[groupName].length === 0) {
            return null;
          }

          return (
            <div key={groupName} className="mb-2">
              <div className="card-header d-flex justify-content-between align-items-center bg-secondary text-white">
                <span>{`Группа: ${groupName}`}</span>
                <div className="btn-group">
                  <button
                    className="btn btn-secondary bg-opacity-50 border-0 shadow-sm"
                    onClick={() => handleDeleteFacultativeGroup(groupName)}>
                      Видалити
                  </button>
                  <button
                    className="btn btn-secondary bg-opacity-50 border-0 shadow-sm"
                    onClick={() => toggleModule(groupName)}
                  >
                    {isOpen[groupName] ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {isOpen[groupName] && (
                <div className="card-body p-2">
                  <table className="table table-bordered table-hover table-sm table-striped">
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
                      {facultyData[groupName]?.length > 0 ? (
                        facultyData[groupName]?.map((student, index) => (
                          <tr key={index}>
                            <td>{student.name}</td>
                            {[...Array(laborHours)].map((_, idx) => (
                              <td key={idx}>
                                <input
                                  type="number"
                                  className={`form-control form-control-sm ${errors[student.id]?.[`lr${idx + 1}`] ? 'is-invalid' : ''}`}
                                  defaultValue={student[`lr${idx + 1}`] || ""}
                                  onBlur={(e) => handleGradeChange(student.id, `lr${idx + 1}`, e.target.value, groupName)}
                                />
                                {errors[student.id]?.[`lr${idx + 1}`] && (
                                  <div className="invalid-feedback">{errors[student.id][`lr${idx + 1}`]}</div>
                                )}
                              </td>
                            ))}
                            <td>
                              <input
                                type="number"
                                className={`form-control form-control-sm ${errors[student.id]?.final_grade ? 'is-invalid' : ''}`}
                                defaultValue={student.final_grade || ""}
                                onBlur={(e) => handleGradeChange(student.id, "final_grade", e.target.value, groupName)}
                              />
                              {errors[student.id]?.final_grade && (
                                <div className="invalid-feedback">{errors[student.id].final_grade}</div>
                              )}
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                defaultValue={student.completion_date || ""}
                                onBlur={(e) => handleGradeChange(student.id, `completion_date`, e.target.value, groupName)}
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
          );
        })}
      </div>

      <button type="button" className="btn btn-outline-secondary w-100 mt-3" onClick={() => setShowModal(true)}>
        Вибрати групу
      </button>

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
    </div>
  );
};

export default FacultativeCard;