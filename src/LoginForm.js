import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("Checking...");

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      onLogin?.({ user: data.user, token: data.token });
      setStatus("Login ok");
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div className="page">
      <form className="user-card" onSubmit={onSubmit}>
        <h2>Login</h2>
        <label className="field">
          Email
          <input name="email" value={form.email} onChange={onChange} required />
        </label>
        <label className="field">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>
        <button type="submit">Login</button>
        {status && <p>{status}</p>}

        <p>
          Don't have an account?{" "}
          <Link to="/" className="App-link">
            Sign-Up
          </Link>
        </p>
      </form>
    </div>
  );
}
