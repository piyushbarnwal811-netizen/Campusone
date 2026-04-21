import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    department: "",
    semester: ""
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await register({
          ...form,
          semester: form.semester ? Number(form.semester) : undefined
        });
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>{isRegister ? "Student Register" : "Login"}</h2>

        {isRegister && (
          <>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="rollNo" placeholder="Roll Number" value={form.rollNo} onChange={handleChange} />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
            <input
              name="semester"
              type="number"
              placeholder="Semester"
              value={form.semester}
              onChange={handleChange}
            />
          </>
        )}

        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">{isRegister ? "Register" : "Login"}</button>
        <button type="button" className="ghost" onClick={() => setIsRegister((prev) => !prev)}>
          {isRegister ? "Have account? Login" : "New student? Register"}
        </button>
      </form>
    </div>
  );
};

export default Login;
