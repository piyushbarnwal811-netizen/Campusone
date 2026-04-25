import { useEffect, useState } from "react";
import {
  getOnlineExamPermissions,
  grantOnlineExamPermission
} from "../../services/onlineExamService";

const ManageOnlineExam = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const data = await getOnlineExamPermissions();
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGrant = async (studentId) => {
    await grantOnlineExamPermission(studentId);
    setMessage("Permission granted successfully.");
    await loadData();
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Online Exam Permissions</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Online Exam Permissions</h2>
      {message ? <p className="success">{message}</p> : null}
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Total Attempts</th>
            <th>Status</th>
            <th>Last Submitted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.student._id}>
              <td>{row.student.name}</td>
              <td>{row.student.rollNo || "-"}</td>
              <td>{row.student.department || "-"}</td>
              <td>{row.totalAttempts || 0}</td>
              <td>{row.canAttempt ? "Allowed" : "Locked"}</td>
              <td>
                {row.lastSubmission?.submittedAt
                  ? new Date(row.lastSubmission.submittedAt).toLocaleString()
                  : "-"}
              </td>
              <td>
                <button type="button" onClick={() => handleGrant(row.student._id)}>
                  Grant Permission
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOnlineExam;
