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
        <div key={item.id}>
          <strong>{item.title}</strong> — {STATUS_LABELS[item.status] || item.status}
          {item.approvals?.[0]?.feedback && (
            <div>Feedback: {item.approvals[0].feedback}</div>
          )}
        </div>
      ))}
    </div>
  );
}
