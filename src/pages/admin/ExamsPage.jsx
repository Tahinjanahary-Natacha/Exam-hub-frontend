import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/client.js";
import Message from "../../components/Message.jsx";

const empty = {
  courseId: "",
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
};
const toLocalInput = (value) =>
  value
    ? new Date(
        new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16)
    : "";

export default function ExamsPage() {
  const [exams, setExams] = useState([]),
    [courses, setCourses] = useState([]),
    [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  async function load() {
    const [e, c] = await Promise.all([
      apiFetch("/exams"),
      apiFetch("/courses"),
    ]);
    setExams(e);
    setCourses(c);
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...form,
        courseId: Number(form.courseId),
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      };
      await apiFetch(editingId ? `/exams/${editingId}` : "/exams", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setSuccess(editingId ? "Examen modifié." : "Examen créé.");
      setEditingId(null);
      setForm(empty);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer cet examen ?")) return;
    try {
      await apiFetch(`/exams/${id}`, { method: "DELETE" });
      setSuccess("Examen supprimé.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Examens</h2>
          <p className="muted">
            Chaque examen appartient à un cours et possède une fenêtre de
            disponibilité.
          </p>
        </div>
      </div>
      <Message error={error} success={success} />
      <form className="card form-grid" onSubmit={submit}>
        <h3>{editingId ? "Modifier" : "Créer"} un examen</h3>
        <label>
          Cours
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            required
          >
            <option value="">Choisir…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Titre
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label>
          Début
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            required
          />
        </label>
        <label>
          Fin
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            required
          />
        </label>
        <label className="span-2">
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="actions">
          <button className="primary">Enregistrer</button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cours</th>
              <th>Examen</th>
              <th>Fenêtre</th>
              <th>Questions</th>
              <th>Tentatives</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.course_code}</td>
                <td>
                  <b>{exam.title}</b>
                  {exam.locked && (
                    <span className="status off">Verrouillé</span>
                  )}
                </td>
                <td>
                  {new Date(exam.starts_at).toLocaleString()}
                  <br />→ {new Date(exam.ends_at).toLocaleString()}
                </td>
                <td>{exam.question_count}</td>
                <td>{exam.attempt_count}</td>
                <td className="actions">
                  <Link
                    className="button-link"
                    to={`/admin/exams/${exam.id}/questions`}
                  >
                    Questions
                  </Link>
                  <Link
                    className="button-link"
                    to={`/admin/exams/${exam.id}/results`}
                  >
                    Résultats
                  </Link>
                  <button
                    onClick={() => {
                      setEditingId(exam.id);
                      setForm({
                        courseId: exam.course_id,
                        title: exam.title,
                        description: exam.description,
                        startsAt: toLocalInput(exam.starts_at),
                        endsAt: toLocalInput(exam.ends_at),
                      });
                    }}
                  >
                    Modifier
                  </button>
                  {exam.attempt_count > 0 ? (
                    <button className="danger" disabled>
                      Non supprimable
                    </button>
                  ) : (
                    <button className="danger" onClick={() => remove(exam.id)}>
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
