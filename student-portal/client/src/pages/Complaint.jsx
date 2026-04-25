import { useEffect, useState } from "react";
import {
  COMPLAINT_DEPARTMENTS,
  getComplaintDepartmentLabel
} from "../constants/complaintDepartments";
import { createComplaint, getMyComplaints } from "../services/complaintService";

const Complaint = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDepartment: COMPLAINT_DEPARTMENTS[0].value
  });
  const [items, setItems] = useState([]);

  const loadComplaints = async () => {
    const data = await getMyComplaints();
    setItems(data);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createComplaint(form);
    setForm({ title: "", description: "", targetDepartment: COMPLAINT_DEPARTMENTS[0].value });
    await loadComplaints();
  };

  return (
    <div className="page">
      <h2>Complaint Desk</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <input
          placeholder="Complaint title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
        <textarea
          placeholder="Describe your issue"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          required
        />
        <select
          value={form.targetDepartment}
          onChange={(e) => setForm((prev) => ({ ...prev, targetDepartment: e.target.value }))}
          required
        >
          {COMPLAINT_DEPARTMENTS.map((department) => (
            <option key={department.value} value={department.value}>{department.label}</option>
          ))}
        </select>
        <button type="submit">Submit Complaint</button>
      </form>

      <h3>My Complaints</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Status</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{getComplaintDepartmentLabel(item.targetDepartment)}</td>
              <td>{item.status}</td>
              <td>{item.response || "Pending response"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Complaint;
