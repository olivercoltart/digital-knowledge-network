import { useEffect, useState } from "react";

export default function AuditResources({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");

  async function verifyResource(id) {
    try {
      const res = await fetch(`http://localhost:4000/api/resources/${id}/verify`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to verify resource");
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, verified: true } : item))
      );
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function deleteResource(id) {
    const confirmed = window.confirm(
      "Delete this resource and all associated approvals?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/resources/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete resource");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setStatus(err.message);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/api/resources/audit", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to load audit list");
        }
        const data = await res.json();
        setItems(data);
        setStatus("");
      } catch (err) {
        setStatus(err.message);
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <h2>Audit Resources</h2>
      {status && <p>{status}</p>}
      {items.map((item) => (
        <div className="resource-card" key={item.id}>
          <strong>{item.title}</strong>
          {item.verified && (
            <span
              className="verified-badge"
              title="This resource has been verified by the Knowledge Governance Council"
            >
              Verified
            </span>
          )}
          {item.dataCompliant && (
            <span
              className="compliance-badge"
              title="This resource has been confirmed as data compliant by a data officer"
            >
              &#128274;
            </span>
          )}
          {item.status === "APPROVED" && !item.verified && !item.dataCompliant && (
            <div className="resource-warning">
              This resource has not been verified by the knowledge governance council or data officers - be careful when sharing this document
            </div>
          )}
          <div>Type: {item.resourceType}</div>
          <div>{item.content}</div>
          <div>Status: {item.status}</div>
          <div className="button-row">
            <button type="button" onClick={() => verifyResource(item.id)}>
              Verify
            </button>
            <button type="button" onClick={() => deleteResource(item.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
