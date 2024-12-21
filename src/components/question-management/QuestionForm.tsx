import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface QuestionFormProps {
  onAddQuestion: (question: {
    question: string;
    answers: string[];
    correctAnswer: number;
  }) => void;
  onTimerChange: (time: number) => void;
  timer: number;
}

const QuestionForm = ({ onAddQuestion, onTimerChange, timer }: QuestionFormProps) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newQuestion.trim() || answers.some((a) => !a.trim())) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    onAddQuestion({
      question: newQuestion,
      answers,
      correctAnswer,
    });

    setNewQuestion("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswer(0);

    toast({
      title: "Question Added",
      description: "The question has been added successfully",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter your question"
            className="hover:border-blue-400 transition-colors"
          />
        </div>

        <div className="space-y-4">
          <RadioGroup value={correctAnswer.toString()} onValueChange={(value) => setCorrectAnswer(Number(value))}>
            {answers.map((answer, index) => (
              <div key={index} className="flex items-center space-x-4">
                <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                <div className="flex-1">
                  <Input
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder={`Enter answer ${index + 1}`}
                    className="hover:border-blue-400 transition-colors"
                  />
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timer">Timer (seconds)</Label>
          <Input
            id="timer"
            type="number"
            value={timer}
            onChange={(e) => onTimerChange(Number(e.target.value))}
            min="10"
            max="3600"
            className="hover:border-blue-400 transition-colors"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full hover:shadow-md transition-all duration-300"
        >
          Add Question
        </Button>
      </div>
    </motion.div>
  );
};

export default QuestionForm;