import React, { useEffect } from "react";
import { AppCore } from "case-web-app-core";
import { useTranslation } from "react-i18next";

import { AppConfig } from "case-web-app-core/build/types/appConfig";
import { FooterConfig } from "case-web-app-core/build/types/footerConfig";
import { HeaderConfig } from "case-web-app-core/build/types/headerConfig";
import { NavbarConfig } from "case-web-app-core/build/types/navbarConfig";
import { PagesConfig } from "case-web-app-core/build/types/pagesConfig";

import { it } from "date-fns/locale";

import * as appConfig from "./configs/appConfig.json";
import * as footerConfig from "./configs/footer.json";
import * as headerConfig from "./configs/header.json";
import * as navbarConfig from "./configs/navbar.json";
import * as pagesConfig from "./configs/pages.json";
import StudyManager from "./StudyManager";
import { Extension } from "case-web-app-core/build/AppCore";
import { ProfileSettingsBox } from "./extensions/ProfileSettingsBox";

const App: React.FC = () => {
  // const profileEnable = useSelector(
  //   (state: any) => state.profile.profileEnabled
  // );

  // const pc: any = pagesConfig;

  // pc.pages
  //   .find((page: any) => page.path === "/settings")
  //   .rows.find(
  //     (row: any) => row.key === "mainRow"
  //   ).columns[0].items[0].config.hideProfileSettings = !profileEnable;

  const { i18n } = useTranslation();

  const dateLocales = [{ code: "it", locale: it, format: "dd/MM/yyyy" }];

  const profileSettingsBox: Extension = {
    name: "profileSettingsBox",
    component: ProfileSettingsBox,
  };
  const extensions = [profileSettingsBox];

  useEffect(() => {
    if (!i18n.language) {
      i18n.changeLanguage(`${process.env.REACT_APP_DEFAULT_LANGUAGE}`);
    }
  }, [i18n, i18n.language]);

  return (
    <React.Fragment>
      <AppCore
        appConfig={appConfig as AppConfig}
        headerConfig={headerConfig as HeaderConfig}
        navbarConfig={navbarConfig as NavbarConfig}
        pagesConfig={pagesConfig as PagesConfig}
        footerConfig={footerConfig as FooterConfig}
        dateLocales={dateLocales}
        extensions={extensions}
      />
      <StudyManager></StudyManager>
    </React.Fragment>
  );
};

export default App;
