import { Link } from "react-router-dom";

export default function Sidebar({ userRole }) {
  return (
    <nav className="sidebar">
      <h3 className="sidebar-title">Menu</h3>
      <Link to="/login">Dashboard</Link>
      <Link to="/submit">Submit Resource</Link>
      <Link to="/search">Search Resources</Link>
      <Link to="/recommended">Recommended Resources</Link>
      <Link to="/drafts">Drafts</Link>
      <Link to="/progress">Resource Progress</Link>
      {userRole === "CHAMPION" && <Link to="/review">Review Resources</Link>}
      {userRole === "COUNCIL" && <Link to="/audit">Audit Resources</Link>}
    </nav>
  );
}
