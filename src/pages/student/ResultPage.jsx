import { Link, useLocation } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="card">
        <h2>Résultat indisponible</h2>

        <p className="muted">
          Le détail de la correction est disponible immédiatement
          après la soumission de l'examen.
        </p>

        <Link
          className="button-link"
          to="/student/results"
        >
          Voir mes résultats
        </Link>
      </div>
    );
  }

  const score = Number(result.score ?? 0);
  const totalPoints = Number(result.total_points ?? 0);

  const percentage =
    totalPoints > 0
      ? Math.round((score / totalPoints) * 100)
      : 0;

  const correction = Array.isArray(result.correction)
    ? result.correction
    : [];

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Résultat de l'examen</h2>

          <p className="muted">
            Votre note et la correction complète.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat">
          <strong>{score}</strong>
          <span>Points obtenus</span>
        </div>

        <div className="card stat">
          <strong>{totalPoints}</strong>
          <span>Barème</span>
        </div>

        <div className="card stat">
          <strong>{percentage}%</strong>
          <span>Résultat</span>
        </div>
      </div>

      <div className="stack">
        {correction.map((item, index) => (
          <article
            className={`card result-question ${
              item.is_correct ? "result-correct" : "result-wrong"
            }`}
            key={item.question_id}
          >
            <div className="result-question-header">
              <div>
                <span className="question-number">
                  Question {index + 1}
                </span>

                <h3>{item.statement}</h3>
              </div>

              <span
                className={
                  item.is_correct
                    ? "status success"
                    : "status off"
                }
              >
                {item.is_correct ? "Correct" : "Incorrect"}
              </span>
            </div>

            <div className="result-details">
              <p>
                <strong>Points :</strong>{" "}
                {item.is_correct ? item.points : 0} / {item.points}
              </p>

              <p>
  <strong>Votre réponse :</strong>{" "}
  {item.student_choice_id === null
    ? "Aucune réponse"
    : item.student_choice_text}
</p>

<p>
  <strong>Bonne réponse :</strong>{" "}
  {item.correct_choice_text}
</p>
            </div>
          </article>
        ))}
      </div>

      <div className="actions" style={{ marginTop: "24px" }}>
        <Link
          className="button-link"
          to="/student/results"
        >
          Voir mon historique
        </Link>

        <Link
          className="button-link"
          to="/student"
        >
          Retour aux examens
        </Link>
      </div>
    </>
  );
}