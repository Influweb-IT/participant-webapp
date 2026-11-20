import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

/**
 * Guards the texts of the pages the links in the messages open (linkresolvers.json).
 *
 *  1. `it` and `en` of this app expose the same key set.
 *  2. every unsubscribe page key the installed core library asks for has a text in both
 *     languages, from this app's file or from the default texts of the installed
 *     @influenzanet/participant-webapp-kit, which the app adds under its own files.
 */

const LOCALES = ['it', 'en'] as const;
type Locale = (typeof LOCALES)[number];

const packageDir = (name: string): string =>
  path.dirname(require.resolve(`${name}/package.json`));

const readJsonFile = (filePath: string): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Expected a JSON object in ${filePath}`);
  }
  return parsed as Record<string, unknown>;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const flattenKeys = (source: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(source).flatMap(([key, value]) =>
    isPlainObject(value) ? flattenKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );

const textOf = (source: Record<string, unknown>, dottedKey: string): unknown =>
  dottedKey
    .split('.')
    .reduce<unknown>((current, segment) => (isPlainObject(current) ? current[segment] : undefined), source);

const appTexts = (locale: Locale) =>
  readJsonFile(path.join(process.cwd(), 'public', 'assets', 'locales', locale, 'linkresolvers.json'));

// The kit's own copy of the namespace; an older kit without default texts has none.
const kitTexts = (locale: Locale): Record<string, unknown> => {
  const file = path.join(packageDir('@influenzanet/participant-webapp-kit'), 'dist', 'locales', locale, 'linkresolvers.json');
  return fs.existsSync(file) ? readJsonFile(file) : {};
};

/** The unsubscribe page keys in the built core library, where they are written out in full. */
const collectUnsubscribeKeys = (bundle: string): string[] => {
  const pattern = /["'](unsubscribe\.[A-Za-z0-9_.]+)["']/g;
  const keys = new Set<string>();
  let match = pattern.exec(bundle);
  while (match !== null) {
    keys.add(match[1]);
    match = pattern.exec(bundle);
  }
  return Array.from(keys).sort();
};

describe('linkresolvers.json locale files', () => {
  it('expose the same key set in every language', () => {
    expect(flattenKeys(appTexts('it')).sort()).toEqual(flattenKeys(appTexts('en')).sort());
  });
});

describe('unsubscribe page keys required by @influenzanet/case-web-app-core', () => {
  const bundle = fs.readFileSync(
    path.join(packageDir('@influenzanet/case-web-app-core'), 'build', 'index.js'),
    'utf8'
  );
  const referencedKeys = collectUnsubscribeKeys(bundle);

  it('finds the keys referenced by the core library bundle', () => {
    // Guards against a bundle format change silently emptying the check below.
    expect(referencedKeys).toContain('unsubscribe.weekly.title');
  });

  it('has a text for every referenced key in every language, from the app or the kit', () => {
    const missing = LOCALES.flatMap((locale) =>
      referencedKeys
        .filter((key) => {
          const text = textOf(appTexts(locale), key) ?? textOf(kitTexts(locale), key);
          return typeof text !== 'string' || text.length === 0;
        })
        .map((key) => `${locale}: ${key}`)
    );
    expect(missing).toEqual([]);
  });
});
