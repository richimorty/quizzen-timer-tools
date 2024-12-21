import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

interface QuestionListProps {
  questions: Question[];
  onDeleteQuestion: (id: number) => void;
}

const QuestionList = ({ questions, onDeleteQuestion }: QuestionListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Existing Questions</h3>
      <AnimatePresence>
        {questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 backdrop-blur-lg bg-white/90 hover:shadow-lg transition-all duration-300">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">
                    {index + 1}. {q.question}
                  </h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteQuestion(q.id)}
                    className="hover:shadow-md transition-shadow"
                  >
                    Delete
                  </Button>
                </div>
                <div className="pl-4 space-y-1">
                  {q.answers.map((answer, i) => (
                    <p
                      key={i}
                      className={`${
                        i === q.correctAnswer ? "text-green-600 font-medium" : ""
                      } transition-colors duration-200`}
                    >
                      {i + 1}. {answer}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default QuestionList;