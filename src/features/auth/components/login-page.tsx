import { LoginForm } from "./login-form";
import { motion } from "motion/react";

export function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-[#2D4A48]">
      {/* Left pane - Image/Brand */}

      <div className="hidden login-background lg:flex lg:w-1/2 relative bg-primary-50/30 items-center justify-center ">
        {/* Background Decorative Elements */}

        <div className="absolute size-32 z-10 bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
          <img
            src="images/logo-login.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right pane - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative bg-white rounded-none lg:rounded-r-3xl ">
        {/* Mobile Logo */}
        <div className="lg:hidden flex flex-col items-center text-center space-y-3 mb-10 mt-8">
          <div className="size-20 p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-base-100">
            <img
              src="/images/logo-login.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-black text-base-900 tracking-tight font-cairo">
            مخطوطات الخزانات الوقفية
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center max-w-md"
        >
          <div className="w-full">
            <LoginForm />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="lg:absolute lg:bottom-8 mt-12 lg:mt-0 text-sm text-base-400 font-medium"
        >
          &copy; {new Date().getFullYear()} وزارة الأوقاف والشؤون الإسلامية
        </motion.div>
      </div>
    </div>
  );
}
