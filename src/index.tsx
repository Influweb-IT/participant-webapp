// App entry point (owned by this repo, never touched by copier update).
// Shared boot logic: @influenzanet/participant-webapp-kit renderParticipantApp().
import { renderParticipantApp } from "@influenzanet/participant-webapp-kit";
import { it } from "date-fns/locale";

import "./index.scss";

import * as appConfig from "./configs/appConfig.json";
import * as footerConfig from "./configs/footer.json";
import * as headerConfig from "./configs/header.json";
import * as navbarConfig from "./configs/navbar.json";
import * as pagesConfig from "./configs/pages.json";

import Iubenda from "./Iubenda";
import Facebook from "./Facebook";
import { configureState } from "./utils/ConfigureState";

renderParticipantApp({
  appConfig,
  footerConfig,
  headerConfig,
  navbarConfig,
  pagesConfig,
  dateLocales: [{ code: "it", locale: it, format: "dd/MM/yyyy" }],
  // cookie consent + signup reducers used by Iubenda / Facebook
  beforeRender: configureState,
  children: (
    <>
      <Iubenda />
      <Facebook />
    </>
  ),
});
