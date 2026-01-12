import { useState } from "react";

export default function ResourceUpload({ token }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "DRAFT",
    createdAt: "",
  });
  const [statusMsg, setStatusMsg] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatusMsg("Saving...");

    const payload = {
      title: form.title,
      content: form.content,
      status: form.status,
      createdAt: form.createdAt ? new Date(form.createdAt).toISOString() : undefined,
    };

    try {
      const res = await fetch("http://localhost:4000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create resource");
      }

      setStatusMsg("Resource created");
      setForm({ title: "", content: "", status: "DRAFT", createdAt: "" });
    } catch (err) {
      setStatusMsg(err.message);
    }
  }

  return (
    <div className="page">
      <form className="user-card" onSubmit={onSubmit}>
        <h2>Resource Upload</h2>

        <label className="field">
          Title
          <input name="title" value={form.title} onChange={onChange} required />
        </label>

        <label className="field">
          Content
          <textarea name="content" value={form.content} onChange={onChange} required />
        </label>

        <label className="field">
          Status
          <select name="status" value={form.status} onChange={onChange}>
            <option value="DRAFT">DRAFT</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </label>

        <label className="field">
          Created At (optional)
          <input
            name="createdAt"
            type="datetime-local"
            value={form.createdAt}
            onChange={onChange}
          />
        </label>

        <button type="submit">Save</button>
        {statusMsg && <p className="status">{statusMsg}</p>}
      </form>
    </div>
  );
}
