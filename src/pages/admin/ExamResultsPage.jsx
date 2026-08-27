import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';
import Loading from '../../components/Loading.jsx';

export default function ExamResultsPage() {
  const { id } = useParams(); const [data, setData] = useState(null), [error, setError] = useState('');
  useEffect(() => { apiFetch(`/exams/${id}/results`).then(setData).catch(e => setError(e.message)); }, [id]);
  if (error) return <Message error={error} />; if (!data) return <Loading />;
  return <><div className="page-header"><div><h2>Résultats — {data.title}</h2><p className="muted">Cours {data.course_code}</p></div></div>
    <div className="stats-grid"><div className="card stat"><strong>{data.attempt_count}</strong><span>Tentatives</span></div><div className="card stat"><strong>{Number(data.average_score).toFixed(2)}</strong><span>Moyenne</span></div><div className="card stat"><strong>{data.max_score}</strong><span>Barème</span></div></div>
    <div className="card table-wrap"><table><thead><tr><th>Étudiant</th><th>Email</th><th>Note</th><th>Tentatives</th><th>Soumis le</th></tr></thead><tbody>{data.students.map(r => <tr key={r.attempt_id}><td>{r.student_name}</td><td>{r.email}</td><td><b>{r.score} / {r.max_score}</b></td><td>{r.attempt_count}</td><td>{new Date(r.submitted_at).toLocaleString()}</td></tr>)}</tbody></table>{data.students.length === 0 && <p className="muted">Aucune tentative.</p>}</div>
  </>;
}
