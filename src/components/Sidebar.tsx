export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        42c<span>·</span>LAB
      </div>
      <nav className="nav">
        <a className="active" href="#"><span>📊</span> Dashboard</a>
      </nav>
      <div className="user-card">
        <div className="name">Marc Dupont</div>
        <div className="role">DSI · Editions Galaxie</div>
        <div className="role" style={{ marginTop: 8, color: '#7C8AB8' }}>MFA ✓ activé</div>
      </div>
    </aside>
  );
}
