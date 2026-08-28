import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';
import Loading from '../../components/Loading.jsx';

export default function TakeExamPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const [exam, setExam] = useState(null), [answers, setAnswers] = useState({}), [error, setError] = useState(''), [submitting, setSubmitting] = useState(false);
  useEffect(() => { apiFetch(`/my/exams/${id}`).then(setExam).catch(e => setError(e.message)); }, [id]);

  async function submit(event) {
    event.preventDefault();
    const unanswered = exam.questions.length - Object.keys(answers).length;
    const text = unanswered > 0
      ? `Vous avez laissé ${unanswered} question(s) sans réponse. Elles vaudront 0 point. Soumettre quand même ?`
      : 'Soumettre définitivement cet examen ? Vous ne pourrez plus le modifier.';
    if (!window.confirm(text)) return;
    setSubmitting(true); setError('');
    try {
      const payload = { answers: Object.entries(answers).map(([questionId, choiceId]) => ({ questionId: Number(questionId), choiceId: Number(choiceId) })) };
      const result = await apiFetch(`/my/exams/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) });
      navigate(`/student/exams/${id}/result`, { replace: true, state: { result } });
    } catch (err) { setError(err.message); setSubmitting(false); }
  }

  if (error && !exam) return <Message error={error} />; if (!exam) return <Loading />;
  return <><div className="page-header"><div><span className="badge">{exam.course_code}</span><h2>{exam.title}</h2><p>{exam.description}</p><p className="muted">Disponible jusqu’au {new Date(exam.ends_at).toLocaleString()}</p></div></div>
    <Message error={error} />
    <form onSubmit={submit}><div className="stack">{exam.questions.map((q, index) => <fieldset className="card question" key={q.id}><legend>{index + 1}. {q.statement} <span>{q.points} pt</span></legend>{q.choices.map(choice => <label className="option" key={choice.id}><input type="radio" name={`q-${q.id}`} checked={Number(answers[q.id]) === Number(choice.id)} onChange={() => setAnswers({ ...answers, [q.id]: choice.id })}/><span>{choice.label}</span></label>)}</fieldset>)}</div>
      <div className="submit-bar"><span>{Object.keys(answers).length} / {exam.questions.length} répondues</span><button className="primary" disabled={submitting}>{submitting ? 'Soumission…' : 'Soumettre définitivement'}</button></div>
    </form>
  </>;
}
