import { useEffect, useState } from "react";
import {
  createTimetable,
  deleteTimetable,
  getAllTimetable
} from "../../services/timetableService";

const ManageTimetable = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    day: "Monday",
    subject: "",
    startTime: "",
    endTime: "",
    room: "",
    teacher: "",
    department: "",
    semester: ""
  });

  const loadData = async () => {
    const data = await getAllTimetable();
    setList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTimetable({ ...form, semester: Number(form.semester) });
    setForm({ day: "Monday", subject: "", startTime: "", endTime: "", room: "", teacher: "", department: "", semester: "" });
    await loadData();
  };

  return (
    <div className="page">
      <h2>Manage Timetable</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <select value={form.day} onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required />
        <input type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} required />
        <input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} required />
        <input placeholder="Room" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
        <input placeholder="Teacher" value={form.teacher} onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))} />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} required />
        <input type="number" placeholder="Semester" value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))} required />
        <button type="submit">Add</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Day</th><th>Subject</th><th>Time</th><th>Dept/Sem</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item._id}>
              <td>{item.day}</td>
              <td>{item.subject}</td>
              <td>{item.startTime} - {item.endTime}</td>
              <td>{item.department} / {item.semester}</td>
              <td><button type="button" onClick={async () => { await deleteTimetable(item._id); await loadData(); }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTimetable;
