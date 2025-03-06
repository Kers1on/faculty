import React, { useState, useEffect } from "react";

const FacultativeGroup = ({ group }) => {
  const [students, setStudents] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      fetch(`http://localhost:8747/api/faculty/group/${group.group_name}`)
        .then((res) => res.json())
        .then((data) => setStudents(data))
        .catch((err) => console.error("Помилка завантаження студентів:", err));
    }
  }, [expanded]);

  return (
    <div className="border p-2 m-2">
      <div className="flex justify-between">
        <h3>{group.group_name}</h3>
        <button onClick={() => setExpanded(!expanded)}> {expanded ? "🔽" : "▶️"} </button>
      </div>

      {expanded && (
        <table className="w-full border mt-2">
          <thead>
            <tr>
              <th>ПІБ</th>
              <th>ЛР1</th>
              <th>ЛР2</th>
              <th>ЛР3</th>
              <th>ЛР4</th>
              <th>Кінцева оцінка</th>
              <th>Дата закінчення</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td><input type="number" defaultValue={student.lr1 || ""} /></td>
                <td><input type="number" defaultValue={student.lr2 || ""} /></td>
                <td><input type="number" defaultValue={student.lr3 || ""} /></td>
                <td><input type="number" defaultValue={student.lr4 || ""} /></td>
                <td><input type="number" defaultValue={student.final_grade || ""} /></td>
                <td><input type="date" defaultValue={student.completion_date || ""} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FacultativeGroup;