import { useEffect, useState } from "react";
import { getResourceTypeLabel } from "./utils/resourceLabels";

const API_URL = process.env.REACT_APP_API_URL;

export default function Drafts({ token }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    content: "",
    resourceType: "PROJECT_DOCUMENTATION"
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/resources/drafts`, {
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
        <div className="resource-card" key={d.id}>
          {editingId === d.id ? (
            <div className="field">
              <label>
                Title
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  required
                />
              </label>
              <label>
                Content
                <textarea
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  required
                />
              </label>
              <label>
                Resource Type
                <select
                  value={draft.resourceType}
                  onChange={(e) =>
                    setDraft({ ...draft, resourceType: e.target.value })
                  }
                >
                  <option value="PROJECT_DOCUMENTATION">Project Documentation</option>
                  <option value="CLIENT_DATA">Client Data</option>
                  <option value="TECHNICAL_RESOURCE">Technical Resource</option>
                </select>
              </label>
              <div className="button-row">
                <button
                  type="button"
                  className="button-approve"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `${API_URL}/api/resources/${d.id}`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify(draft)
                        }
                      );
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || "Failed to update draft");
                      }
                      const updated = await res.json();
                      setItems((prev) =>
                        prev.map((item) => (item.id === d.id ? updated : item))
                      );
                      setEditingId(null);
                    } catch (err) {
                      setStatus(err.message);
                    }
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="button-reject"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <strong>{d.title}</strong>
          )}
          {d.verified && (
            <span
              className="verified-badge"
              title="This resource has been verified by the Knowledge Governance Council"
            >
              Verified
            </span>
          )}
          {d.dataCompliant && (
            <span
              className="compliance-badge"
              title="This resource has been confirmed as data compliant by a data officer"
            >
              &#128274;
            </span>
          )}
          {editingId !== d.id && (
            <>
              <div>Type: {getResourceTypeLabel(d.resourceType)}</div>
              <div>{d.content}</div>
            </>
          )}
          {editingId !== d.id && (
            <button
              type="button"
              onClick={() => {
                setEditingId(d.id);
                setDraft({
                  title: d.title,
                  content: d.content,
                  resourceType: d.resourceType || "PROJECT_DOCUMENTATION"
                });
              }}
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
