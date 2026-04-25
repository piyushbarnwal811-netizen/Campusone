import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRANCH_OPTIONS } from "../constants/branches";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const {
    login,
    register,
    requestRegisterOtp,
    requestPasswordResetOtp,
    resetPasswordWithOtp,
    user
  } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    rollNo: "",
    department: "",
    semester: ""
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : user.role === "faculty" ? "/faculty" : "/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const usesOtp = isRegister || isResetMode;
    if (name === "email" && usesOtp && otpSentTo && value.trim().toLowerCase() !== otpSentTo) {
      setOtpSentTo("");
      setForm((prev) => ({ ...prev, otp: "", [name]: value }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setError("Please enter email first.");
      return;
    }

    setError("");
    setInfo("");
    setOtpLoading(true);

    try {
      const data = isRegister
        ? await requestRegisterOtp({ email })
        : await requestPasswordResetOtp({ email });
      setOtpSentTo(email);
      setInfo(data.message || "OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      if (isRegister) {
        if (!form.otp) {
          setError("Please enter OTP.");
          return;
        }
        await register({
          ...form,
          email: form.email.trim().toLowerCase(),
          semester: form.semester ? Number(form.semester) : undefined
        });
      } else if (isResetMode) {
        if (!form.otp) {
          setError("Please enter OTP.");
          return;
        }
        if (form.password.length < 6) {
          setError("New password must be at least 6 characters.");
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Confirm password does not match.");
          return;
        }

        const data = await resetPasswordWithOtp({
          email: form.email.trim().toLowerCase(),
          otp: form.otp,
          newPassword: form.password
        });
        setInfo(data.message || "Password reset successful.");
        setIsResetMode(false);
        setForm((prev) => ({ ...prev, otp: "", password: "", confirmPassword: "" }));
      } else {
        await login({ email: form.email.trim().toLowerCase(), password: form.password });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>{isRegister ? "Student Register" : isResetMode ? "Forgot Password" : "Login"}</h2>
        <p className="muted auth-subtitle">
          Rungta International Skill University
        </p>
        <p className="muted auth-subtitle">
          {isRegister
            ? "Create your account to access classes and notices."
            : isResetMode
              ? "Verify OTP and set your new password."
              : "Sign in to continue to your dashboard."}
        </p>

        {isRegister && (
          <>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="rollNo" placeholder="Roll Number" value={form.rollNo} onChange={handleChange} />
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select Branch / Program</option>
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <input
              name="semester"
              type="number"
              placeholder="Semester"
              value={form.semester}
              onChange={handleChange}
              min="1"
              max="12"
            />
          </>
        )}

        <div className="otp-row">
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          {isRegister || isResetMode ? (
            <button type="button" className="otp-send-btn" onClick={handleSendOtp} disabled={otpLoading}>
              {otpLoading ? "Sending..." : "Send OTP"}
            </button>
          ) : null}
        </div>

        {isRegister || isResetMode ? (
          <input
            name="otp"
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            maxLength={6}
            required
          />
        ) : null}
        <div className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={isResetMode ? "New Password" : "Password"}
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {isResetMode ? (
          <div className="password-field">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        ) : null}

        {error && <p className="error">{error}</p>}
        {info && <p className="success">{info}</p>}

        <button type="submit">
          {isRegister ? "Register" : isResetMode ? "Reset Password" : "Login"}
        </button>
        {!isRegister && !isResetMode ? (
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setIsResetMode(true);
              setIsRegister(false);
              setError("");
              setInfo("");
              setOtpSentTo("");
              setForm((prev) => ({ ...prev, otp: "", password: "", confirmPassword: "" }));
            }}
          >
            Forgot Password?
          </button>
        ) : null}
        <button
          type="button"
          className="ghost"
          onClick={() => {
            if (isResetMode) {
              setIsResetMode(false);
              setIsRegister(false);
            } else {
              setIsRegister((prev) => !prev);
              setIsResetMode(false);
            }
            setError("");
            setInfo("");
            setOtpSentTo("");
            setForm((prev) => ({
              ...prev,
              otp: "",
              password: "",
              confirmPassword: ""
            }));
          }}
        >
          {isResetMode ? "Back to Login" : isRegister ? "Have account? Login" : "New student? Register"}
        </button>
      </form>
    </div>
  );
};

export default Login;
