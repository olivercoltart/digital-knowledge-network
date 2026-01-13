import { useEffect, useState } from "react";

export default function ReviewResources({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");

  async function updateStatus(id, nextStatus) {
    try {
      const res = await fetch(
        `http://localhost:4000/api/resources/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update status");
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (err) {
      setStatus(err.message);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/api/resources/review", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to load reviews");
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
      <h2>Review Resources</h2>
      {status && <p>{status}</p>}
      {items.map((item) => (
        <div key={item.id}>
          <strong>{item.title}</strong>
          <div>Type: {item.resourceType}</div>
          <div>{item.content}</div>
          <div>Status: {item.status}</div>
          <div className="button-row">
            <button
              type="button"
              onClick={() => updateStatus(item.id, "APPROVED")}
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => updateStatus(item.id, "REJECTED")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
