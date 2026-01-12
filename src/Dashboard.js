export default function Dashboard({ user, onLogout }) {
  return (
    <div className="page">
      <div className="user-card">
        <h2>Dashboard</h2>
        <p>Welcome {user.name}</p>
        <p>Role: {user.role}</p>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}