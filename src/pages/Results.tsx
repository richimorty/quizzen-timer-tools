import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Lock, Download, Trash2 } from "lucide-react";

interface QuizResult {
  username: string;
  quizName: string;
  score: number;
  total: number;
  timestamp: string;
}

const Results = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const savedResults = localStorage.getItem("quiz-results");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const handleUnlock = () => {
    if (password === "1234") {
      setIsLocked(false);
      setPassword("");
      toast({
        title: "Access Granted",
        description: "You can now view the results",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Username,Quiz,Score,Total,Timestamp\n" +
      results.map(r => 
        `${r.username},${r.quizName},${r.score},${r.total},${r.timestamp}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quiz-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Results have been exported to CSV",
    });
  };

  const handleClearResults = () => {
    if (selectedQuiz === "all") {
      localStorage.setItem("quiz-results", "[]");
      setResults([]);
    } else {
      const filteredResults = results.filter(r => r.quizName !== selectedQuiz);
      localStorage.setItem("quiz-results", JSON.stringify(filteredResults));
      setResults(filteredResults);
    }

    toast({
      title: "Results Cleared",
      description: selectedQuiz === "all" ? "All results have been cleared" : `Results for ${selectedQuiz} have been cleared`,
    });
  };

  const getUniqueQuizNames = () => {
    return Array.from(new Set(results.map(r => r.quizName)));
  };

  const filteredResults = selectedQuiz === "all" 
    ? results 
    : results.filter(r => r.quizName === selectedQuiz);

  if (isLocked) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-6 space-y-4 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90">
          <div className="flex flex-col items-center space-y-4">
            <Lock className="w-12 h-12 text-gray-400" />
            <h2 className="text-2xl font-semibold text-center dark:text-white">Quiz Results</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">Enter password to access</p>
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold dark:text-white">Quiz Results</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Quizzes</option>
            {getUniqueQuizNames().map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button onClick={handleExport} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleClearResults}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden backdrop-blur-lg bg-white/90 dark:bg-gray-800/90">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredResults.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {result.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.quizName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {((result.score / result.total) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(result.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Results;