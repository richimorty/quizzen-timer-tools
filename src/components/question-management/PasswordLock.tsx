import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface PasswordLockProps {
  onUnlock: () => void;
}

const PasswordLock = ({ onUnlock }: PasswordLockProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleUnlock = () => {
    if (password === "1234") {
      onUnlock();
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

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md p-6 space-y-4 backdrop-blur-lg bg-white/90 shadow-lg">
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
            <Button 
              className="w-full hover:shadow-md transition-shadow"
              onClick={handleUnlock}
            >
              Unlock
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PasswordLock;