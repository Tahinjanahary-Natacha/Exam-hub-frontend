import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, exams: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([apiFetch('/students'), apiFetch('/courses'), apiFetch('/exams')])
      .then(([students, courses, exams]) => setStats({ students: students.length, courses: courses.length, exams: exams.length }))
      .catch(err => setError(err.message));
  }, []);
  return <>
    <div className="page-header"><div><h2>Tableau de bord</h2><p className="muted">Vue rapide de la plateforme.</p></div></div>
    <Message error={error} />
    <div className="stats-grid">
      <div className="card stat"><strong>{stats.students}</strong><span>Étudiants</span></div>
      <div className="card stat"><strong>{stats.courses}</strong><span>Cours</span></div>
      <div className="card stat"><strong>{stats.exams}</strong><span>Examens</span></div>
    </div>
    <div className="card"><h3>Accès rapides</h3><div className="actions"><Link className="button-link" to="/admin/students">Gérer les étudiants</Link><Link className="button-link" to="/admin/exams">Gérer les examens</Link></div></div>
  </>;
}
