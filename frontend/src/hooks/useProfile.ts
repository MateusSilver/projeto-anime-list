/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/user";

export function useProfile() {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
        setEditName(data.name);
        setEditImage(data.profileImageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          profileImageUrl: editImage,
          newPassword: editPassword,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
        setEditPassword("");

        sessionStorage.removeItem("meusAnimesCache");

        fetchProfile();
      } else {
        setMessage({ type: "danger", text: "Erro de conexão com o servidor." });
      }
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Ocorreu um erro ao atualizar o perfil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    userProfile,
    isLoading,
    editName,
    setEditName,
    editImage,
    setEditImage,
    editPassword,
    setEditPassword,
    isSaving,
    message,
    handleUpdateProfile,
  };
}
