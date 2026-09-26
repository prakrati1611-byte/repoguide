import { useState } from 'react';
import type { OnboardingPackage } from '../lib/loader';

interface Props {
  pkg: OnboardingPackage;
  search: string;
}

function hl(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function SetupSection({ pkg, search }: Props) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  const filteredChecklist = search
    ? pkg.localSetupChecklist.filter(s =>
        s.toLowerCase().includes(search.toLowerCase())
      )
    : pkg.localSetupChecklist;

  const filteredSteps = search
    ? pkg.howToAddNewModule.filter(s =>
        s.toLowerCase().includes(search.toLowerCase())
      )
    : pkg.howToAddNewModule;

  const done = Object.values(checked).filter(Boolean).length;
  const total = pkg.localSetupChecklist.length;

  return (
    <>
      {/* Local Setup Checklist */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">✅</span>
          <h2 className="section-title">Local Setup Checklist</h2>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: done === total ? 'var(--success)' : 'var(--muted)',
              fontWeight: 600,
            }}
          >
            {done}/{total} done
          </span>
        </div>
        {filteredChecklist.length === 0 ? (
          <p className="empty-state">No checklist items match "{search}".</p>
        ) : (
          <div className="checklist">
            {pkg.localSetupChecklist.map((item, i) => {
              if (
                search &&
                !item.toLowerCase().includes(search.toLowerCase())
              )
                return null;
              return (
                <div
                  key={i}
                  className={`checklist-item${checked[i] ? ' done' : ''}`}
                  onClick={() => toggle(i)}
                >
                  <input
                    type="checkbox"
                    checked={!!checked[i]}
                    onChange={() => toggle(i)}
                    onClick={e => e.stopPropagation()}
                    id={`chk-${i}`}
                  />
                  <label htmlFor={`chk-${i}`}>{hl(item, search)}</label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How to Add a New Module */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">➕</span>
          <h2 className="section-title">How to Add a New Module</h2>
        </div>
        {filteredSteps.length === 0 ? (
          <p className="empty-state">No steps match "{search}".</p>
        ) : (
          <div className="steps-list">
            {pkg.howToAddNewModule.map((step, i) => {
              if (search && !step.toLowerCase().includes(search.toLowerCase()))
                return null;
              return (
                <div key={i} className="steps-item">
                  <span className="step-n">{i + 1}.</span>
                  <span className="step-s">{hl(step, search)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
