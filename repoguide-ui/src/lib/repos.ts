/**
 * repos.ts — Registry of preset demo repositories for the RepoGuide demo.
 *
 * This is the single file to edit when:
 *   - Adding a new preset repository
 *   - Adding a Bob-generated onboarding result for a pending repo
 *   - Changing GitHub links or descriptions
 *
 * How to add a prepared guide:
 *   1. Place the Bob-generated JSON in public/ (e.g. public/onboarding-<id>.json)
 *   2. Set jsonPath to '/onboarding-<id>.json'
 *   3. Change status from 'pending' to 'ready'
 */

export type RepoStatus = 'ready' | 'pending';

export interface PresetRepo {
  /** Unique slug used as a key */
  id: string;
  /** Display name shown in the selector */
  name: string;
  /** Owner/repo path on GitHub */
  githubPath: string;
  /** Full GitHub URL */
  githubUrl: string;
  /** One-line description for the selector card */
  description: string;
  /** Primary language tag */
  language: string;
  /** 'ready' = prepared Bob output exists; 'pending' = guide not yet generated */
  status: RepoStatus;
  /**
   * Path (relative to public/) to the prepared Bob onboarding JSON.
   * Required when status === 'ready'. Leave empty string when pending.
   */
  jsonPath: string;
  /** Emoji / icon shown on the selector card */
  icon: string;
}

export const PRESET_REPOS: PresetRepo[] = [
  {
    id: 'fastapi-starter',
    name: 'Modular-FastAPI-starter-backend',
    githubPath: 'ngusadeep/Modular-FastAPI-starter-backend',
    githubUrl: 'https://github.com/ngusadeep/Modular-FastAPI-starter-backend',
    description: 'A modular FastAPI + SQLAlchemy starter with JWT auth and a user-management module — our primary Bob test repository.',
    language: 'Python',
    status: 'ready',
    jsonPath: '/onboarding-package.json',
    icon: '🐍',
  },
  {
    id: 'express-api-starter',
    name: 'express-api-starter',
    githubPath: 'HideInHere/express-api-starter',
    githubUrl: 'https://github.com/HideInHere/express-api-starter',
    description: 'A JWT + RBAC middleware template for Express.js — used to test Bob against a second language/stack.',
    language: 'JavaScript',
    status: 'ready',
    jsonPath: '/onboarding-expressjs.json',
    icon: '⚡',
  },
  {
    id: 'realworld-react',
    name: 'gothinkster/react-redux-realworld-example-app',
    githubPath: 'gothinkster/react-redux-realworld-example-app',
    githubUrl: 'https://github.com/gothinkster/react-redux-realworld-example-app',
    description: 'RealWorld front-end example — React + Redux SPA. Not yet analyzed by Bob; a candidate for future coverage.',
    language: 'JavaScript',
    status: 'pending',
    jsonPath: '',
    icon: '⚛️',
  },
];
