import { useState, useEffect } from 'react'
import { api } from '../api'

export function Items() {
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', owner_id: '' })
  const [submitting, setSubmitting] = useState(false)
  const [filterOwner, setFilterOwner] = useState('')

  useEffect(() => {
    let ignore = false
    setLoading(true)
    Promise.all([
      api.items.list(filterOwner ? { owner_id: filterOwner } : {}),
      api.users.list(),
    ])
      .then(([itemsData, usersData]) => {
        if (!ignore) {
          setItems(itemsData)
          setUsers(usersData)
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => { ignore = true }
  }, [filterOwner])

  const handleSubmit = (e) => {
    e.preventDefault()
    const ownerId = Number(form.owner_id)
    if (!ownerId) {
      setError('Оберіть власника')
      return
    }
    setSubmitting(true)
    setError(null)
    api.items.create({
      title: form.title,
      description: form.description || null,
      owner_id: ownerId,
    })
      .then((item) => {
        setItems((prev) => [...prev, item])
        setForm({ title: '', description: '', owner_id: '' })
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false))
  }

  const handleDelete = (id) => {
    if (!confirm('Видалити item?')) return
    api.items.delete(id)
      .then(() => setItems((prev) => prev.filter((i) => i.id !== id)))
      .catch((err) => setError(err.message))
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error && users.length === 0) return <div className="page"><p className="error">Error: {error}</p></div>

  return (
    <div className="page">
      <h1>Items</h1>
      <div className="filter">
        <label>Filter by owner:</label>
        <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)}>
          <option value="">All</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <select
          value={form.owner_id}
          onChange={(e) => setForm((f) => ({ ...f, owner_id: e.target.value }))}
          required
        >
          <option value="">Select owner</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? '...' : 'Add Item'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {items.map((i) => (
          <li key={i.id} className="list-item">
            <span><strong>{i.title}</strong> — {i.description || '-'} (owner: {i.owner_id})</span>
            <button onClick={() => handleDelete(i.id)} className="btn-small">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
