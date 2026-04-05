import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/dashboard" style={styles.logo}>TaskForge</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/projects" style={styles.link}>Projects</Link>
        {isAdmin && <Link to="/projects" style={{ ...styles.link, color: '#ff8b00' }}>Admin</Link>}
      </div>
      <div style={styles.right}>
        <span style={styles.username}>👤 {user?.username}</span>
        <span style={styles.role}>{user?.role}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '56px',
    backgroundColor: '#0052cc',
    color: '#fff',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  logo: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '18px',
    textDecoration: 'none',
    marginRight: '16px',
  },
  link: {
    color: '#b3d4ff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontSize: '14px',
    color: '#fff',
  },
  role: {
    fontSize: '11px',
    backgroundColor: '#0747a6',
    padding: '2px 8px',
    borderRadius: '12px',
    color: '#b3d4ff',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #b3d4ff',
    color: '#b3d4ff',
    padding: '6px 14px',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  },
}

export default Navbar