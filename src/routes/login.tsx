import { LoginPage } from "@/features/auth/components/login-page";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      throw redirect({
        to: "/dashboard",
        replace: true,
      });
    }
  },
});
