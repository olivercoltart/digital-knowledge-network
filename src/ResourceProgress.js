import { useEffect, useState } from "react";

const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected"
};

export default function ResourceProgress({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/api/resources/progress", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setItems(data);
        setStatus("");
      } catch (err) {
        setStatus("Failed to load progress");
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <h2>Resource Progress</h2>
      {status && <p>{status}</p>}
      {items.map((item) => (
        <div className="resource-card" key={item.id}>
          <strong>{item.title}</strong> — {STATUS_LABELS[item.status] || item.status}
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
            <span
              className="warning-badge"
              title="This resource has not been verified by the knowledge governance council or data officers - be careful when sharing this document"
            >
              Warning
            </span>
          )}
          {item.approvals?.[0]?.feedback && (
            <div>Feedback: {item.approvals[0].feedback}</div>
          )}
        </div>
      ))}
    </div>
  );
}
