import { useEffect, useState } from "react";
import { createExam, deleteExam, getAllExams } from "../../services/examService";

const ManageExams = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    maxMarks: "100",
    department: "",
    semester: ""
  });

  const loadData = async () => {
    const data = await getAllExams();
    setList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createExam({ ...form, maxMarks: Number(form.maxMarks), semester: Number(form.semester) });
    setForm({ subject: "", date: "", startTime: "", endTime: "", room: "", maxMarks: "100", department: "", semester: "" });
    await loadData();
  };

  return (
    <div className="page">
      <h2>Manage Exams</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required />
        <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
        <input type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} required />
        <input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} required />
        <input placeholder="Room" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
        <input type="number" placeholder="Max Marks" value={form.maxMarks} onChange={(e) => setForm((p) => ({ ...p, maxMarks: e.target.value }))} />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} required />
        <input type="number" placeholder="Semester" value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))} required />
        <button type="submit">Add</button>
      </form>

      <table>
        <thead>
          <tr><th>Subject</th><th>Date</th><th>Time</th><th>Dept/Sem</th><th>Action</th></tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item._id}>
              <td>{item.subject}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.startTime} - {item.endTime}</td>
              <td>{item.department} / {item.semester}</td>
              <td><button type="button" onClick={async () => { await deleteExam(item._id); await loadData(); }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageExams;
