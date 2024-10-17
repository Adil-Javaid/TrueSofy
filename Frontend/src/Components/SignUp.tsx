import React, { useState } from "react";
import axios from "axios";
import './signup.css'
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "team_member",
  });

  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post("http://localhost:8000/signup", form);
      setSuccess(
        "Signup successful! Please check your email for confirmation."
      );
      setForm({ username: "", email: "", password: "", role: "team_member" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } 
    catch (err) {
      setError("Signup failed. Please try again.");
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="signupContainer">
      <h2 className="title">Create Account</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          className="input"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email..."
          required
        />
        <input
          className="input"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select
          className="select"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="team_member">Team Member</option>
          <option value="team_lead">Team Lead</option>
          <option value="admin">Admin</option>
        </select>
        <button className="button" type="submit">
          Sign Up
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default SignUp;
