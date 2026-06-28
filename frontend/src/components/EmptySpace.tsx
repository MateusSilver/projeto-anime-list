import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode; // Para passar um botão opcional (ex: "Fazer Resenha")
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-body-tertiary p-5 rounded-4 text-center border border-2 border-secondary-subtle border-dashed shadow-sm w-100 d-flex flex-column align-items-center justify-content-center gap-3">
      {icon && <div className="text-secondary opacity-50">{icon}</div>}
      <div>
        <h5 className="fw-bold text-body mb-1">{title}</h5>
        {description && (
          <p className="text-muted m-0 small fw-medium">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
