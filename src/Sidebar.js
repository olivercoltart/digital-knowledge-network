import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <h3 className="sidebar-title">Menu</h3>
      <Link to="/submit">Submit Resource</Link>
      <Link to="/search">Search Resources</Link>
      <Link to="/recommended">Recommended Resources</Link>
    </nav>
  );
}
