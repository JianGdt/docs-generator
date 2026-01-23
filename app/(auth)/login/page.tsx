"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../../components/forms/Login";
import RegisterForm from "../../components/forms/Register";
import DescriptionSection from "@//components/DescriptionSection";
import { AnimatedFormContainer } from "@//components/motion/AnimationMotion";
import { AnimatedRobot } from "@//components/motion/AnimationRobot";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center flex-col lg:flex-row justify-around p-4 gap-8">
      <AnimatedRobot />

      <AnimatedFormContainer>
        <DescriptionSection />

        {registered && isLogin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4"
          >
            <p className="text-green-400 text-sm text-center">
              Account created successfully! Please sign in.
            </p>
          </motion.div>
        )}

        <div style={{ perspective: 1000 }}>
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimatedFormContainer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
