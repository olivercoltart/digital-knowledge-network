import { useState } from "react";

export default function ResourceUpload({ token }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    resourceType: "PROJECT_DOCUMENTATION",
    createdAt: "",
  });
  const [statusMsg, setStatusMsg] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e, status) {
    e.preventDefault();
    setStatusMsg("Saving...");

    const payload = {
      title: form.title,
      content: form.content,
      resourceType: form.resourceType,
      status,
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
      setForm({
        title: "",
        content: "",
        resourceType: "PROJECT_DOCUMENTATION",
        createdAt: ""
      });
    } catch (err) {
      setStatusMsg(err.message);
    }
  }

  return (
    <div className="page">
      <form className="user-card">
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
          Resource Type
          <select name="resourceType" value={form.resourceType} onChange={onChange}>
            <option value="PROJECT_DOCUMENTATION">Project Documentation</option>
            <option value="CLIENT_DATA">Client Data</option>
            <option value="TECHNICAL_RESOURCE">Technical Resource</option>
          </select>
        </label>

        <div className="button-row">
          <button type="button" onClick={(e) => onSubmit(e, "DRAFT")}>
            Save Draft
          </button>
          <button type="button" onClick={(e) => onSubmit(e, "SUBMITTED")}>
            Submit Resource
          </button>
        </div>
        {statusMsg && <p className="status">{statusMsg}</p>}
      </form>
    </div>
  );
}
