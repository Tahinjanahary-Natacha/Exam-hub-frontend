import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';
import Loading from '../../components/Loading.jsx';

export default function MyResultsPage() {
  const [rows, setRows] = useState(null), [error, setError] = useState('');
  useEffect(() => { apiFetch('/my/results').then(setRows).catch(e => setError(e.message)); }, []);
  if (error) return <Message error={error} />; if (!rows) return <Loading />;
  return <><div className="page-header"><div><h2>Mes résultats</h2><p className="muted">Historique de tous les examens soumis.</p></div></div>
    <div className="card table-wrap"><table><thead><tr><th>Cours</th><th>Examen</th><th>Note</th><th>%</th><th>Date</th><th></th></tr></thead><tbody>{rows.map(r => <tr key={r.attempt_id}><td>{r.course_code}</td><td>{r.title}</td><td><b>{r.score} / {r.max_score}</b></td><td>{r.percentage}%</td><td>{new Date(r.submitted_at).toLocaleString()}</td><td><Link className="button-link" to={`/student/exams/${r.exam_id}/result`}>Correction</Link></td></tr>)}</tbody></table>{rows.length === 0 && <p className="muted">Aucun examen passé.</p>}</div>
  </>;
}
