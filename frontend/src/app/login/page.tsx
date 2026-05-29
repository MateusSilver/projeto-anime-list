"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errormessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      if (!email || !password) {
        setErrorMessage("Insira email e senha");
        return;
      }
      console.log("Email:", email);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // remover depois
    } catch (error) {
      setErrorMessage("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return <p>Hello World</p>;
}
