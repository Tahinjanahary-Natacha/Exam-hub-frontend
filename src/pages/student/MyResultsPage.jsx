import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../api/client.js";
import Message from "../../components/Message.jsx";
import Loading from "../../components/Loading.jsx";

export default function MyResultsPage() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/my/results")
      .then(setRows)
      .catch((err) => setError(err.message));
  }, []);

  const averagePercentage = useMemo(() => {
    if (!rows || rows.length === 0) {
      return 0;
    }

    const total = rows.reduce((sum, row) => {
      const score = Number(row.score ?? 0);
      const totalPoints = Number(row.total_points ?? 0);

      const percentage =
        totalPoints > 0
          ? (score / totalPoints) * 100
          : 0;

      return sum + percentage;
    }, 0);

    return Math.round(total / rows.length);
  }, [rows]);

  if (error) {
    return <Message error={error} />;
  }

  if (!rows) {
    return <Loading />;
  }

  return (
    <>
      <div className="page-header student-results-header">
        <div>
          <span className="results-eyebrow">
            ESPACE ÉTUDIANT
          </span>

          <h2>Mes résultats</h2>

          <p className="muted">
            Retrouvez l'historique de vos examens
            et vos performances.
          </p>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="student-result-stats">
          <div className="result-stat-card">
            <span className="result-stat-label">
              Examens passés
            </span>

            <strong>{rows.length}</strong>

            <span className="result-stat-caption">
              examen{rows.length > 1 ? "s" : ""} soumis
            </span>
          </div>

          <div className="result-stat-card">
            <span className="result-stat-label">
              Moyenne
            </span>

            <strong>{averagePercentage}%</strong>

            <span className="result-stat-caption">
              moyenne générale
            </span>
          </div>

          <div className="result-stat-card">
            <span className="result-stat-label">
              Dernier examen
            </span>

            <strong className="result-last-exam">
              {rows[0]?.title ?? "—"}
            </strong>

            <span className="result-stat-caption">
              plus récent
            </span>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="card student-empty-results">
          <div className="empty-results-icon">
            ✓
          </div>

          <h3>Aucun examen passé</h3>

          <p className="muted">
            Vos résultats apparaîtront ici après
            la soumission de votre premier examen.
          </p>
        </div>
      ) : (
        <div className="card student-results-card">
          <div className="results-card-heading">
            <div>
              <h3>Historique</h3>
              <p className="muted">
                {rows.length} résultat
                {rows.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="student-results-table">
              <thead>
                <tr>
                  <th>Cours</th>
                  <th>Examen</th>
                  <th>Note</th>
                  <th>Résultat</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const score = Number(row.score ?? 0);
                  const totalPoints = Number(
                    row.total_points ?? 0
                  );

                  const percentage =
                    totalPoints > 0
                      ? Math.round(
                          (score / totalPoints) * 100
                        )
                      : 0;

                  return (
                    <tr key={row.exam_id}>
                      <td>
                        <span className="course-pill">
                          {row.course_code}
                        </span>
                      </td>

                      <td>
                        <div className="result-exam-name">
                          {row.title}
                        </div>
                      </td>

                      <td>
                        <span className="score-pill">
                          {score}
                          <span>
                            {" "}
                            / {totalPoints}
                          </span>
                        </span>
                      </td>

                      <td>
                        <div className="result-progress-cell">
                          <div className="result-progress-info">
                            <strong>
                              {percentage}%
                            </strong>
                          </div>

                          <div className="result-progress-track">
                            <div
                              className="result-progress-bar"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="result-date">
                          {new Date(
                            row.submitted_at
                          ).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}