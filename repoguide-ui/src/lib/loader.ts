/**
 * loader.ts — JSON loading and schema validation for onboarding packages.
 *
 * This module is the single point to adapt if your teammate changes the schema.
 * All type definitions and validation logic live here; UI components only import
 * the types and the parse/load functions.
 */

// ─── Type definitions ────────────────────────────────────────────────────────

export interface Project {
  name: string;
  version: string;
  author: string;
  summary: string;
}

export interface TechStackEntry {
  concern: string;
  technology: string;
}

export interface LayoutEntry {
  path: string;
  type: string;
  description: string;
}

export interface Module {
  name: string;
  title: string;
  responsibilities: string[];
  runCommand: string;
}

export interface DataFlow {
  name: string;
  steps: string[];
}

export interface ApiEndpoint {
  method: string;
  path: string;
  auth: string;
  description: string;
}

export interface DependencyWiring {
  dependency: string;
  definedIn: string;
  injectedInto: string;
  provides: string;
}

export interface DbColumn {
  name: string;
  type: string;
  constraints: string;
}

export interface DatabaseModel {
  table: string;
  columns: DbColumn[];
  warning: string;
}

export interface KnownGap {
  area: string;
  gap: string;
}

export interface OnboardingPackage {
  project: Project;
  techStack: TechStackEntry[];
  repositoryLayout: LayoutEntry[];
  modules: Module[];
  dataFlows: DataFlow[];
  apiEndpoints: ApiEndpoint[];
  dependencyWiring: DependencyWiring[];
  notes: string[];
  databaseModel: DatabaseModel;
  localSetupChecklist: string[];
  howToAddNewModule: string[];
  knownGaps: KnownGap[];
}

// ─── Validation ──────────────────────────────────────────────────────────────

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function requireString(obj: Record<string, unknown>, field: string, ctx: string): string | null {
  const v = obj[field];
  if (typeof v !== 'string' || v.trim() === '') return `${ctx}.${field} must be a non-empty string`;
  return null;
}

function requireArray(obj: Record<string, unknown>, field: string, ctx: string): string | null {
  const v = obj[field];
  if (!Array.isArray(v)) return `${ctx}.${field} must be an array`;
  return null;
}

function requireObject(obj: Record<string, unknown>, field: string, ctx: string): string | null {
  const v = obj[field];
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return `${ctx}.${field} must be an object`;
  return null;
}

function collect(errors: (string | null)[]): string[] {
  return errors.filter((e): e is string => e !== null);
}

export function validate(raw: unknown): ValidationResult {
  const errors: string[] = [];

  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['Root value must be a JSON object.'] };
  }
  const pkg = raw as Record<string, unknown>;

  // project
  errors.push(...collect([requireObject(pkg, 'project', 'root')]));
  if (typeof pkg.project === 'object' && pkg.project !== null) {
    const p = pkg.project as Record<string, unknown>;
    errors.push(...collect([
      requireString(p, 'name',    'project'),
      requireString(p, 'version', 'project'),
      requireString(p, 'author',  'project'),
      requireString(p, 'summary', 'project'),
    ]));
  }

  // arrays of objects
  const arrayFields: [string, string[]][] = [
    ['techStack',         ['concern', 'technology']],
    ['repositoryLayout',  ['path', 'type', 'description']],
    ['modules',           ['name', 'title', 'responsibilities', 'runCommand']],
    ['dataFlows',         ['name', 'steps']],
    ['apiEndpoints',      ['method', 'path', 'auth', 'description']],
    ['dependencyWiring',  ['dependency', 'definedIn', 'injectedInto', 'provides']],
    ['knownGaps',         ['area', 'gap']],
  ];

  for (const [field, requiredKeys] of arrayFields) {
    const err = requireArray(pkg, field, 'root');
    if (err) { errors.push(err); continue; }
    const arr = pkg[field] as unknown[];
    arr.forEach((item, i) => {
      if (item === null || typeof item !== 'object' || Array.isArray(item)) {
        errors.push(`${field}[${i}] must be an object`);
        return;
      }
      const obj = item as Record<string, unknown>;
      for (const key of requiredKeys) {
        if (obj[key] === undefined || obj[key] === null) {
          errors.push(`${field}[${i}].${key} is required`);
        }
      }
    });
  }

  // plain string arrays
  for (const field of ['notes', 'localSetupChecklist', 'howToAddNewModule']) {
    const err = requireArray(pkg, field, 'root');
    if (err) { errors.push(err); continue; }
    const arr = pkg[field] as unknown[];
    arr.forEach((item, i) => {
      if (typeof item !== 'string') errors.push(`${field}[${i}] must be a string`);
    });
  }

  // databaseModel
  errors.push(...collect([requireObject(pkg, 'databaseModel', 'root')]));
  if (typeof pkg.databaseModel === 'object' && pkg.databaseModel !== null) {
    const dm = pkg.databaseModel as Record<string, unknown>;
    errors.push(...collect([
      requireString(dm, 'table',   'databaseModel'),
      requireString(dm, 'warning', 'databaseModel'),
      requireArray(dm,  'columns', 'databaseModel'),
    ]));
    if (Array.isArray(dm.columns)) {
      (dm.columns as unknown[]).forEach((col, i) => {
        if (col === null || typeof col !== 'object' || Array.isArray(col)) {
          errors.push(`databaseModel.columns[${i}] must be an object`); return;
        }
        const c = col as Record<string, unknown>;
        for (const k of ['name', 'type', 'constraints']) {
          if (!c[k]) errors.push(`databaseModel.columns[${i}].${k} is required`);
        }
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

// ─── File loader (browser FileReader) ────────────────────────────────────────

export function loadFromFile(file: File): Promise<{ data: OnboardingPackage; errors: string[] }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target!.result as string);
        const result = validate(raw);
        if (!result.ok) {
          resolve({ data: raw as OnboardingPackage, errors: result.errors });
        } else {
          resolve({ data: raw as OnboardingPackage, errors: [] });
        }
      } catch {
        resolve({ data: {} as OnboardingPackage, errors: ['File is not valid JSON.'] });
      }
    };
    reader.onerror = () => resolve({ data: {} as OnboardingPackage, errors: ['Failed to read file.'] });
    reader.readAsText(file);
  });
}

// ─── Fetch loader (for public/ assets) ───────────────────────────────────────

export async function loadFromUrl(url: string): Promise<{ data: OnboardingPackage; errors: string[] }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const raw = await res.json();
  const result = validate(raw);
  return { data: raw as OnboardingPackage, errors: result.errors };
}
