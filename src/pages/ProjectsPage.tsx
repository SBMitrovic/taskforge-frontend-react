import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import projectApi from '../api/projectApi'
import type { Project } from '../types'

const ProjectsPage = () => {
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', priority: 'MEDIUM' })
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      const endpoint = isAdmin ? '/api/projects' : '/api/projects/my'
      const res = await projectApi.get(endpoint)
      setProjects(res.data)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await projectApi.post('/api/projects', form)
      setShowForm(false)
      setForm({ name: '', description: '', priority: 'MEDIUM' })
      fetchProjects()
    } catch {
      setError('Failed to create project.')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.heading}>Projects</h2>
        <button style={styles.createBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Create Project</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleCreate} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Project name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              style={styles.textarea}
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
            <select
              style={styles.input}
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <button style={styles.createBtn} type="submit">Create</button>
          </form>
        </div>
      )}

      <div style={styles.grid}>
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.projectName}>{project.name}</span>
              <span style={{
                ...styles.badge,
                backgroundColor: project.priority === 'HIGH' ? '#ffebe6' : project.priority === 'MEDIUM' ? '#fffae6' : '#e3fcef',
                color: project.priority === 'HIGH' ? '#de350b' : project.priority === 'MEDIUM' ? '#ff8b00' : '#006644',
              }}>
                {project.priority}
              </span>
            </div>
            <p style={styles.desc}>{project.description}</p>
            <div style={styles.cardBottom}>
              <span style={{
                ...styles.badge,
                backgroundColor: project.status === 'ACTIVE' ? '#e3fcef' : '#f4f5f7',
                color: project.status === 'ACTIVE' ? '#006644' : '#6b778c',
              }}>
                {project.status}
              </span>
              <span style={styles.members}>{project.memberIds?.length ?? 0} members</span>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div style={styles.empty}>No projects yet. Create your first one!</div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading: { fontSize: '22px', fontWeight: 600, color: '#172b4d', margin: 0 },
  createBtn: {
    backgroundColor: '#0052cc', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '4px', fontSize: '14px',
    fontWeight: 600, cursor: 'pointer',
  },
  formCard: {
    background: '#fff', padding: '24px', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  formTitle: { margin: '0 0 16px', fontSize: '16px', color: '#172b4d' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    padding: '10px 12px', borderRadius: '4px',
    border: '1px solid #dfe1e6', fontSize: '14px', outline: 'none',
  },
  textarea: {
    padding: '10px 12px', borderRadius: '4px',
    border: '1px solid #dfe1e6', fontSize: '14px',
    outline: 'none', resize: 'vertical',
  },
  error: {
    backgroundColor: '#ffebe6', color: '#de350b',
    padding: '10px 12px', borderRadius: '4px', fontSize: '13px', marginBottom: '8px',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: {
    background: '#fff', padding: '20px', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textDecoration: 'none', display: 'block',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  projectName: { fontSize: '15px', fontWeight: 600, color: '#172b4d' },
  desc: { fontSize: '13px', color: '#6b778c', margin: '0 0 12px' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 },
  members: { fontSize: '12px', color: '#6b778c' },
  empty: { textAlign: 'center', color: '#6b778c', padding: '48px', fontSize: '14px' },
}

export default ProjectsPage