import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../api/client.js";
import Message from "../../components/Message.jsx";
import Loading from "../../components/Loading.jsx";

export default function ExamResultsPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/exams/${id}/results`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return <Message error={error} />;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>
            Résultats — {data.exam?.title ?? "Examen"}
          </h2>

          <p className="muted">
            Résultats des étudiants ayant passé cet examen.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat">
          <strong>{data.attempt_count}</strong>
          <span>Tentatives</span>
        </div>

        <div className="card stat">
          <strong>
            {data.average === null
              ? "—"
              : Number(data.average).toFixed(2)}
          </strong>
          <span>Moyenne</span>
        </div>

        <div className="card stat">
          <strong>{data.total_points}</strong>
          <span>Barème</span>
        </div>
      </div>

      <div className="card table-wrap">
  <table
    style={{
      width: "100%",
      tableLayout: "fixed",
    }}
  >
    <colgroup>
      <col style={{ width: "35%" }} />
      <col style={{ width: "25%" }} />
      <col style={{ width: "40%" }} />
    </colgroup>

    <thead>
      <tr>
        <th style={{ textAlign: "left" }}>
          Étudiant
        </th>

        <th style={{ textAlign: "center" }}>
          Note
        </th>

        <th style={{ textAlign: "center" }}>
          Soumis le
        </th>
      </tr>
    </thead>

    <tbody>
      {data.results.map((result) => (
        <tr key={result.student_id}>
          <td style={{ textAlign: "left" }}>
            {result.name}
          </td>

          <td style={{ textAlign: "center" }}>
            <b>
              {result.score} / {data.total_points}
            </b>
          </td>

          <td style={{ textAlign: "center" }}>
            {new Date(
              result.submitted_at
            ).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {data.results.length === 0 && (
    <p
      className="muted"
      style={{ textAlign: "center" }}
    >
      Aucune tentative pour cet examen.
    </p>
  )}
</div>
    </>
  );
}