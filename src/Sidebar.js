import { Link } from "react-router-dom";

export default function Sidebar({ userRole }) {
  return (
    <nav className="sidebar">
      <h3 className="sidebar-title">Menu</h3>
      <Link to="/login">Home</Link>
      <Link to="/submit">Submit Resource</Link>
      <Link to="/search">Search Resources</Link>
      <Link to="/recommended">Recommended Resources</Link>
      <Link to="/drafts">Drafts</Link>
      {userRole === "CHAMPION" && <Link to="/review">Review Resources</Link>}
    </nav>
  );
}
