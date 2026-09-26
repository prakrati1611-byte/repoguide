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

export default function DatabaseSection({ pkg, search }: Props) {
  const { databaseModel } = pkg;
  const q = search.toLowerCase();

  const filteredCols = search
    ? databaseModel.columns.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.constraints.toLowerCase().includes(q)
      )
    : databaseModel.columns;

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-icon">🗄️</span>
        <h2 className="section-title">Database Model</h2>
      </div>

      {/* Table name */}
      <div style={{ marginBottom: 12, fontSize: 14 }}>
        Table: <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>
          {hl(databaseModel.table, search)}
        </code>
      </div>

      {/* Warning */}
      {databaseModel.warning && (
        <div className="warning-box">
          <span>⚠️</span>
          <span>{hl(databaseModel.warning, search)}</span>
        </div>
      )}

      {/* Columns */}
      {filteredCols.length === 0 ? (
        <p className="empty-state">No columns match "{search}".</p>
      ) : (
        <table className="db-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Type</th>
              <th>Constraints</th>
            </tr>
          </thead>
          <tbody>
            {filteredCols.map((col, i) => (
              <tr key={i}>
                <td className="col-name">{hl(col.name, search)}</td>
                <td className="col-type">{hl(col.type, search)}</td>
                <td className="col-constraints">{hl(col.constraints, search)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
