import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';

const empty = { code: '', name: '', description: '' };
export default function CoursesPage() {
  const [courses, setCourses] = useState([]), [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null), [error, setError] = useState(''), [success, setSuccess] = useState('');
  const load = () => apiFetch('/courses').then(setCourses);
  useEffect(() => { load().catch(e => setError(e.message)); }, []);
  async function submit(e) {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await apiFetch(editingId ? `/courses/${editingId}` : '/courses', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setSuccess(editingId ? 'Cours modifié.' : 'Cours créé.'); setEditingId(null); setForm(empty); await load();
    } catch (err) { setError(err.message); }
  }
  async function remove(id) {
    if (!window.confirm('Supprimer ce cours ?')) return;
    try { await apiFetch(`/courses/${id}`, { method: 'DELETE' }); setSuccess('Cours supprimé.'); await load(); } catch (err) { setError(err.message); }
  }
  return <>
    <div className="page-header"><div><h2>Cours</h2><p className="muted">Le code est unique.</p></div></div><Message error={error} success={success} />
    <form className="card form-grid" onSubmit={submit}><h3>{editingId ? 'Modifier' : 'Créer'} un cours</h3>
      <label>Code<input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required /></label>
      <label>Nom<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
      <label className="span-2">Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
      <div className="actions"><button className="primary">Enregistrer</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }}>Annuler</button>}</div>
    </form>
    <div className="card table-wrap"><table><thead><tr><th>Code</th><th>Nom</th><th>Description</th><th>Examens</th><th>Actions</th></tr></thead><tbody>{courses.map(c => <tr key={c.id}><td><b>{c.code}</b></td><td>{c.name}</td><td>{c.description}</td><td>{c.exam_count}</td><td className="actions"><button onClick={() => { setEditingId(c.id); setForm({ code: c.code, name: c.name, description: c.description }); }}>Modifier</button><button className="danger" onClick={() => remove(c.id)}>Supprimer</button></td></tr>)}</tbody></table></div>
  </>;
}
