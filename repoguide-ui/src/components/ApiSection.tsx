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

function matches(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

const METHODS = ['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function ApiSection({ pkg, search }: Props) {
  const [methodFilter, setMethodFilter] = useState('ALL');

  const filtered = pkg.apiEndpoints.filter(ep => {
    const methodOk = methodFilter === 'ALL' || ep.method === methodFilter;
    const searchOk =
      !search ||
      matches(ep.method, search) ||
      matches(ep.path, search) ||
      matches(ep.auth, search) ||
      matches(ep.description, search);
    return methodOk && searchOk;
  });

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-icon">🌐</span>
        <h2 className="section-title">API Endpoints</h2>
      </div>

      {/* Method filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {METHODS.map(m => (
          <button
            key={m}
            onClick={() => setMethodFilter(m)}
            style={{
              padding: '3px 10px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: methodFilter === m ? 'var(--accent)' : 'var(--surface)',
              color: methodFilter === m ? '#fff' : 'var(--text)',
              fontSize: 12,
              fontWeight: methodFilter === m ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {m}
          </button>
        ))}
        <span style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center', marginLeft: 6 }}>
          {filtered.length} endpoint{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No endpoints match the current filters.</p>
      ) : (
        filtered.map((ep, i) => (
          <div
            key={i}
            className={`endpoint-row${search && (matches(ep.path, search) || matches(ep.description, search)) ? ' highlight' : ''}`}
          >
            <span className={`method-badge method-${ep.method}`}>{ep.method}</span>
            <span className="endpoint-path">{hl(ep.path, search)}</span>
            <span className="auth-tag">{hl(ep.auth, search)}</span>
            <span className="endpoint-desc">{hl(ep.description, search)}</span>
          </div>
        ))
      )}
    </div>
  );
}
