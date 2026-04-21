import { useEffect, useState } from "react";
import { deleteAttendance, getAllAttendance, markAttendance } from "../../services/attendanceService";
import { getStudents } from "../../services/authService";

const ManageAttendance = () => {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ studentId: "", date: "", subject: "", status: "present" });

  const loadData = async () => {
    const [s, r] = await Promise.all([getStudents(), getAllAttendance()]);
    setStudents(s);
    setRecords(r);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await markAttendance(form);
    setForm({ studentId: "", date: "", subject: "", status: "present" });
    await loadData();
  };

  const handleDelete = async (id) => {
    await deleteAttendance(id);
    await loadData();
  };

  return (
    <div className="page">
      <h2>Manage Attendance</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <select value={form.studentId} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))} required>
          <option value="">Select Student</option>
          {students.map((student) => (
            <option value={student._id} key={student._id}>{student.name} ({student.rollNo || "N/A"})</option>
          ))}
        </select>
        <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required />
        <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
        <button type="submit">Save</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Date</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.student?.name}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.subject}</td>
              <td>{record.status}</td>
              <td><button type="button" onClick={() => handleDelete(record._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAttendance;
