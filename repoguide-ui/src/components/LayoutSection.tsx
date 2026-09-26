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

function matches(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export default function LayoutSection({ pkg, search }: Props) {
  const filteredLayout = search
    ? pkg.repositoryLayout.filter(
        l =>
          matches(l.path, search) ||
          matches(l.type, search) ||
          matches(l.description, search)
      )
    : pkg.repositoryLayout;

  const filteredModules = search
    ? pkg.modules.filter(
        m =>
          matches(m.name, search) ||
          matches(m.title, search) ||
          matches(m.runCommand, search) ||
          m.responsibilities.some(r => matches(r, search))
      )
    : pkg.modules;

  return (
    <>
      {/* Repository Layout */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">📁</span>
          <h2 className="section-title">Repository Layout</h2>
        </div>
        {filteredLayout.length === 0 ? (
          <p className="empty-state">No layout entries match "{search}".</p>
        ) : (
          <table className="layout-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLayout.map((entry, i) => (
                <tr key={i}>
                  <td>
                    <span className="code-path">{hl(entry.path, search)}</span>
                  </td>
                  <td>
                    <span className={`badge-type badge-${entry.type}`}>
                      {hl(entry.type, search)}
                    </span>
                  </td>
                  <td>{hl(entry.description, search)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Module Responsibilities */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">🧩</span>
          <h2 className="section-title">Module Responsibilities</h2>
        </div>
        {filteredModules.length === 0 ? (
          <p className="empty-state">No modules match "{search}".</p>
        ) : (
          <div className="grid-2">
            {filteredModules.map((mod, i) => (
              <div className="card" key={i}>
                <div className="card-title">{hl(mod.title, search)}</div>
                <div className="card-meta">
                  <code style={{ fontSize: 11 }}>{hl(mod.name, search)}</code>
                </div>
                <ul className="resp-list">
                  {mod.responsibilities.map((r, j) => (
                    <li className="resp-item" key={j}>
                      <span className="resp-dot" />
                      {hl(r, search)}
                    </li>
                  ))}
                </ul>
                {mod.runCommand && (
                  <div className="run-cmd">$ {hl(mod.runCommand, search)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
