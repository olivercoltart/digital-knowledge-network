import { useEffect, useState } from "react";
import { getResourceTypeLabel } from "./utils/resourceLabels";

const API_URL = process.env.REACT_APP_API_URL;

export default function ReviewResources({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [activeId, setActiveId] = useState(null);
  const [feedback, setFeedback] = useState({});

  async function updateStatus(id, nextStatus) {
    try {
      const res = await fetch(
        `${API_URL}/api/resources/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus, feedback: feedback[id] || "" }),
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
      setActiveId(null);
    } catch (err) {
      setStatus(err.message);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/resources/review`, {
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
          <div>Type: {getResourceTypeLabel(item.resourceType)}</div>
          <div>{item.content}</div>
          <div>Status: {item.status}</div>
          {activeId === item.id ? (
            <div>
              <label className="field">
                Feedback
                <textarea
                  name="feedback"
                  value={feedback[item.id] || ""}
                  onChange={(e) =>
                    setFeedback((prev) => ({ ...prev, [item.id]: e.target.value }))
                  }
                  required
                />
              </label>
              <div className="button-row">
                <button
                  className="button-approve"
                  type="button"
                  onClick={() => updateStatus(item.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  className="button-reject"
                  type="button"
                  onClick={() => updateStatus(item.id, "REJECTED")}
                >
                  Reject
                </button>
                <button type="button" onClick={() => setActiveId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setActiveId(item.id)}>
              Review Resource
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
