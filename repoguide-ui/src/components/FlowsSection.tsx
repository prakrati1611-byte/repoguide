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

export default function FlowsSection({ pkg, search }: Props) {
  const filteredFlows = search
    ? pkg.dataFlows.filter(
        f =>
          matches(f.name, search) ||
          f.steps.some(s => matches(s, search))
      )
    : pkg.dataFlows;

  const filteredDeps = search
    ? pkg.dependencyWiring.filter(
        d =>
          matches(d.dependency, search) ||
          matches(d.definedIn, search) ||
          matches(d.injectedInto, search) ||
          matches(d.provides, search)
      )
    : pkg.dependencyWiring;

  return (
    <>
      {/* Data Flows */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">🔄</span>
          <h2 className="section-title">Data Flows</h2>
        </div>
        {filteredFlows.length === 0 ? (
          <p className="empty-state">No data flows match "{search}".</p>
        ) : (
          filteredFlows.map((flow, i) => (
            <div className="card" key={i}>
              <div className="card-title">{hl(flow.name, search)}</div>
              <ul className="flow-steps">
                {flow.steps.map((step, j) => (
                  <li className="flow-step" key={j}>
                    <span className="step-num">{j + 1}</span>
                    <span className="step-text">{hl(step, search)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Dependency Wiring */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">🔗</span>
          <h2 className="section-title">Dependency Wiring</h2>
        </div>
        {filteredDeps.length === 0 ? (
          <p className="empty-state">No dependency entries match "{search}".</p>
        ) : (
          <table className="dep-table">
            <thead>
              <tr>
                <th>Dependency</th>
                <th>Defined In</th>
                <th>Injected Into</th>
                <th>Provides</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeps.map((d, i) => (
                <tr key={i}>
                  <td className="dep-dep">{hl(d.dependency, search)}</td>
                  <td>
                    <span className="code-inline">{hl(d.definedIn, search)}</span>
                  </td>
                  <td>{hl(d.injectedInto, search)}</td>
                  <td style={{ color: 'var(--muted)' }}>{hl(d.provides, search)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
