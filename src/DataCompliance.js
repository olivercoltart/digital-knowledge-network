import { useEffect, useState } from "react";

export default function DataCompliance({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");

  async function markCompliant(id) {
    try {
      const res = await fetch(`http://localhost:4000/api/resources/${id}/compliant`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to confirm compliance");
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, dataCompliant: true } : item
        )
      );
    } catch (err) {
      setStatus(err.message);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/api/resources/compliance", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to load resources");
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
      <h2>Data Compliance</h2>
      {status && <p>{status}</p>}
      {items.map((item) => (
        <div className="resource-card" key={item.id}>
          <strong>{item.title}</strong>
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
            <button type="button" onClick={() => markCompliant(item.id)}>
              Confirm Compliance
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
