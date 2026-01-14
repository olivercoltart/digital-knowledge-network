import { useEffect, useMemo, useState } from "react";
import { getResourceTypeLabel } from "./utils/resourceLabels";

export default function SearchResources({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyCompliant, setOnlyCompliant] = useState(false);

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
      const matchesVerified = !onlyVerified || item.verified;
      const matchesCompliant = !onlyCompliant || item.dataCompliant;
      return matchesType && matchesText && matchesVerified && matchesCompliant;
    });
  }, [items, query, type, onlyVerified, onlyCompliant]);

  return (
    <div>
      <h2>Search Resources</h2>

      <label className="field">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or content"
        />
      </label>

      <label className="field">
        <strong>Resource Type</strong>
        <select className="type-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ALL">All</option>
          <option value="PROJECT_DOCUMENTATION">Project Documentation</option>
          <option value="CLIENT_DATA">Client Data</option>
          <option value="TECHNICAL_RESOURCE">Technical Resource</option>
        </select>
      </label>

      <label className="field checkbox-field">
        <input
          type="checkbox"
          checked={onlyVerified}
          onChange={(e) => setOnlyVerified(e.target.checked)}
        />
        <strong>Verified</strong>
      </label>

      <label className="field checkbox-field">
        <input
          type="checkbox"
          checked={onlyCompliant}
          onChange={(e) => setOnlyCompliant(e.target.checked)}
        />
        <strong>Data Compliant</strong>
      </label>

      {status && <p>{status}</p>}
      {filtered.map((item) => (
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
            <span
              className="warning-badge"
              title="This resource has not been verified by the knowledge governance council or data officers - be careful when sharing this document"
            >
              Warning
            </span>
          )}
          <div>Type: {getResourceTypeLabel(item.resourceType)}</div>
          <div>{item.content}</div>
        </div>
      ))}
    </div>
  );
}
