"use client";

import BaseButton from "@/components/common/base-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { users } from "@/constants";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "ahmad.ouazzani@habous.ma",
      password: "123456",
      rememberMe: false,
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoggingIn(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user = users.find(
        (u) => u.email === value.email && u.password === value.password,
      );

      if (user) {
        if (!user.isActive) {
          toast.error("هذا الحساب غير نشط. يرجى الاتصال بالمسؤول.");
          setIsLoggingIn(false);
          return;
        }

        localStorage.setItem("authToken", "mock-token-" + user.id);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }),
        );

        toast.success(`مرحباً بك مجدداً، ${user.name}!`);

        navigate({ to: "/dashboard" });
      } else {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }

      setIsLoggingIn(false);
    },
  });

  return (
    <Card className="w-full max-w-md border-base-200/50 shadow-2xl bg-white/80 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-start">
        <CardTitle className="text-2xl font-bold tracking-tight text-base-900 font-cairo">
          تسجيل الدخول
        </CardTitle>
        <CardDescription className="text-base-500 font-sans">
          أدخل بياناتك للوصول إلى لوحة التحكم
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-base-700"
                >
                  البريد الإلكتروني
                </Label>
                <div className="relative group">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-base-400 group-focus-within:text-primary-500 transition-colors" />
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="name@example.com"
                    className="ps-10 bg-base-50/50 border-base-200 focus:border-primary-500 transition-all"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium text-base-700"
                  >
                    كلمة المرور
                  </Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-base-400 group-focus-within:text-primary-500 transition-colors" />
                  <Input
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    className="ps-10 pe-10 bg-base-50/50 border-base-200 focus:border-primary-500 transition-all font-mono"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-base-400 hover:text-base-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <BaseButton
                type="submit"
                disabled={!canSubmit}
                isLoading={isSubmitting || isLoggingIn}
                loadingText="جاري التحقق..."
                className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-4  shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all"
              >
                تسجيل الدخول
              </BaseButton>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
}

function FieldError({ errors }: { errors: any[] }) {
  if (errors.length === 0) return null;

  const error = errors[0];
  const message = typeof error === "string" ? error : error?.message;

  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1"
    >
      <AlertCircle className="size-3.5" />
      <span>{message}</span>
    </motion.p>
  );
}
