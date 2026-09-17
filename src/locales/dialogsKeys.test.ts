import fs from 'fs';
import path from 'path';

/**
 * Guards the dialogs translation files against the class of defect reported as
 * finding F-30: the change-phone dialog rendered the raw key
 * `changePhone.errors.wrongPhoneFormat` because the key was never added to the
 * locale files, while the core library already referenced it.
 *
 * Two checks:
 *  1. `it` and `en` dialogs.json expose exactly the same key set.
 *  2. every phone/WhatsApp dialog key the installed core library asks for is
 *     present in both locale files.
 */

const LOCALES = ['it', 'en'] as const;
type Locale = (typeof LOCALES)[number];

const NAMESPACES = ['changePhone', 'addPhone', 'verifyWhatsApp'] as const;

const localeFilePath = (locale: Locale): string =>
  path.join(process.cwd(), 'public', 'assets', 'locales', locale, 'dialogs.json');

const coreBundlePath = (): string =>
  path.join(
    path.dirname(require.resolve('@influenzanet/case-web-app-core/package.json')),
    'build',
    'index.js'
  );

const readJsonFile = (filePath: string): Record<string, unknown> => {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
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

const hasKey = (source: Record<string, unknown>, dottedKey: string): boolean => {
  const resolved = dottedKey
    .split('.')
    .reduce<unknown>(
      (current, segment) => (isPlainObject(current) ? current[segment] : undefined),
      source
    );
  return typeof resolved === 'string';
};

/**
 * Collects the `t('<namespace>.<key>')` references of the three phone/WhatsApp
 * dialog namespaces from the built core library. Both quote styles and the
 * optional `dialogs:` namespace prefix used by the library are accepted.
 */
const collectReferencedKeys = (bundle: string): string[] => {
  const pattern = new RegExp(
    `t\\(\\s*['"](?:dialogs:)?((?:${NAMESPACES.join('|')})\\.[A-Za-z0-9_.]+)['"]`,
    'g'
  );
  const keys = new Set<string>();
  let match = pattern.exec(bundle);
  while (match !== null) {
    keys.add(match[1]);
    match = pattern.exec(bundle);
  }
  return Array.from(keys).sort();
};

const translations: Record<Locale, Record<string, unknown>> = {
  it: readJsonFile(localeFilePath('it')),
  en: readJsonFile(localeFilePath('en')),
};

describe('dialogs locale files', () => {
  it('exposes the same key set in every language', () => {
    expect(flattenKeys(translations.it).sort()).toEqual(flattenKeys(translations.en).sort());
  });
});

describe('phone and WhatsApp dialog keys required by @influenzanet/case-web-app-core', () => {
  const referencedKeys = collectReferencedKeys(fs.readFileSync(coreBundlePath(), 'utf8'));

  it('finds the keys referenced by the core library bundle', () => {
    // Guards against a bundle format change silently emptying the check below.
    expect(referencedKeys.length).toBeGreaterThan(0);
  });

  it('has a translation for every referenced key in every language', () => {
    const missing = referencedKeys
      .map((key) => ({
        key,
        it: hasKey(translations.it, key),
        en: hasKey(translations.en, key),
      }))
      .filter((entry) => !entry.it || !entry.en);
    expect(missing).toEqual([]);
  });
});
