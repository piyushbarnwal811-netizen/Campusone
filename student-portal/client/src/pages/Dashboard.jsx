import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h2>Welcome, {user?.name}</h2>
      <div className="grid-3">
        <Card title="Role" value={user?.role || "-"} />
        <Card title="Department" value={user?.department || "-"} />
        <Card title="Semester" value={user?.semester || "-"} />
      </div>
      <p className="muted">Quick Links</p>
      <div className="quick-links">
        <Link to="/attendance">Attendance</Link>
        <Link to="/timetable">Timetable</Link>
        <Link to="/notices">Notices</Link>
        <Link to="/exams">Exams</Link>
        <Link to="/complaint">Complaint</Link>
      </div>
    </div>
  );
};

export default Dashboard;
