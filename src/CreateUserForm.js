import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateUserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CONSULTANT",
  });
  const [status, setStatus] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const res = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create user");
      }

      setStatus("User created!");
      setForm({ name: "", email: "", password: "", role: "CONSULTANT" });
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div className="page">
      <form className="user-card" onSubmit={onSubmit}>
        <h2>Sign-Up</h2>

        <label className="field">
          Full Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

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

        <label className="field">
          Role
          <select name="role" value={form.role} onChange={onChange}>
            <option value="CONSULTANT">Consultant</option>
            <option value="CHAMPION">Knowledge Champion</option>
            <option value="COUNCIL">Governance Coucil</option>
            <option value="DATA_OFFICER">Data Officer</option>
          </select>
        </label>

        <button type="submit">Sign-Up</button>
        {status && <p className="status">{status}</p>}

        <p>
          Already have an account?{" "}
          <Link to="/login" className="App-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
