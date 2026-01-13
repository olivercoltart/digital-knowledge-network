import { useEffect, useState } from "react";

export default function Drafts({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/api/resources/drafts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data);
        setStatus("");
      } catch (err) {
        setStatus("Failed to load drafts");
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <h2>My Drafts</h2>
      {status && <p>{status}</p>}
      {items.map((d) => (
        <div key={d.id}>
          <strong>{d.title}</strong>
          <div>Type: {d.resourceType}</div>
          <div>{d.content}</div>
        </div>
      ))}
    </div>
  );
}
