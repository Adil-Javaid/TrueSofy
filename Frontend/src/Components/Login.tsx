import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./login.css";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const { authData, setAuthData } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    
    if (authData) {
      redirectToRoleBasedScreen(authData.user.role);
    }
  }, [authData, navigate]);

  
  const redirectToRoleBasedScreen = (role: string) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "team_lead") {
      navigate("/team-lead");
    } else if (role === "team_member") {
      navigate("/team-member");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/login", form);
      const token: string = response.data.token;
      const decoded: DecodedToken = jwtDecode(token);

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        setError("Session has expired. Please log in again.");
        setLoading(false);
        return;
      }
      
      setAuthData({ token, user: { id: decoded.id, role: decoded.role } });
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: decoded.id, role: decoded.role })
      );

      
      redirectToRoleBasedScreen(decoded.role);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response) {
        setError(
          err.response.data.message || "Login failed. Please try again."
        );
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginContainer">
      <h2 className="title">Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email..."
            required
            className="input"
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password..."
            required
            className="input"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
