import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const FacultyDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h2>Faculty Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <p className="muted">Use the quick links below to manage your daily workflow.</p>
      <div className="quick-links">
        <Link to="/faculty/attendance">Manage Attendance</Link>
        <Link to="/faculty/notices">Manage Notices</Link>
        <Link to="/timetable">View Timetable</Link>
      </div>
    </div>
  );
};

export default FacultyDashboard;
