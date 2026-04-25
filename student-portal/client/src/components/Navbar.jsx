const Navbar = ({ title, onLogout, user }) => {
  const workspaceLabel = user?.role === "admin"
    ? "Admin Workspace"
    : user?.role === "faculty"
      ? "Faculty Workspace"
      : "Student Workspace";
  const universityName = "Rungta International Skill University";
  const initials = (user?.name || "U")
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="brand-badge">RU</div>
        <div>
          <p className="navbar-kicker">{universityName}</p>
          <h1>{title} ({workspaceLabel})</h1>
        </div>
      </div>
      <div className="navbar-search-wrap">
        <input type="text" placeholder="Search RISU Portal" className="navbar-search" />
      </div>
      <div className="navbar-right">
        <span className="navbar-icon" title="Notifications">N</span>
        <span className="user-dot" title={user?.name}>{initials}</span>
        <button type="button" className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
