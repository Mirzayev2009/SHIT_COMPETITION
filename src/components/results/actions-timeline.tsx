import { CalendarDays, ClipboardList, Files, Link2, MessageCircleQuestion } from "lucide-react";
import type { CareMapAnalysis, Language } from "@/lib/schema";
import { ui } from "@/lib/translations";

type ActionsTimelineProps = {
  actions: CareMapAnalysis["actions"];
  language: Language;
  checked: Set<string>;
  onToggle: (id: string) => void;
  onInspect: (quote: string) => void;
  document: string;
};

export function ActionsTimeline({ actions, language, checked, onToggle, onInspect, document }: ActionsTimelineProps) {
  const t = ui[language];
  const categories = {
    appointment: { label: t.categoryAppointment, icon: CalendarDays },
    preparation: { label: t.categoryPreparation, icon: ClipboardList },
    administrative: { label: t.categoryAdministrative, icon: Files },
    other: { label: t.categoryOther, icon: ClipboardList },
  };

  return (
    <section className="care-panel care-actions" aria-labelledby="care-actions-heading">
      <div className="care-section-heading">
        <div><h2 id="care-actions-heading">{t.actionsTitle}</h2><p>{t.actionsDescription}</p></div>
        <span className="care-item-count" aria-hidden="true">{actions.length}</span>
      </div>
      {actions.length === 0 ? <p className="care-empty">{t.noActions}</p> : (
        <ol className="care-timeline">
          {actions.map((action) => {
            const category = categories[action.category];
            const Icon = category.icon;
            const isChecked = checked.has(action.id);
            return (
              <li className={`care-step${isChecked ? " is-tracked" : ""}`} key={action.id}>
                <span className="care-step-marker" aria-hidden="true"><Icon size={18} strokeWidth={1.75} /></span>
                <div className="care-step-body">
                  <div className="care-step-category">{category.label}</div>
                  <div className="care-step-title-row">
                    <h3>{action.title}</h3>
                    <label className="care-check-control"><input type="checkbox" className="care-check" aria-label={`${t.actionTracked}: ${action.title}`} checked={isChecked} onChange={() => onToggle(action.id)} /></label>
                  </div>
                  <p>{action.description}</p>
                  <div className="care-step-footer">
                    {action.when && <span className="care-date"><CalendarDays size={14} aria-hidden="true" />{action.when}</span>}
                    {action.needsConfirmation && <span className="care-confirm"><MessageCircleQuestion size={14} aria-hidden="true" />{t.needsConfirmation}</span>}
                    <button type="button" className="care-source-link" disabled={!action.sourceQuote || !document.includes(action.sourceQuote)} onClick={() => onInspect(action.sourceQuote)}><Link2 size={14} aria-hidden="true" />{t.viewOriginal}</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <p className="care-checklist-note"><ClipboardList size={14} aria-hidden="true" />{t.checklistNote}</p>
    </section>
  );
}
