import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../api/client.js";
import Message from "../../components/Message.jsx";

function blankQuestion() {
  return {
    statement: "",
    points: 1,
    position: null,
    choices: [
      { text: "", is_correct: true },
      { text: "", is_correct: false },
    ],
  };
}

export default function QuestionsPage() {
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [locked, setLocked] = useState(false);

  const [form, setForm] = useState(blankQuestion());
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    const [examData, questionsData] = await Promise.all([
      apiFetch(`/exams/${id}`),
      apiFetch(`/exams/${id}/questions`),
    ]);

    setExam(examData);

    setQuestions(
      Array.isArray(questionsData)
        ? questionsData
        : []
    );

    setLocked(
      Number(examData.attempt_count) > 0
    );
  }

  useEffect(() => {
    load().catch((err) => {
      setError(err.message);
    });
  }, [id]);

  function addChoice() {
    if (form.choices.length >= 6) {
      return;
    }

    setForm({
      ...form,
      choices: [
        ...form.choices,
        {
          text: "",
          is_correct: false,
        },
      ],
    });
  }

  function removeChoice(index) {
    if (form.choices.length <= 2) {
      return;
    }

    const choices = form.choices.filter(
      (_, i) => i !== index
    );

    if (!choices.some((choice) => choice.is_correct)) {
      choices[0] = {
        ...choices[0],
        is_correct: true,
      };
    }

    setForm({
      ...form,
      choices,
    });
  }

  function setCorrect(index) {
    setForm({
      ...form,
      choices: form.choices.map(
        (choice, i) => ({
          ...choice,
          is_correct: i === index,
        })
      ),
    });
  }

  async function submit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const nextPosition =
        questions.length === 0
          ? 1
          : Math.max(
              ...questions.map(
                (question) =>
                  Number(question.position) || 0
              )
            ) + 1;

      const payload = {
        statement: form.statement,
        points: Number(form.points),
        position:
          editingId !== null
            ? form.position
            : nextPosition,
        choices: form.choices.map(
          (choice) => ({
            text: choice.text,
            is_correct: choice.is_correct,
          })
        ),
      };

      await apiFetch(
        editingId
          ? `/questions/${editingId}`
          : `/exams/${id}/questions`,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setSuccess(
        editingId
          ? "Question modifiée."
          : "Question ajoutée."
      );

      setEditingId(null);
      setForm(blankQuestion());

      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(questionId) {
    if (
      !window.confirm(
        "Supprimer cette question ?"
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiFetch(
        `/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

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
          <h2>
            Questions — {exam?.title ?? "Examen"}
          </h2>

          <p className="muted">
            2 à 6 choix, exactement une bonne
            réponse.
          </p>
        </div>
      </div>

      {locked && (
        <div className="alert error">
          🔒 Cet examen possède au moins une
          tentative : les questions et les choix
          sont désormais non modifiables.
        </div>
      )}

      <Message
        error={error}
        success={success}
      />

      {!locked && (
        <form
          className="card"
          onSubmit={submit}
        >
          <h3>
            {editingId
              ? "Modifier la question"
              : "Ajouter une question"}
          </h3>

          <label>
            Énoncé

            <textarea
              value={form.statement}
              onChange={(e) =>
                setForm({
                  ...form,
                  statement: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Points

            <input
              type="number"
              step="1"
              min="1"
              value={form.points}
              onChange={(e) =>
                setForm({
                  ...form,
                  points: e.target.value,
                })
              }
              required
            />
          </label>

          <div className="choice-editor">
            {form.choices.map(
              (choice, index) => (
                <div
                  className="choice-row"
                  key={index}
                >
                  <input
                    type="radio"
                    name="correct"
                    checked={
                      choice.is_correct
                    }
                    onChange={() =>
                      setCorrect(index)
                    }
                    title="Bonne réponse"
                  />

                  <input
                    value={choice.text}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        choices:
                          form.choices.map(
                            (current, i) =>
                              i === index
                                ? {
                                    ...current,
                                    text: e.target
                                      .value,
                                  }
                                : current
                          ),
                      })
                    }
                    placeholder={`Choix ${
                      index + 1
                    }`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeChoice(index)
                    }
                    disabled={
                      form.choices.length <= 2
                    }
                  >
                    Retirer
                  </button>
                </div>
              )
            )}
          </div>

          <div className="actions">
            <button
              type="button"
              onClick={addChoice}
              disabled={
                form.choices.length >= 6
              }
            >
              + Ajouter un choix
            </button>

            <button className="primary">
              Enregistrer
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(
                    blankQuestion()
                  );
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      )}

      <div className="stack">
        {questions.map((question) => (
          <article
            className="card"
            key={question.id}
          >
            <div className="question-title">
              <b>
                {question.position}.{" "}
                {question.statement}
              </b>

              <span>
                {question.points} pt
              </span>
            </div>

            <ol>
              {question.choices.map(
                (choice) => (
                  <li
                    key={choice.id}
                    className={
                      choice.is_correct
                        ? "correct-text"
                        : ""
                    }
                  >
                    {choice.text}{" "}
                    {choice.is_correct &&
                      "✓"}
                  </li>
                )
              )}
            </ol>

            {!locked && (
              <div className="actions">
                <button
                  onClick={() => {
                    setEditingId(
                      question.id
                    );

                    setForm({
                      statement:
                        question.statement,
                      points:
                        question.points,
                      position:
                        question.position,
                      choices:
                        question.choices.map(
                          (choice) => ({
                            text:
                              choice.text,
                            is_correct:
                              choice.is_correct,
                          })
                        ),
                    });
                  }}
                >
                  Modifier
                </button>

                <button
                  className="danger"
                  onClick={() =>
                    remove(question.id)
                  }
                >
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