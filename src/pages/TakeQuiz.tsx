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

const TakeQuiz = () => {
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    const savedQuestions = localStorage.getItem("quiz-questions");
    const savedTimer = localStorage.getItem("quiz-timer");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedTimer) {
      setTimeLeft(Number(savedTimer));
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

  const handleStart = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to start the quiz",
        variant: "destructive",
      });
      return;
    }
    if (questions.length === 0) {
      toast({
        title: "No Questions",
        description: "There are no questions available",
        variant: "destructive",
      });
      return;
    }
    setIsStarted(true);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        handleFinish();
      }
    }, 1000);
  };

  const handleFinish = () => {
    setIsFinished(true);
    const results = JSON.parse(localStorage.getItem("quiz-results") || "[]");
    results.push({
      username,
      score,
      total: questions.length,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("quiz-results", JSON.stringify(results));
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${questions.length}`,
    });
  };

  if (!isStarted) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-6 space-y-4 backdrop-blur-lg bg-white/90">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Welcome to the Quiz</h2>
            <div className="space-y-2">
              <Label htmlFor="username">Enter your username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />
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
        <Card className="w-full max-w-md p-6 space-y-4 backdrop-blur-lg bg-white/90">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Quiz Completed!</h2>
            <p className="text-lg">
              Your score: {score} out of {questions.length}
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Take Another Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="p-6 backdrop-blur-lg bg-white/90">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-gray-500" />
            <span className="text-lg font-medium">{timeLeft}s</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-medium">{questions[currentQuestion].question}</h3>
          <div className="space-y-3">
            {questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                  selectedAnswer === null
                    ? "hover:bg-gray-100 bg-white"
                    : selectedAnswer === index
                    ? index === questions[currentQuestion].correctAnswer
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : index === questions[currentQuestion].correctAnswer
                    ? "bg-green-100 border-green-500"
                    : "bg-gray-50"
                } border`}
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