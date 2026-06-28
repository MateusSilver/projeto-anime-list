"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import ProfileEditSidebar from "@/components/ProfileEditSidebar";
import ProfileStats from "@/components/ProfileStats";
import ProfileFavorites from "@/components/ProfileFavorites";
import BackButton from "@/components/BackButton";

export default function ProfilePage() {
  const {
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
  } = useProfile();

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5 text-body-secondary">
        <Loader2 size={48} className="icon-spin text-primary mb-3" />
        <h5 className="fw-semibold">Carregando perfil...</h5>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container py-5 text-center mt-5">
        <h4 className="text-danger fw-bold mb-3">
          Não foi possível carregar os dados do perfil.
        </h4>
        <Link
          href="/"
          className="btn btn-primary d-inline-flex align-items-center gap-2 rounded-pill px-4"
        >
          <ArrowLeft size={18} /> Voltar ao Acervo
        </Link>
      </div>
    );
  }

  return (
    <main className="container py-5 mt-5">
      <BackButton href="/" />
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h1 className="fw-bold m-0 text-primary">Meu Perfil</h1>
      </div>

      <div className="row g-4">
        {/* Lado Esquerdo */}
        <ProfileEditSidebar
          userProfile={userProfile}
          editName={editName}
          setEditName={setEditName}
          editImage={editImage}
          setEditImage={setEditImage}
          editPassword={editPassword}
          setEditPassword={setEditPassword}
          isSaving={isSaving}
          message={message}
          onUpdate={handleUpdateProfile}
        />

        {/* Lado Direito */}
        <div className="col-12 col-lg-8">
          <ProfileStats userProfile={userProfile} />
          <ProfileFavorites favoriteAnimes={userProfile.favoriteAnimes || []} />
        </div>
      </div>
    </main>
  );
}
