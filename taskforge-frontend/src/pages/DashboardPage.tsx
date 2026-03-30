import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import projectApi from '../api/projectApi'
import type { Project, Task } from '../types'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const { user, isAdmin } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          projectApi.get('/api/projects/my'),
          projectApi.get('/api/tasks/my'),
        ])
        setProjects(projectsRes.data)
        setTasks(tasksRes.data)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  const todo = tasks.filter(t => t.status === 'TODO').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const done = tasks.filter(t => t.status === 'DONE').length

  // Mapa projectId → ime projekta
  const projectMap = new Map(projects.map(p => [p.id, p.name]))

  return (
    <div>
      <h2 style={styles.heading}>Welcome back, {user?.username}! 👋</h2>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{projects.length}</div>
          <div style={styles.statLabel}>My Projects</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#ff8b00' }}>{todo}</div>
          <div style={styles.statLabel}>To Do</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#0052cc' }}>{inProgress}</div>
          <div style={styles.statLabel}>In Progress</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#00875a' }}>{done}</div>
          <div style={styles.statLabel}>Done</div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>My Projects</h3>
          {isAdmin && <Link to="/projects" style={styles.viewAll}>View all</Link>}
        </div>
        <div style={styles.projectGrid}>
          {projects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} style={styles.projectCard}>
              <div style={styles.projectName}>{project.name}</div>
              <div style={styles.projectDesc}>{project.description}</div>
              <div style={styles.projectMeta}>
                <span style={{
                  ...styles.badge,
                  backgroundColor: project.status === 'ACTIVE' ? '#e3fcef' : '#f4f5f7',
                  color: project.status === 'ACTIVE' ? '#006644' : '#6b778c',
                }}>
                  {project.status}
                </span>
                <span style={{
                  ...styles.badge,
                  backgroundColor: project.priority === 'HIGH' ? '#ffebe6' : '#f4f5f7',
                  color: project.priority === 'HIGH' ? '#de350b' : '#6b778c',
                }}>
                  {project.priority}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>My Tasks</h3>
        <div style={styles.taskList}>
          {tasks.map(task => (
            <div key={task.id} style={styles.taskRow}>
              <span style={{
                ...styles.statusDot,
                backgroundColor:
                  task.status === 'DONE' ? '#00875a' :
                  task.status === 'IN_PROGRESS' ? '#0052cc' : '#ff8b00',
              }} />
              <div style={styles.taskInfo}>
                <span style={styles.taskTitle}>{task.title}</span>
                <span style={styles.taskProject}>
                  {projectMap.get(task.projectId) ?? 'Unknown project'}
                </span>
              </div>
              <span style={styles.taskPriority}>{task.priority}</span>
              <span style={styles.taskStatus}>{task.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  heading: { fontSize: '22px', fontWeight: 600, marginBottom: '24px', color: '#172b4d' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
  statCard: {
    flex: 1, background: '#fff', padding: '20px 24px',
    borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  statNumber: { fontSize: '32px', fontWeight: 700, color: '#172b4d' },
  statLabel: { fontSize: '13px', color: '#6b778c', marginTop: '4px' },
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '16px', fontWeight: 600, color: '#172b4d', margin: 0 },
  viewAll: { fontSize: '13px', color: '#0052cc', textDecoration: 'none' },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  projectCard: {
    background: '#fff', padding: '20px', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textDecoration: 'none', display: 'block',
  },
  projectName: { fontSize: '15px', fontWeight: 600, color: '#172b4d', marginBottom: '6px' },
  projectDesc: { fontSize: '13px', color: '#6b778c', marginBottom: '12px' },
  projectMeta: { display: 'flex', gap: '8px' },
  badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 },
  taskList: { background: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' },
  taskRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 20px', borderBottom: '1px solid #f4f5f7',
  },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  taskInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  taskTitle: { fontSize: '14px', color: '#172b4d' },
  taskProject: { fontSize: '11px', color: '#6b778c' },
  taskPriority: { fontSize: '12px', color: '#6b778c' },
  taskStatus: { fontSize: '12px', color: '#6b778c', minWidth: '80px', textAlign: 'right' },
}

export default DashboardPage