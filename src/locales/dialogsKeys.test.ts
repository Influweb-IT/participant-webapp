import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

/**
 * Guards the translation files against keys that exist in one language only, or
 * that the core library asks for and no file has: the page then shows the raw
 * key, as the change-phone dialog once did with
 * `changePhone.errors.wrongPhoneFormat`.
 *
 * Checks:
 *  1. `it` and `en` expose exactly the same key set, in dialogs.json,
 *     settings.json and translation.json.
 *  2. every phone, WhatsApp, opt-in and notification dialog key the installed core library asks for is
 *     present in both dialogs.json files.
 *  3. every phone key the core library's account settings ask for is present
 *     in both settings.json files, under the item key the settings page uses.
 */

const LOCALES = ['it', 'en'] as const;
type Locale = (typeof LOCALES)[number];

const FILES = ['dialogs', 'settings', 'translation'] as const;
type LocaleFile = (typeof FILES)[number];

const NAMESPACES = ['changePhone', 'addPhone', 'verifyWhatsApp', 'changeNotifications', 'whatsAppOptIn'] as const;

// The item key public/assets/configs/pages.json gives the account settings.
const ACCOUNT_SETTINGS_ITEM_KEY = 'account';

const localeFilePath = (locale: Locale, file: LocaleFile = 'dialogs'): string =>
  path.join(process.cwd(), 'public', 'assets', 'locales', locale, `${file}.json`);

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
 * Collects the `t('<namespace>.<key>')` references of the phone, WhatsApp and notification
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

/**
 * Collects the phone keys the core library's account settings ask for. They are
 * built from the page's item key, so the bundle holds only their tail, as
 * `t("".concat(props.itemKey, ".phone.<key>"))`.
 */
const collectAccountPhoneKeys = (bundle: string): string[] => {
  const pattern = /\.concat\([A-Za-z_$][\w$.]*\.itemKey,\s*["'](\.phone\.[A-Za-z0-9_.]+)["']\)/g;
  const keys = new Set<string>();
  let match = pattern.exec(bundle);
  while (match !== null) {
    keys.add(`${ACCOUNT_SETTINGS_ITEM_KEY}${match[1]}`);
    match = pattern.exec(bundle);
  }
  return Array.from(keys).sort();
};

const translations: Record<Locale, Record<string, unknown>> = {
  it: readJsonFile(localeFilePath('it')),
  en: readJsonFile(localeFilePath('en')),
};

const settings: Record<Locale, Record<string, unknown>> = {
  it: readJsonFile(localeFilePath('it', 'settings')),
  en: readJsonFile(localeFilePath('en', 'settings')),
};

describe.each(FILES)('%s.json locale files', (file) => {
  it('exposes the same key set in every language', () => {
    const italian = readJsonFile(localeFilePath('it', file));
    const english = readJsonFile(localeFilePath('en', file));
    expect(flattenKeys(italian).sort()).toEqual(flattenKeys(english).sort());
  });
});

describe('phone, WhatsApp and notification dialog keys required by @influenzanet/case-web-app-core', () => {
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

describe('account settings phone keys required by @influenzanet/case-web-app-core', () => {
  const referencedKeys = collectAccountPhoneKeys(fs.readFileSync(coreBundlePath(), 'utf8'));

  it('finds the keys referenced by the core library bundle', () => {
    // Guards against a bundle format change silently emptying the check below.
    expect(referencedKeys).toContain(`${ACCOUNT_SETTINGS_ITEM_KEY}.phone.title`);
  });

  it('has a translation for every referenced key in every language', () => {
    const missing = referencedKeys
      .map((key) => ({
        key,
        it: hasKey(settings.it, key),
        en: hasKey(settings.en, key),
      }))
      .filter((entry) => !entry.it || !entry.en);
    expect(missing).toEqual([]);
  });
});
