import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import PasswordLock from "@/components/question-management/PasswordLock";
import QuestionForm from "@/components/question-management/QuestionForm";
import QuestionList from "@/components/question-management/QuestionList";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

const QuestionManagement = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const savedQuestions = localStorage.getItem("quiz-questions");
    const savedTimer = localStorage.getItem("quiz-timer");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedTimer) {
      setTimer(Number(savedTimer));
    }
  }, []);

  const handleAddQuestion = (questionData: {
    question: string;
    answers: string[];
    correctAnswer: number;
  }) => {
    const question: Question = {
      id: Date.now(),
      ...questionData,
    };

    const updatedQuestions = [...questions, question];
    setQuestions(updatedQuestions);
    localStorage.setItem("quiz-questions", JSON.stringify(updatedQuestions));
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem("quiz-questions", JSON.stringify(updatedQuestions));
  };

  const handleTimerChange = (time: number) => {
    setTimer(time);
    localStorage.setItem("quiz-timer", time.toString());
  };

  if (isLocked) {
    return <PasswordLock onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="p-6 space-y-6 backdrop-blur-lg bg-white/90 shadow-lg">
        <QuestionForm
          onAddQuestion={handleAddQuestion}
          onTimerChange={handleTimerChange}
          timer={timer}
        />
      </Card>

      <QuestionList
        questions={questions}
        onDeleteQuestion={handleDeleteQuestion}
      />
    </div>
  );
};

export default QuestionManagement;