import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';

const emptyForm = { name: '', email: '', password: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() { setStudents(await apiFetch('/students')); }
  useEffect(() => { load().catch(err => setError(err.message)); }, []);

  function edit(student) {
    setEditingId(student.id);
    setForm({ name: student.name, email: student.email, password: '' });
    setError(''); setSuccess('');
  }

  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess('');
    try {
      if (editingId) {
        await apiFetch(`/students/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
        setSuccess('Étudiant modifié.');
      } else {
        await apiFetch('/students', { method: 'POST', body: JSON.stringify(form) });
        setSuccess('Étudiant créé.');
      }
      setForm(emptyForm); setEditingId(null); await load();
    } catch (err) { setError(err.message); }
  }

  async function toggle(student) {
    setError(''); setSuccess('');
    try {
      if (student.is_active) {
        await apiFetch(`/students/${student.id}`, { method: 'DELETE' });
        setSuccess('Compte désactivé.');
      } else {
        await apiFetch(`/students/${student.id}`, { method: 'PUT', body: JSON.stringify({ name: student.name, email: student.email, is_active: true }) });
        setSuccess('Compte réactivé.');
      }
      await load();
    } catch (err) { setError(err.message); }
  }

  async function resetPassword(student) {
    const password = window.prompt(`Nouveau mot de passe pour ${student.name} (8 caractères minimum) :`);
    if (!password) return;
    try {
      await apiFetch(`/students/${student.id}`, { method: 'PUT', body: JSON.stringify({ name: student.name, email: student.email, password }) });
      setSuccess('Mot de passe réinitialisé.');
    } catch (err) { setError(err.message); }
  }

  return <>
    <div className="page-header"><div><h2>Étudiants</h2><p className="muted">Création, modification, réinitialisation et désactivation.</p></div></div>
    <Message error={error} success={success} />
    <form className="card form-grid" onSubmit={submit}>
      <h3>{editingId ? 'Modifier un étudiant' : 'Créer un étudiant'}</h3>
      <label>Nom<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
      <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
      <label>Mot de passe {editingId && <small>(laisser vide pour conserver)</small>}<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editingId} /></label>
      <div className="actions"><button className="primary">{editingId ? 'Enregistrer' : 'Créer'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Annuler</button>}</div>
    </form>
    <div className="card table-wrap"><table><thead><tr><th>Nom</th><th>Email</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
      {students.map(student => <tr key={student.id}><td>{student.name}</td><td>{student.email}</td><td><span className={`status ${student.is_active ? 'ok' : 'off'}`}>{student.is_active ? 'Actif' : 'Désactivé'}</span></td><td className="actions"><button onClick={() => edit(student)}>Modifier</button><button onClick={() => resetPassword(student)}>Réinitialiser MDP</button><button className={student.is_active ? 'danger' : ''} onClick={() => toggle(student)}>{student.is_active ? 'Désactiver' : 'Réactiver'}</button></td></tr>)}
    </tbody></table></div>
  </>;
}
