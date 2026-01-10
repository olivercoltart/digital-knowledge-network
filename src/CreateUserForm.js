import { useState } from "react";

export default function CreateUserForm() {
  const [form, setForm] = useState({ email: "", password: "", role: "USER" });
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
      setForm({ email: "", password: "", role: "USER" });
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Create User</h2>

      <label>
        Email
        <input name="email" value={form.email} onChange={onChange} required />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Role
        <select name="role" value={form.role} onChange={onChange}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </label>

      <button type="submit">Create</button>
      {status && <p>{status}</p>}
    </form>
  );
}