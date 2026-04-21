import { NavLink } from "react-router-dom";

const Sidebar = ({ role }) => {
  const studentLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/attendance", label: "Attendance" },
    { path: "/timetable", label: "Timetable" },
    { path: "/notices", label: "Notices" },
    { path: "/exams", label: "Exams" },
    { path: "/complaint", label: "Complaint" }
  ];

  const adminLinks = [
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/admin/attendance", label: "Manage Attendance" },
    { path: "/admin/timetable", label: "Manage Timetable" },
    { path: "/admin/notices", label: "Manage Notices" },
    { path: "/admin/exams", label: "Manage Exams" },
    { path: "/admin/complaints", label: "Manage Complaints" }
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <h2>Student Portal</h2>
      <nav>
        {links.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
