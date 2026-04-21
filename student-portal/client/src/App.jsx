import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
import Attendance from "./pages/Attendance";
import Complaint from "./pages/Complaint";
import Dashboard from "./pages/Dashboard";
import Exams from "./pages/Exams";
import Login from "./pages/Login";
import Notices from "./pages/Notices";
import Timetable from "./pages/Timetable";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAttendance from "./pages/admin/ManageAttendance";
import ManageComplaints from "./pages/admin/ManageComplaints";
import ManageExams from "./pages/admin/ManageExams";
import ManageNotices from "./pages/admin/ManageNotices";
import ManageTimetable from "./pages/admin/ManageTimetable";

const AppShell = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      <Sidebar role={user.role} />
      <div className="content-area">
        <Navbar title="Student Portal" user={user} onLogout={logout} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const StudentOnly = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "student" ? children : <Navigate to="/admin" replace />;
};

const AdminOnly = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardRedirect />} />

          <Route
            path="/attendance"
            element={
              <StudentOnly>
                <Attendance />
              </StudentOnly>
            }
          />
          <Route
            path="/timetable"
            element={
              <StudentOnly>
                <Timetable />
              </StudentOnly>
            }
          />
          <Route
            path="/notices"
            element={
              <StudentOnly>
                <Notices />
              </StudentOnly>
            }
          />
          <Route
            path="/exams"
            element={
              <StudentOnly>
                <Exams />
              </StudentOnly>
            }
          />
          <Route
            path="/complaint"
            element={
              <StudentOnly>
                <Complaint />
              </StudentOnly>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminOnly>
                <AdminDashboard />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <AdminOnly>
                <ManageAttendance />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/timetable"
            element={
              <AdminOnly>
                <ManageTimetable />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <AdminOnly>
                <ManageNotices />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <AdminOnly>
                <ManageExams />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <AdminOnly>
                <ManageComplaints />
              </AdminOnly>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Dashboard />;
};

export default App;
