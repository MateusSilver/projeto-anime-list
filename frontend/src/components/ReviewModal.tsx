import { useState, useEffect } from "react";
import { MessageSquare, Save, Loader2 } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  animeTitle: string;
  onSave: (text: string) => Promise<void>;
}

export default function ReviewModal({
  isOpen,
  onClose,
  initialText,
  animeTitle,
  onSave,
}: ReviewModalProps) {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setText(initialText || "");
        setIsSaving(false);
      }, 0);
    }
  }, [isOpen, initialText]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSave(text);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
      className="modal fade show d-block"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-body border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-bottom border-secondary-subtle p-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <MessageSquare size={22} className="text-primary" />
              Escrever Resenha
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => !isSaving && onClose()}
              disabled={isSaving}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="alert bg-warning-subtle border border-warning-subtle text-warning-subtle small rounded-3 mb-4">
              Compartilhe a sua opinião! A sua resenha ficará visível no feed
              global para outros utilizadores que pesquisarem por{" "}
              <strong>{animeTitle}</strong>.
            </div>

            <textarea
              className="form-control bg-body-tertiary text-body border-secondary-subtle rounded-3"
              rows={8}
              placeholder="O que achou da história, dos personagens, da animação?..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSaving}
              style={{ resize: "none" }}
            ></textarea>
          </div>

          <div className="modal-footer border-top border-secondary-subtle p-3 bg-body-tertiary">
            <button
              type="button"
              className="btn btn-outline-secondary fw-semibold rounded-3 px-4"
              onClick={() => onClose()}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary bg-primary rounded-3 fw-semibold border-0 px-4 d-flex align-items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="icon-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Publicar Resenha
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
