import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOnlineExamStatus, submitOnlineExam } from "../services/onlineExamService";

const EXAM_DURATION_SECONDS = 30 * 60;

const QUESTIONS = [
  {
    id: "q1",
    text: "Which data structure follows FIFO order?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue"
  },
  {
    id: "q2",
    text: "Which keyword is used to declare a constant in JavaScript?",
    options: ["let", "const", "var", "static"],
    answer: "const"
  },
  {
    id: "q3",
    text: "Which protocol is primarily used for secure web browsing?",
    options: ["HTTP", "FTP", "SMTP", "HTTPS"],
    answer: "HTTPS"
  },
  {
    id: "q4",
    text: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "SELECT", "UPDATE", "DELETE"],
    answer: "SELECT"
  },
  {
    id: "q5",
    text: "Time complexity of binary search is:",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)"
  }
];

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const OnlineExam = () => {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitReason, setSubmitReason] = useState("");
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [examStatus, setExamStatus] = useState(null);
  const [apiError, setApiError] = useState("");

  const submittedRef = useRef(false);

  useEffect(() => {
    submittedRef.current = submitted;
  }, [submitted]);

  const totalQuestions = QUESTIONS.length;
  const attemptedCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await getMyOnlineExamStatus();
        setExamStatus(status);
      } catch (error) {
        setApiError(error.response?.data?.message || "Unable to load exam status.");
      } finally {
        setLoadingStatus(false);
      }
    };

    loadStatus();
  }, []);

  const handleSubmit = async (reason = "Submitted by student") => {
    if (submittedRef.current) {
      return;
    }

    let computedScore = 0;
    QUESTIONS.forEach((question) => {
      if (answers[question.id] === question.answer) {
        computedScore += 1;
      }
    });

    setScore(computedScore);
    setSubmitReason(reason);
    setSubmitted(true);

    const payload = {
      reason,
      score: computedScore,
      totalQuestions,
      attemptedCount: Object.values(answers).filter(Boolean).length,
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await submitOnlineExam(payload);
      setExamStatus(response.access);
      localStorage.setItem("onlineExamLastSubmission", JSON.stringify(payload));
    } catch (error) {
      setApiError(error.response?.data?.message || "Could not submit exam.");
    }
  };

  useEffect(() => {
    if (!started || submitted) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          handleSubmit("Auto submitted: Time is over.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [started, submitted, answers]);

  useEffect(() => {
    if (!started || submitted) {
      return undefined;
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        handleSubmit("Auto submitted: Tab/page changed.");
      }
    };

    const onWindowBlur = () => {
      handleSubmit("Auto submitted: Window lost focus.");
    };

    const onBeforeUnload = (event) => {
      handleSubmit("Auto submitted: Page refresh/close detected.");
      event.preventDefault();
      event.returnValue = "";
    };

    const onNavClick = (event) => {
      const clickable = event.target.closest("a[href]");
      if (clickable) {
        handleSubmit("Auto submitted: You changed page.");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onNavClick, true);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onNavClick, true);
    };
  }, [started, submitted, answers]);

  const startExam = () => {
    if (!examStatus?.canAttempt) {
      return;
    }
    setAnswers({});
    setScore(0);
    setSubmitReason("");
    setSubmitted(false);
    setTimeLeft(EXAM_DURATION_SECONDS);
    setStarted(true);
  };

  if (loadingStatus) {
    return (
      <div className="page online-exam-page">
        <h2>Online Exam</h2>
        <p>Loading exam status...</p>
      </div>
    );
  }

  if (apiError && !started) {
    return (
      <div className="page online-exam-page">
        <h2>Online Exam</h2>
        <p className="error">{apiError}</p>
      </div>
    );
  }

  if (!examStatus?.canAttempt && !started) {
    return (
      <div className="page online-exam-page">
        <h2>Online Exam</h2>
        <div className="exam-warning">
          <h3>Exam Locked</h3>
          <p>Your exam attempt is already used.</p>
          <p>Please contact admin to grant permission for re-attempt.</p>
          {examStatus?.lastSubmission?.submittedAt ? (
            <p className="muted">
              Last submitted on: {new Date(examStatus.lastSubmission.submittedAt).toLocaleString()}
            </p>
          ) : null}
          <p className="muted">Total Attempts: {examStatus?.totalAttempts || 0}</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="page online-exam-page">
        <h2>Online Exam</h2>
        <div className="exam-warning">
          <h3>Strict Instructions</h3>
          <ul>
            <li>Do not switch tab/window during exam.</li>
            <li>Do not refresh or close this page.</li>
            <li>If page focus is lost, exam will auto-submit immediately.</li>
            <li>Total duration: 30 minutes.</li>
          </ul>
          <button type="button" onClick={startExam}>Start Exam</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page online-exam-page">
      <div className="exam-head">
        <h2>Online Exam (Strict Mode)</h2>
        <div className="exam-timer">{formatTime(timeLeft)}</div>
      </div>

      {submitted ? (
        <div className="exam-result">
          <h3>Exam Submitted</h3>
          <p>{submitReason || "Submitted successfully."}</p>
          {apiError ? <p className="error">{apiError}</p> : null}
          <p>
            Score: <strong>{score}/{totalQuestions}</strong>
          </p>
          <p>
            Attempted: <strong>{attemptedCount}/{totalQuestions}</strong>
          </p>
          <Link to="/exams">Go to Exam Schedule</Link>
        </div>
      ) : (
        <>
          <p className="exam-note">
            Warning: If you change page, switch tab, or lose focus, exam will auto-submit.
          </p>
          <div className="exam-questions">
            {QUESTIONS.map((question, index) => (
              <div className="exam-question-card" key={question.id}>
                <h3>{index + 1}. {question.text}</h3>
                <div className="exam-options">
                  {question.options.map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="exam-actions">
            <button type="button" onClick={() => handleSubmit("Submitted by student.")}>
              Submit Exam
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OnlineExam;
