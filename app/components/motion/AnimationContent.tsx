"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedRobot } from "./AnimationRobot";
import { AnimatedContainer } from "./AnimationMotion";
import DescriptionSection from "../DescriptionSection";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "../forms/Login";
import RegisterForm from "../forms/Register";

export function AuthContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const isLoginRoute = pathname === "/login";
  const [isLogin, setIsLogin] = useState(isLoginRoute);

  useEffect(() => {
    setIsLogin(pathname === "/login");
  }, [pathname]);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    router.push("/register");
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    router.push("/login");
  };

  return (
    <div className="flex items-center h-full md:h-screen flex-col lg:flex-row justify-around py-10 px-4 gap-8">
      <AnimatedRobot />

      <AnimatedContainer>
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
                <LoginForm onSwitchToRegister={handleSwitchToRegister} />
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
                <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimatedContainer>
    </div>
  );
}
