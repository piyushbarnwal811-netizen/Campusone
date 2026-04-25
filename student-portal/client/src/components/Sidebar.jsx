import { NavLink } from "react-router-dom";

const Sidebar = ({ role, user }) => {
  const studentLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/attendance", label: "Attendance" },
    { path: "/timetable", label: "Timetable" },
    { path: "/notices", label: "Notices" },
    { path: "/exams", label: "Exams" },
    { path: "/online-exam", label: "Online Exam" },
    { path: "/campus-map", label: "Campus Map" },
    { path: "/complaint", label: "Complaint" }
  ];

  const adminLinks = [
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/admin/attendance", label: "Manage Attendance" },
    { path: "/admin/timetable", label: "Manage Timetable" },
    { path: "/admin/notices", label: "Manage Notices" },
    { path: "/admin/exams", label: "Manage Exams" },
    { path: "/admin/online-exam-permissions", label: "Online Exam Permissions" },
    { path: "/admin/complaints", label: "Manage Complaints" },
    { path: "/campus-map", label: "Campus Map" }
  ];
  const facultyLinks = [
    { path: "/faculty", label: "Faculty Dashboard" },
    { path: "/faculty/attendance", label: "Manage Attendance" },
    { path: "/faculty/notices", label: "Manage Notices" },
    { path: "/timetable", label: "Timetable" },
    { path: "/notices", label: "View Notices" },
    { path: "/campus-map", label: "Campus Map" }
  ];

  const links = role === "admin" ? adminLinks : role === "faculty" ? facultyLinks : studentLinks;
  const initials = (user?.name || "SP")
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-profile-card">
        <div className="sidebar-cover" />
        <div className="sidebar-avatar">{initials}</div>
        <div className="sidebar-user-meta">
          <h2>{user?.name || "Student"}</h2>
          <p>{user?.rollNo || user?.email || "-"}</p>
          {role === "student" ? (
            <small>{user?.department || "Department"} | Sem {user?.semester || "-"}</small>
          ) : role === "faculty" ? (
            <small>{user?.department || "Department"} | Faculty</small>
          ) : (
            <small>Admin Panel Access</small>
          )}
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
