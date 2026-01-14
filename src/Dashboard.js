import { useEffect, useState } from "react";
import { getRoleLabel } from "./utils/roleLabels";

const API_URL = process.env.REACT_APP_API_URL;

export default function Dashboard({ user, token, onLogout }) {
  const [approvedCount, setApprovedCount] = useState(0);
  const [progressItems, setProgressItems] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    let isMounted = true;

    async function loadContributions() {
      try {
        const res = await fetch(`${API_URL}/api/resources/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to load contributions");
        }
        const data = await res.json();
        const count = data.filter((item) => item.status === "APPROVED").length;
        if (isMounted) {
          setApprovedCount(count);
          setProgressItems(data);
          setStatus("");
        }
      } catch (err) {
        if (isMounted) {
          setStatus(err.message);
        }
      }
    }

    loadContributions();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="page dashboard-page">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-grid">
        <div className="user-card dashboard-card">
          <p>Welcome {user.name}</p>
          <p>Role: {getRoleLabel(user.role)}</p>
          <div className="dashboard-section">
            <h3>Contributions</h3>
            {status ? <p>{status}</p> : <p>Approved resources: {approvedCount}</p>}
          </div>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
        <div className="user-card dashboard-card">
          <h3>Approved Resources</h3>
          {status ? <p>{status}</p> : <p>{approvedCount}</p>}
        </div>
        <div className="user-card dashboard-card">
          <h3>Resource Progress</h3>
          {status ? (
            <p>{status}</p>
          ) : (
            <div className="progress-list">
              <p>Submitted: {progressItems.filter((item) => item.status === "SUBMITTED").length}</p>
              <p>Approved: {progressItems.filter((item) => item.status === "APPROVED").length}</p>
              <p>Rejected: {progressItems.filter((item) => item.status === "REJECTED").length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
