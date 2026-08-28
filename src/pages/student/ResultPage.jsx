import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import Message from '../../components/Message.jsx';
import Loading from '../../components/Loading.jsx';

export default function ResultPage() {
  const { id } = useParams(); const location = useLocation();
  const [result, setResult] = useState(location.state?.result ?? null), [error, setError] = useState('');
  useEffect(() => {
    if (!result) apiFetch(`/my/results?examId=${id}`).then(setResult).catch(e => setError(e.message));
  }, [id, result]);
  if (error) return <Message error={error} />; if (!result) return <Loading />;
  return <><div className="page-header"><div><h2>Résultat</h2><p className="muted">Correction complète de votre soumission.</p></div><div className="score-box"><strong>{result.score} / {result.maxScore ?? result.max_score}</strong><span>{result.percentage}%</span></div></div>
    <div className="stack">{result.corrections.map((c, index) => <article className={`card correction ${c.isCorrect ? 'correct' : 'wrong'}`} key={c.questionId}><div className="question-title"><b>{index + 1}. {c.statement}</b><span>{c.earnedPoints} / {c.points} pt</span></div><div className="correction-choices">{c.choices.map(choice => {
      const selected = Number(c.selectedChoiceId) === Number(choice.id); const correct = Number(c.correctChoiceId) === Number(choice.id);
      return <div key={choice.id} className={`correction-choice ${correct ? 'good-choice' : ''} ${selected && !correct ? 'bad-choice' : ''}`}><span>{choice.label}</span><span>{correct ? '✓ Bonne réponse' : selected ? '✗ Votre choix' : ''}</span></div>;
    })}</div>{c.selectedChoiceId == null && <p className="muted">Aucune réponse sélectionnée — 0 point.</p>}</article>)}</div>
    <div className="actions"><Link className="button-link primary" to="/student/results">Voir mon historique</Link><Link className="button-link" to="/student">Retour aux examens</Link></div>
  </>;
}
