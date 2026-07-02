interface Props {
  open: boolean
  onClose: () => void
  user: string
  role: string
}

export default function Sidebar({ open, onClose, user, role }: Props) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className='sidebar-top'>
          <div className='logo'>
            42c<span>·</span>LAB
          </div>
          <button className='sidebar-close' aria-label='Fermer le menu' onClick={onClose}>
            ✕
          </button>
        </div>
        <nav className='nav'>
          <a className='active' href='#' onClick={onClose}>
            <span>📊</span> Dashboard
          </a>
          <a href='#' onClick={onClose}>
            <span>🧾</span> Factures
          </a>
          <a href='#' onClick={onClose}>
            <span>📈</span> Prévisions
          </a>
          <a href='#' onClick={onClose}>
            <span>⚙️</span> Préférences
          </a>
          <a href='#' onClick={onClose}>
            <span>📚</span> Aide
          </a>
        </nav>
        <div className='user-card'>
          <div className='name'>{user}</div>
          <div className='role'>{role}</div>
          <div className='role' style={{ marginTop: 8, color: '#7C8AB8' }}>
            MFA ✓ activé
          </div>
        </div>
      </aside>
    </>
  )
}
