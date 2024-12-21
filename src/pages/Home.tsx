import { BookOpen, Timer, Award, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Question Management",
      description: "Create and manage your quiz questions with ease",
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Custom Timer",
      description: "Set custom time limits for your quizzes",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Results Tracking",
      description: "Track and analyze quiz performance",
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "User Management",
      description: "Manage participants and their scores",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to QuizMaster
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create, manage, and track quizzes with our intuitive platform
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 backdrop-blur-lg bg-white/90">
              <div className="flex items-start space-x-4">
                <div className="text-blue-600">{feature.icon}</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;