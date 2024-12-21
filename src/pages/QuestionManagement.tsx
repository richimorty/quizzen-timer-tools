import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

const QuestionManagement = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [timer, setTimer] = useState(60);
  const { toast } = useToast();

  const handleUnlock = () => {
    if (password === "1234") {
      setIsLocked(false);
      setPassword("");
      toast({
        title: "Access Granted",
        description: "You can now manage questions",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || answers.some(a => !a.trim())) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const question: Question = {
      id: Date.now(),
      question: newQuestion,
      answers: [...answers],
      correctAnswer,
    };

    setQuestions([...questions, question]);
    setNewQuestion("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswer(0);

    toast({
      title: "Question Added",
      description: "The question has been added successfully",
    });

    // Save to localStorage
    localStorage.setItem("quiz-questions", JSON.stringify([...questions, question]));
    localStorage.setItem("quiz-timer", timer.toString());
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem("quiz-questions", JSON.stringify(updatedQuestions));
    
    toast({
      title: "Question Deleted",
      description: "The question has been removed",
    });
  };

  if (isLocked) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-6 space-y-4 backdrop-blur-lg bg-white/90">
          <div className="flex flex-col items-center space-y-4">
            <Lock className="w-12 h-12 text-gray-400" />
            <h2 className="text-2xl font-semibold text-center">Question Management</h2>
            <p className="text-gray-500 text-center">Enter password to access</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              />
            </div>
            <Button className="w-full" onClick={handleUnlock}>
              Unlock
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="p-6 space-y-6 backdrop-blur-lg bg-white/90">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Add New Question</h2>
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your question"
            />
          </div>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`answer-${index}`}>
                  Answer {index + 1}
                  {index === correctAnswer && " (Correct)"}
                </Label>
                <Input
                  id={`answer-${index}`}
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  placeholder={`Enter answer ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="correct-answer">Correct Answer</Label>
            <select
              id="correct-answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              {answers.map((_, index) => (
                <option key={index} value={index}>
                  Answer {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timer">Timer (seconds)</Label>
            <Input
              id="timer"
              type="number"
              value={timer}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTimer(value);
                localStorage.setItem("quiz-timer", value.toString());
              }}
              min="10"
              max="3600"
            />
          </div>
          <Button onClick={handleAddQuestion} className="w-full">
            Add Question
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Existing Questions</h3>
        {questions.map((q, index) => (
          <Card key={q.id} className="p-4 backdrop-blur-lg bg-white/90">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">
                  {index + 1}. {q.question}
                </h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  Delete
                </Button>
              </div>
              <div className="pl-4 space-y-1">
                {q.answers.map((answer, i) => (
                  <p key={i} className={i === q.correctAnswer ? "text-green-600 font-medium" : ""}>
                    {i + 1}. {answer}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionManagement;