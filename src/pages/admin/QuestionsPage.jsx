import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../api/client.js";
import Message from "../../components/Message.jsx";

function blankQuestion() {
  return {
    statement: "",
    points: 1,
    choices: [
      { label: "", isCorrect: true },
      { label: "", isCorrect: false },
    ],
  };
}

export default function QuestionsPage() {
  const { id } = useParams();
  const [exam, setExam] = useState(null),
    [questions, setQuestions] = useState([]),
    [locked, setLocked] = useState(false);
  const [form, setForm] = useState(blankQuestion()),
    [editingId, setEditingId] = useState(null),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  async function load() {
    const [examData, data] = await Promise.all([
      apiFetch(`/exams/${id}`),
      apiFetch(`/exams/${id}/questions`),
    ]);
    setExam(examData);
    setQuestions(data.questions);
    setLocked(data.locked);
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [id]);

  function addChoice() {
    if (form.choices.length < 6)
      setForm({
        ...form,
        choices: [...form.choices, { label: "", isCorrect: false }],
      });
  }
  function removeChoice(index) {
    if (form.choices.length <= 2) return;
    const choices = form.choices.filter((_, i) => i !== index);
    if (!choices.some((c) => c.isCorrect)) choices[0].isCorrect = true;
    setForm({ ...form, choices });
  }
  function setCorrect(index) {
    setForm({
      ...form,
      choices: form.choices.map((c, i) => ({ ...c, isCorrect: i === index })),
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiFetch(
        editingId ? `/questions/${editingId}` : `/exams/${id}/questions`,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify({ ...form, points: Number(form.points) }),
        },
      );
      setSuccess(editingId ? "Question modifiée." : "Question ajoutée.");
      setEditingId(null);
      setForm(blankQuestion());
      await load();
    } catch (err) {
      setError(err.message);
    }
  }
  async function remove(questionId) {
    if (!window.confirm("Supprimer cette question ?")) return;
    try {
      await apiFetch(`/questions/${questionId}`, { method: "DELETE" });
      setSuccess("Question supprimée.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Questions — {exam?.title ?? "Examen"}</h2>
          <p className="muted">2 à 6 choix, exactement une bonne réponse.</p>
        </div>
      </div>
      {locked && (
        <div className="alert error">
          🔒 Cet examen possède au moins une tentative : questions et choix sont
          désormais non modifiables.
        </div>
      )}
      <Message error={error} success={success} />
      {!locked && (
        <form className="card" onSubmit={submit}>
          <h3>{editingId ? "Modifier la question" : "Ajouter une question"}</h3>
          <label>
            Énoncé
            <textarea
              value={form.statement}
              onChange={(e) => setForm({ ...form, statement: e.target.value })}
              required
            />
          </label>
          <label>
            Points
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: e.target.value })}
              required
            />
          </label>
          <div className="choice-editor">
            {form.choices.map((choice, index) => (
              <div className="choice-row" key={index}>
                <input
                  type="radio"
                  name="correct"
                  checked={choice.isCorrect}
                  onChange={() => setCorrect(index)}
                  title="Bonne réponse"
                />
                <input
                  value={choice.label}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      choices: form.choices.map((c, i) =>
                        i === index ? { ...c, label: e.target.value } : c,
                      ),
                    })
                  }
                  placeholder={`Choix ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeChoice(index)}
                  disabled={form.choices.length <= 2}
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
          <div className="actions">
            <button
              type="button"
              onClick={addChoice}
              disabled={form.choices.length >= 6}
            >
              + Ajouter un choix
            </button>
            <button className="primary">Enregistrer</button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(blankQuestion());
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      )}
      <div className="stack">
        {questions.map((q) => (
          <article className="card" key={q.id}>
            <div className="question-title">
              <b>
                {q.position}. {q.statement}
              </b>
              <span>{q.points} pt</span>
            </div>
            <ol>
              {q.choices.map((c) => (
                <li key={c.id} className={c.isCorrect ? "correct-text" : ""}>
                  {c.label} {c.isCorrect && "✓"}
                </li>
              ))}
            </ol>
            {!locked && (
              <div className="actions">
                <button
                  onClick={() => {
                    setEditingId(q.id);
                    setForm({
                      statement: q.statement,
                      points: q.points,
                      choices: q.choices.map((c) => ({
                        label: c.label,
                        isCorrect: c.isCorrect,
                      })),
                    });
                  }}
                >
                  Modifier
                </button>
                <button className="danger" onClick={() => remove(q.id)}>
                  Supprimer
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
