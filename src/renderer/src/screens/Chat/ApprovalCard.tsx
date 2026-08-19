import { memo, useState } from "react";
import { useI18n } from "../../components/useI18n";
import type { ApprovalMessage } from "./types";

interface ApprovalCardProps {
  msg: ApprovalMessage;
  /** Mark the card resolved in parent state once the user chooses. */
  onResolved: (id: string, choice: string) => void;
}

/**
 * Inline card for a mid-run `approval.request`. Shows the command the agent
 * wants to run and offers the same choices the gateway platforms do: approve
 * once / approve this session / always allow / deny. On choice it forwards to
 * the main process via `respondApproval` and flips to a resolved, read-only
 * state. Never auto-approves — `approvals.mode: manual` must actually prompt.
 */
export const ApprovalCard = memo(function ApprovalCard({
  msg,
  onResolved,
}: ApprovalCardProps): React.JSX.Element {
  const { t } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const resolved = !!msg.resolved;

  const respond = async (choice: string, all: boolean): Promise<void> => {
    if (resolved || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const ok = await window.hermesAPI.respondApproval(
        msg.sessionId,
        choice,
        all,
      );
      if (ok === false) {
        setError(true);
        return;
      }
      onResolved(msg.id, choice);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (resolved) {
    const chosenLabel =
      msg.chosen === "deny"
        ? t("chat.approval.denied")
        : t("chat.approval.approved");
    return (
      <div className="chat-approval-card chat-approval-card--resolved">
        <div className="chat-approval-command">{msg.command}</div>
        <div className="chat-approval-answer">{chosenLabel}</div>
      </div>
    );
  }

  const hasChoice = (c: string): boolean => msg.choices.includes(c);

  return (
    <div className="chat-approval-card">
      <div className="chat-approval-label">
        {t("chat.approval.label")}
      </div>
      <div className="chat-approval-command">{msg.command}</div>

      <div className="chat-approval-actions">
        {hasChoice("once") && (
          <button
            className="chat-approval-btn chat-approval-once"
            disabled={submitting}
            onClick={() => void respond("once", false)}
          >
            {t("chat.approval.once")}
          </button>
        )}
        {hasChoice("session") && (
          <button
            className="chat-approval-btn chat-approval-session"
            disabled={submitting}
            onClick={() => void respond("session", false)}
          >
            {t("chat.approval.session")}
          </button>
        )}
        {msg.allowPermanent && hasChoice("always") && (
          <button
            className="chat-approval-btn chat-approval-always"
            disabled={submitting}
            onClick={() => void respond("always", true)}
          >
            {t("chat.approval.always")}
          </button>
        )}
        <button
          className="chat-approval-btn chat-approval-deny"
          disabled={submitting}
          onClick={() => void respond("deny", false)}
        >
          {t("chat.approval.deny")}
        </button>
      </div>

      {error && (
        <div className="chat-approval-error" role="alert">
          {t("chat.approval.error")}
        </div>
      )}
    </div>
  );
});
