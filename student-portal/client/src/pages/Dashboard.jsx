import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../components/Card";
import { UNIVERSITY_LOGO_URL, UNIVERSITY_NAME } from "../config/branding";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="dashboard-grid">
      <section className="page dashboard-main">
        <div className="admission-card dashboard-welcome">
          <div className="dashboard-branding">
            {UNIVERSITY_LOGO_URL && !logoError ? (
              <img
                src={UNIVERSITY_LOGO_URL}
                alt={UNIVERSITY_NAME}
                className="dashboard-logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="dashboard-logo-fallback">RU</div>
            )}
            <div>
              <h3>{UNIVERSITY_NAME}</h3>
              <p className="muted">Official Student Dashboard</p>
            </div>
          </div>
          <h2>Welcome, {user?.name}</h2>
          <p className="muted">Student profile overview</p>
        </div>

        <div className="grid-3">
          <Card title="Role" value={user?.role || "-"} />
          <Card title="Department" value={user?.department || "-"} />
          <Card title="Semester" value={user?.semester || "-"} />
        </div>

        <div className="empty-feed">
          <h3>Dashboard</h3>
          <p className="muted">Use quick links from right panel to open modules.</p>
        </div>
      </section>

      <aside className="page dashboard-side">
        <div className="today-head">
          <p>Quick Access</p>
          <Link to="/">Home</Link>
        </div>
        <div className="today-card">
          <h3>{user?.department || "Department"}</h3>
          <p><strong>Student:</strong> {user?.name || "-"}</p>
          <p><strong>Roll No:</strong> {user?.rollNo || "-"}</p>
          <p><strong>Semester:</strong> {user?.semester || "-"}</p>
        </div>
        <div className="quick-links">
          <Link to="/attendance">Attendance</Link>
          <Link to="/timetable">Timetable</Link>
          <Link to="/notices">Notices</Link>
          <Link to="/exams">Exams</Link>
          <Link to="/online-exam">Online Exam</Link>
          <Link to="/campus-map">Campus Map</Link>
          <Link to="/complaint">Complaint</Link>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
