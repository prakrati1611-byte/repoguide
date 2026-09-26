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

export default function OverviewSection({ pkg, search }: Props) {
  const { project, techStack } = pkg;
  const filteredStack = search
    ? techStack.filter(
        t =>
          t.concern.toLowerCase().includes(search.toLowerCase()) ||
          t.technology.toLowerCase().includes(search.toLowerCase())
      )
    : techStack;

  return (
    <>
      {/* Project Hero */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">📋</span>
          <h2 className="section-title">Project Overview</h2>
        </div>
        <div className="project-hero">
          <div className="project-name">{hl(project.name, search)}</div>
          <div className="project-meta">
            <span>v{project.version}</span>
            <span>by {project.author}</span>
          </div>
          <p className="project-summary">{hl(project.summary, search)}</p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="section">
        <div className="section-header">
          <span className="section-icon">⚙️</span>
          <h2 className="section-title">Technology Stack</h2>
        </div>
        {filteredStack.length === 0 ? (
          <p className="empty-state">No tech stack entries match "{search}".</p>
        ) : (
          <div className="grid-3">
            {filteredStack.map((t, i) => (
              <div className="tech-item" key={i}>
                <span className="tech-concern">{hl(t.concern, search)}</span>
                <span className="tech-technology">{hl(t.technology, search)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
