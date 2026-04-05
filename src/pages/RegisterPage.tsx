import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authApi from '../api/authApi'

const RegisterPage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address.')
      } else {
        setEmailError(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(form.email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await authApi.post('/api/auth/register', form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Registration failed. Username or email may already exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>TaskForge</h2>
        <p style={styles.subtitle}>Create your account</p>

        {success && (
          <div style={styles.success}>
            Registration successful! Redirecting to login...
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <input
              style={{
                ...styles.input,
                borderColor: emailError ? '#de350b' : '#dfe1e6',
              }}
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {emailError && <span style={styles.fieldError}>{emailError}</span>}
          </div>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            style={{
              ...styles.button,
              opacity: loading || !!emailError ? 0.7 : 1,
              cursor: loading || !!emailError ? 'not-allowed' : 'pointer',
            }}
            type="submit"
            disabled={loading || !!emailError}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f5f7',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '24px',
    fontWeight: 700,
    color: '#0052cc',
  },
  subtitle: {
    margin: '0 0 24px',
    color: '#6b778c',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #dfe1e6',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '10px',
    backgroundColor: '#0052cc',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
  },
  error: {
    backgroundColor: '#ffebe6',
    color: '#de350b',
    padding: '10px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  success: {
    backgroundColor: '#e3fcef',
    color: '#006644',
    padding: '10px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  fieldError: {
    color: '#de350b',
    fontSize: '12px',
    marginTop: '2px',
  },
  link: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6b778c',
    marginTop: '16px',
  },
}

export default RegisterPage