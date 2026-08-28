import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';
import Loading from '../../components/Loading.jsx';

export default function StudentDashboard() {
  const [exams, setExams] = useState(null), [error, setError] = useState('');
  useEffect(() => { apiFetch('/my/exams').then(setExams).catch(e => setError(e.message)); }, []);
  if (error) return <Message error={error} />; if (!exams) return <Loading />;
  return <><div className="page-header"><div><h2>Examens disponibles</h2><p className="muted">Seuls les examens actuellement ouverts et non encore soumis sont affichés.</p></div></div>
    {exams.length === 0 ? <div className="card empty-state"><h3>Aucun examen disponible</h3><p className="muted">Revenez pendant la fenêtre de disponibilité.</p></div> : <div className="card-grid">{exams.map(exam => <article className="card" key={exam.id}><span className="badge">{exam.course_code}</span><h3>{exam.title}</h3><p>{exam.description}</p><p className="muted">{exam.question_count} question(s) · {exam.max_score} point(s)</p><p className="muted">Ferme le {new Date(exam.ends_at).toLocaleString()}</p><Link className="button-link primary" to={`/student/exams/${exam.id}`}>Passer l’examen</Link></article>)}</div>}
  </>;
}
