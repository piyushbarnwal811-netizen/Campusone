import { useEffect, useState } from "react";
import { createComplaint, getMyComplaints } from "../services/complaintService";

const Complaint = () => {
  const [form, setForm] = useState({ title: "", description: "" });
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
    setForm({ title: "", description: "" });
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
        <button type="submit">Submit Complaint</button>
      </form>

      <h3>My Complaints</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
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
