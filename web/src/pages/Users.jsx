import { useState, useEffect } from 'react'
import { api } from '../api'

export function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ email: '', name: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    api.users.list()
      .then((data) => {
        if (!ignore) setUsers(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => { ignore = true }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    api.users.create(form)
      .then((user) => {
        setUsers((prev) => [...prev, user])
        setForm({ email: '', name: '' })
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false))
  }

  const handleDelete = (id) => {
    if (!confirm('Видалити користувача?')) return
    api.users.delete(id)
      .then(() => setUsers((prev) => prev.filter((u) => u.id !== id)))
      .catch((err) => setError(err.message))
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error) return <div className="page"><p className="error">Error: {error}</p></div>

  return (
    <div className="page">
      <h1>Users</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? '...' : 'Add User'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {users.map((u) => (
          <li key={u.id} className="list-item">
            <span>{u.name} — {u.email}</span>
            <button onClick={() => handleDelete(u.id)} className="btn-small">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
