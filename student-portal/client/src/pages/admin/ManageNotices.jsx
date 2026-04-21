import { useEffect, useState } from "react";
import { createNotice, deleteNotice, getAllNotices } from "../../services/noticeService";

const ManageNotices = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", audience: "all" });

  const loadData = async () => {
    const data = await getAllNotices();
    setList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNotice(form);
    setForm({ title: "", body: "", audience: "all" });
    await loadData();
  };

  return (
    <div className="page">
      <h2>Manage Notices</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
        <textarea placeholder="Notice body" value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} required />
        <select value={form.audience} onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}>
          <option value="all">All</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
        <button type="submit">Publish</button>
      </form>

      <div className="stack">
        {list.map((item) => (
          <div className="card" key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <small>Audience: {item.audience}</small>
            <button type="button" onClick={async () => { await deleteNotice(item._id); await loadData(); }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageNotices;
