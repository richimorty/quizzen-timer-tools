import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Timer } from "lucide-react";

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

const TakeQuiz = () => {
  const [username, setUsername] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes");
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished]);

  const getCurrentQuiz = () => {
    return quizzes.find((quiz) => quiz.name === selectedQuiz);
  };

  const handleStart = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to start the quiz",
        variant: "destructive",
      });
      return;
    }
    if (!selectedQuiz) {
      toast({
        title: "Quiz Required",
        description: "Please select a quiz to start",
        variant: "destructive",
      });
      return;
    }
    const quiz = getCurrentQuiz();
    if (!quiz?.questions.length) {
      toast({
        title: "No Questions",
        description: "The selected quiz has no questions",
        variant: "destructive",
      });
      return;
    }
    setTimeLeft(quiz.timer);
    setIsStarted(true);
  };

  const handleAnswer = (answerIndex: number) => {
    const quiz = getCurrentQuiz();
    if (!quiz) return;

    setSelectedAnswer(answerIndex);
    if (answerIndex === quiz.questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        handleFinish();
      }
    }, 1000);
  };

  const handleFinish = () => {
    const quiz = getCurrentQuiz();
    if (!quiz) return;

    setIsFinished(true);
    const results = JSON.parse(localStorage.getItem("quiz-results") || "[]");
    results.push({
      username,
      quizName: selectedQuiz,
      score,
      total: quiz.questions.length,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("quiz-results", JSON.stringify(results));
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${quiz.questions.length}`,
    });
  };

  if (!isStarted) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-6 space-y-4 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center dark:text-white">Welcome to the Quiz</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Enter your username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quizSelect">Select Quiz</Label>
                <select
                  id="quizSelect"
                  value={selectedQuiz}
                  onChange={(e) => setSelectedQuiz(e.target.value)}
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
            </div>
            <Button onClick={handleStart} className="w-full">
              Start Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-6 space-y-4 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold dark:text-white">Quiz Completed!</h2>
            <p className="text-lg dark:text-gray-300">
              Your score: {score} out of {getCurrentQuiz()?.questions.length}
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Take Another Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const quiz = getCurrentQuiz();
  if (!quiz) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="p-6 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-lg font-medium dark:text-white">{timeLeft}s</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-medium dark:text-white">{quiz.questions[currentQuestion].question}</h3>
          <div className="space-y-3">
            {quiz.questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                  selectedAnswer === null
                    ? "hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                    : selectedAnswer === index
                    ? index === quiz.questions[currentQuestion].correctAnswer
                      ? "bg-green-100 dark:bg-green-900 border-green-500"
                      : "bg-red-100 dark:bg-red-900 border-red-500"
                    : index === quiz.questions[currentQuestion].correctAnswer
                    ? "bg-green-100 dark:bg-green-900 border-green-500"
                    : "bg-gray-50 dark:bg-gray-700"
                } border dark:border-gray-600 dark:text-white`}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TakeQuiz;