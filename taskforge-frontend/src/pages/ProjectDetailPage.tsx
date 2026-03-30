import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import projectApi from '../api/projectApi'
import type { Project, Task } from '../types'

const statusColors: Record<string, { bg: string; color: string }> = {
  TODO:        { bg: '#fffae6', color: '#ff8b00' },
  IN_PROGRESS: { bg: '#deebff', color: '#0052cc' },
  DONE:        { bg: '#e3fcef', color: '#006644' },
}

const ProjectDetailPage = () => {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM' })
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectApi.get(`/api/projects/${id}`),
        projectApi.get(`/api/tasks/project/${id}`),
      ])
      setProject(projectRes.data)
      setTasks(tasksRes.data)
    } catch (err) {
      console.error('Failed to fetch project', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [id])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await projectApi.post('/api/tasks', { ...form, projectId: Number(id) })
      setShowForm(false)
      setForm({ title: '', description: '', priority: 'MEDIUM' })
      fetchData()
    } catch {
      setError('Failed to create task.')
    }
  }

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await projectApi.patch(`/api/tasks/${taskId}/status`, { status })
      fetchData()
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Delete this task?')) return
    try {
      await projectApi.delete(`/api/tasks/${taskId}`)
      fetchData()
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!project) return <div>Project not found.</div>

  const columns = ['TODO', 'IN_PROGRESS', 'DONE']

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h2 style={styles.heading}>{project.name}</h2>
          <p style={styles.desc}>{project.description}</p>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.badge}>{project.status}</span>
          <span style={{
            ...styles.badge,
            backgroundColor: project.priority === 'HIGH' ? '#ffebe6' : '#f4f5f7',
            color: project.priority === 'HIGH' ? '#de350b' : '#6b778c',
          }}>{project.priority}</span>
          <button style={styles.createBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>New Task</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleCreateTask} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Task title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              style={styles.textarea}
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
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
            <button style={styles.createBtn} type="submit">Create Task</button>
          </form>
        </div>
      )}

      {/* Kanban board */}
      <div style={styles.board}>
        {columns.map(col => (
          <div key={col} style={styles.column}>
            <div style={styles.columnHeader}>
              <span style={{ ...styles.colBadge, ...statusColors[col] }}>
                {col.replace('_', ' ')}
              </span>
              <span style={styles.colCount}>
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            <div style={styles.taskList}>
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} style={styles.taskCard}>
                  <div style={styles.taskTop}>
                    <span style={styles.taskTitle}>{task.title}</span>
                    {isAdmin && (
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteTask(task.id)}
                      >✕</button>
                    )}
                  </div>
                  {task.description && (
                    <p style={styles.taskDesc}>{task.description}</p>
                  )}
                  <div style={styles.taskBottom}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: task.priority === 'HIGH' ? '#ffebe6' : '#f4f5f7',
                      color: task.priority === 'HIGH' ? '#de350b' : '#6b778c',
                    }}>{task.priority}</span>
                    <select
                      style={styles.statusSelect}
                      value={task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === col).length === 0 && (
                <div style={styles.emptyCol}>No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  heading: { fontSize: '22px', fontWeight: 600, color: '#172b4d', margin: '0 0 4px' },
  desc: { fontSize: '14px', color: '#6b778c', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  createBtn: {
    backgroundColor: '#0052cc', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '4px', fontSize: '14px',
    fontWeight: 600, cursor: 'pointer',
  },
  badge: {
    fontSize: '11px', padding: '2px 8px', borderRadius: '12px',
    fontWeight: 500, backgroundColor: '#f4f5f7', color: '#6b778c',
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
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  column: { background: '#f4f5f7', borderRadius: '8px', padding: '16px' },
  columnHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  colBadge: { fontSize: '12px', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 },
  colCount: { fontSize: '12px', color: '#6b778c', fontWeight: 600 },
  taskList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  taskCard: {
    background: '#fff', padding: '12px', borderRadius: '6px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  taskTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' },
  taskTitle: { fontSize: '14px', fontWeight: 500, color: '#172b4d', flex: 1 },
  taskDesc: { fontSize: '12px', color: '#6b778c', margin: '0 0 8px' },
  taskBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  deleteBtn: {
    background: 'none', border: 'none', color: '#de350b',
    cursor: 'pointer', fontSize: '12px', padding: '0 0 0 8px',
  },
  statusSelect: {
    fontSize: '11px', border: '1px solid #dfe1e6',
    borderRadius: '4px', padding: '2px 4px', cursor: 'pointer',
  },
  emptyCol: { textAlign: 'center', color: '#6b778c', fontSize: '13px', padding: '16px 0' },
}

export default ProjectDetailPage