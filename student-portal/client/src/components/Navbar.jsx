const Navbar = ({ title, onLogout, user }) => {
  return (
    <header className="navbar">
      <h1>{title}</h1>
      <div className="navbar-right">
        <span>{user?.name} ({user?.role})</span>
        <button type="button" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
