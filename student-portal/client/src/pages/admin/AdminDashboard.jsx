import Card from "../../components/Card";

const AdminDashboard = () => {
  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <div className="grid-3">
        <Card title="Attendance" value="Manage" subtitle="Create/update daily attendance" />
        <Card title="Timetable" value="Manage" subtitle="Maintain class schedule" />
        <Card title="Notices" value="Manage" subtitle="Broadcast announcements" />
        <Card title="Exams" value="Manage" subtitle="Publish exam schedule" />
        <Card title="Complaints" value="Manage" subtitle="Resolve student complaints" />
      </div>
    </div>
  );
};

export default AdminDashboard;
