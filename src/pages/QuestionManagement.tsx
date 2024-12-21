import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import PasswordLock from "@/components/question-management/PasswordLock";
import QuestionForm from "@/components/question-management/QuestionForm";
import QuestionList from "@/components/question-management/QuestionList";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

interface QuizData {
  name: string;
  questions: Question[];
  timer: number;
}

const QuestionManagement = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<string>("");
  const [newQuizName, setNewQuizName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes");
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
  }, []);

  const handleAddQuiz = () => {
    if (!newQuizName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz name",
        variant: "destructive",
      });
      return;
    }

    if (quizzes.some((quiz) => quiz.name === newQuizName)) {
      toast({
        title: "Error",
        description: "A quiz with this name already exists",
        variant: "destructive",
      });
      return;
    }

    const newQuiz: QuizData = {
      name: newQuizName,
      questions: [],
      timer: 60,
    };

    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    setCurrentQuiz(newQuizName);
    setNewQuizName("");
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));

    toast({
      title: "Success",
      description: "Quiz created successfully",
    });
  };

  const getCurrentQuizData = () => {
    return quizzes.find((quiz) => quiz.name === currentQuiz);
  };

  const handleAddQuestion = (questionData: {
    question: string;
    answers: string[];
    correctAnswer: number;
  }) => {
    const updatedQuizzes = quizzes.map((quiz) => {
      if (quiz.name === currentQuiz) {
        return {
          ...quiz,
          questions: [
            ...quiz.questions,
            { id: Date.now(), ...questionData },
          ],
        };
      }
      return quiz;
    });

    setQuizzes(updatedQuizzes);
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuizzes = quizzes.map((quiz) => {
      if (quiz.name === currentQuiz) {
        return {
          ...quiz,
          questions: quiz.questions.filter((q) => q.id !== id),
        };
      }
      return quiz;
    });

    setQuizzes(updatedQuizzes);
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
  };

  const handleTimerChange = (time: number) => {
    const updatedQuizzes = quizzes.map((quiz) => {
      if (quiz.name === currentQuiz) {
        return {
          ...quiz,
          timer: time,
        };
      }
      return quiz;
    });

    setQuizzes(updatedQuizzes);
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
  };

  if (isLocked) {
    return <PasswordLock onUnlock={() => setIsLocked(false)} />;
  }

  const currentQuizData = getCurrentQuizData();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="p-6 space-y-6 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-lg">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="newQuizName">New Quiz Name</Label>
              <Input
                id="newQuizName"
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
                placeholder="Enter quiz name"
              />
            </div>
            <Button
              onClick={handleAddQuiz}
              className="mt-6"
            >
              Create Quiz
            </Button>
          </div>

          {quizzes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="quizSelect">Select Quiz</Label>
              <select
                id="quizSelect"
                value={currentQuiz}
                onChange={(e) => setCurrentQuiz(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select a quiz</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.name} value={quiz.name}>
                    {quiz.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {currentQuizData && (
          <>
            <QuestionForm
              onAddQuestion={handleAddQuestion}
              onTimerChange={handleTimerChange}
              timer={currentQuizData.timer}
            />
            <QuestionList
              questions={currentQuizData.questions}
              onDeleteQuestion={handleDeleteQuestion}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default QuestionManagement;