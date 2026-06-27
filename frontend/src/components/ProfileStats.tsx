// src/components/ProfileStats.tsx
import { UserProfile } from "@/types/user";

export default function ProfileStats({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const formatNumber = (num?: number) =>
    num ? num.toLocaleString("pt-BR") : 0;

  return (
    <div className="border border-secondary-subtle rounded-4 overflow-hidden mb-4 bg-body shadow-sm">
      <table className="table m-0 border-0">
        <tbody>
          <tr>
            <td className="p-3 border-bottom border-secondary-subtle text-muted fw-medium">
              Total no Acervo
            </td>
            <td className="p-3 border-bottom border-secondary-subtle fw-bold text-end fs-5 text-primary">
              {formatNumber(userProfile.totalAnimes)}
            </td>
          </tr>
          <tr>
            <td className="p-3 border-bottom border-secondary-subtle text-muted fw-medium">
              Completos
            </td>
            <td className="p-3 border-bottom border-secondary-subtle fw-bold text-end">
              {formatNumber(userProfile.completed)}
            </td>
          </tr>
          <tr>
            <td className="p-3 border-bottom border-secondary-subtle text-muted fw-medium">
              Assistindo
            </td>
            <td className="p-3 border-bottom border-secondary-subtle fw-bold text-end">
              {formatNumber(userProfile.watching)}
            </td>
          </tr>
          <tr>
            <td className="p-3 border-bottom border-secondary-subtle text-muted fw-medium">
              Pausados
            </td>
            <td className="p-3 border-bottom border-secondary-subtle fw-bold text-end">
              {formatNumber(userProfile.onHold)}
            </td>
          </tr>
          <tr>
            <td className="p-3 border-bottom border-secondary-subtle text-muted fw-medium">
              Abandonados
            </td>
            <td className="p-3 border-bottom border-secondary-subtle fw-bold text-end">
              {formatNumber(userProfile.dropped)}
            </td>
          </tr>
          <tr>
            <td className="p-3 border-0 text-muted fw-medium">
              Episódios Assistidos
            </td>
            <td className="p-3 border-0 fw-bold text-end text-success">
              {formatNumber(userProfile.totalEpisodesWatched)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
