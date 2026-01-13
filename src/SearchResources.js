import { useEffect, useMemo, useState } from "react";

export default function SearchResources({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/api/resources/approved", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setItems(data);
        setStatus("");
      } catch (err) {
        setStatus("Failed to load resources");
      }
    }
    load();
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = type === "ALL" || item.resourceType === type;
      const matchesText =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q);
      return matchesType && matchesText;
    });
  }, [items, query, type]);

  return (
    <div>
      <h2>Search Resources</h2>

      <label className="field">
        Keyword
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or content"
        />
      </label>

      <label className="field">
        Resource Type
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ALL">All</option>
          <option value="PROJECT_DOCUMENTATION">Project Documentation</option>
          <option value="CLIENT_DATA">Client Data</option>
          <option value="TECHNICAL_RESOURCE">Technical Resource</option>
        </select>
      </label>

      {status && <p>{status}</p>}
      {filtered.map((item) => (
        <div key={item.id}>
          <strong>{item.title}</strong>
          <div>Type: {item.resourceType}</div>
          <div>{item.content}</div>
        </div>
      ))}
    </div>
  );
}
