# Influweb: country notes

Owned by this repo: `copier update` never touches this file. The shared setup is in [README.md](README.md).

## Pages and integrations

- `/results` is an `iframeEmbed` of `/dashboard/?lang={lang}`: the Streamlit dashboard, served by
  the ingress (not this nginx), auto-resized with iframe-resizer (child script loaded by the
  dashboard). Keep the trailing slash: `/dashboard` redirects to an absolute URL.
  In `yarn start` the dev server proxies `/dashboard` and `/_stcore` (websockets) to staging
  (`dev_ws_proxy_paths` answer).
- `/welcome` and `/home` show the latest posts of the Ghost blog (`blogPosts`, `limit: 3`;
  `REACT_APP_GHOST_URL` / `REACT_APP_GHOST_CONTENT_API_KEY` in `.env`).
- Iubenda cookie banner (`src/Iubenda.tsx`, script over `https://`) and Facebook pixel
  (`src/Facebook.tsx`: loaded with consent revoked, granted from the Iubenda cookie
  preferences); the Facebook domain verification meta is the
  `head_extra` answer. Both need entries in `nginx/snippets/csp.conf`, which documents each one.
  `'unsafe-inline'` (pixel bootstrap) and `'unsafe-eval'` are still in `script-src`.

## Country code

- `src/utils/ConfigureState.ts`, `src/reducers/`, `src/localStorage/`: consent and signup state used by
  Iubenda / Facebook (registered with `beforeRender` in `src/index.tsx`).
- `src/theme/`: `it-theme.scss`, `iubenda_banner.scss`, colour schemes (`selected_color_scheme.scss`).
- `@reduxjs/toolkit` is an `extra_dependencies` answer.

## Deploy

- Image `influweb/participant-webapp`; cluster-management `svcWebParticipant` with `unprivileged: true`.
