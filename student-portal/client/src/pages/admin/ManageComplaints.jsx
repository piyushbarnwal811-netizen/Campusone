import { useEffect, useState } from "react";
import { getComplaintDepartmentLabel } from "../../constants/complaintDepartments";
import { getAllComplaints, updateComplaint } from "../../services/complaintService";

const ManageComplaints = () => {
  const [list, setList] = useState([]);

  const loadData = async () => {
    const data = await getAllComplaints();
    setList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (id, status, response) => {
    await updateComplaint(id, { status, response });
    await loadData();
  };

  return (
    <div className="page">
      <h2>Manage Complaints</h2>
      <div className="stack">
        {list.map((item) => (
          <div className="card" key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <small>
              Student: {item.student?.name} | Department: {getComplaintDepartmentLabel(item.targetDepartment)} | Status: {item.status}
            </small>
            <div className="row">
              <button type="button" onClick={() => handleUpdate(item._id, "in_progress", item.response || "Complaint in review")}>In Progress</button>
              <button type="button" onClick={() => handleUpdate(item._id, "resolved", "Resolved by admin")}>Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageComplaints;
