import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../api/client.js";
import Message from "../../components/Message.jsx";
import Loading from "../../components/Loading.jsx";

export default function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/my/exams/${id}`)
      .then(setExam)
      .catch((err) => setError(err.message));
  }, [id]);

  async function submit(event) {
    event.preventDefault();

    const unanswered =
      exam.questions.length - Object.keys(answers).length;

    const confirmation =
      unanswered > 0
        ? `Vous avez laissé ${unanswered} question(s) sans réponse. Elles vaudront 0 point. Soumettre quand même ?`
        : "Soumettre définitivement cet examen ? Vous ne pourrez plus modifier vos réponses.";

    if (!window.confirm(confirmation)) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        answers: Object.entries(answers).map(
          ([questionId, choiceId]) => ({
            question_id: Number(questionId),
            choice_id: Number(choiceId),
          })
        ),
      };

      const result = await apiFetch(
  `/my/exams/${id}/submit`,
  {
    method: "POST",
    body: JSON.stringify(payload),
  }
);
const choiceTextById = new Map();

exam.questions.forEach((question) => {
  question.choices.forEach((choice) => {
    choiceTextById.set(
      Number(choice.id),
      choice.text
    );
  });
});

const enrichedResult = {
  ...result,

  correction: result.correction.map((item) => ({
    ...item,

    student_choice_text:
      item.student_choice_id === null
        ? null
        : choiceTextById.get(
            Number(item.student_choice_id)
          ) ?? "Réponse inconnue",

    correct_choice_text:
      choiceTextById.get(
        Number(item.correct_choice_id)
      ) ?? "Réponse inconnue",
  })),
};

navigate(`/student/exams/${id}/result`, {
  replace: true,
  state: {
    result: enrichedResult,
  },
});
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (error && !exam) {
    return <Message error={error} />;
  }

  if (!exam) {
    return <Loading />;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <span className="badge">
            {exam.course?.code}
          </span>

          <h2>{exam.title}</h2>

          {exam.description && (
            <p>{exam.description}</p>
          )}

          <p className="muted">
            Disponible jusqu’au{" "}
            {new Date(exam.ends_at).toLocaleString()}
          </p>
        </div>
      </div>

      <Message error={error} />

      <form onSubmit={submit}>
        <div className="stack">
          {exam.questions.map((question, index) => (
            <section
              className="card exam-question"
              key={question.id}
            >
              <div className="exam-question-header">
                <div>
                  <span className="question-number">
                    Question {index + 1}
                  </span>

                  <h3>{question.statement}</h3>
                </div>

                <span className="question-points">
                  {question.points} pt
                </span>
              </div>

              <div className="exam-options">
                {question.choices.map((choice) => {
                  const selected =
                    Number(answers[question.id]) ===
                    Number(choice.id);

                  return (
                    <label
                      className={`exam-option ${
                        selected ? "selected" : ""
                      }`}
                      key={choice.id}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={selected}
                        onChange={() =>
                          setAnswers({
                            ...answers,
                            [question.id]: choice.id,
                          })
                        }
                      />

                      <span>{choice.text}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="submit-bar">
          <span>
            <strong>{Object.keys(answers).length}</strong>
            {" / "}
            {exam.questions.length} répondues
          </span>

          <button
            className="primary"
            disabled={submitting}
          >
            {submitting
              ? "Soumission…"
              : "Soumettre définitivement"}
          </button>
        </div>
      </form>
    </>
  );
}