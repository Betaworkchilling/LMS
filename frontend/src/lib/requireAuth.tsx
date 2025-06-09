// src/lib/requireAuth.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRequireAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getIte("access");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
};
