import { PagesConfig } from "@influenzanet/case-web-app-core/build/types/pagesConfig";

const pagesConfig: PagesConfig = {
  defaultRoutes: {
    auth: "/home",
    unauth: "/welcome",
    studyPage: "/home",
    surveyPage: "/surveys",
  },
  pages: [
    {
      path: "/welcome",
      pageKey: "landing",
      hideWhen: "auth",
      rows: [
        {
          key: "teaserImage",
          fullWidth: true,
          columns: [
            {
              key: "col",
              className: "w-100 p-0",
              items: [
                {
                  itemKey: "teaserImage",
                  config: {
                    type: "teaserImage",
                    image: {
                      url: "/images/landing.jpg",
                      height: 367,
                      backgroundPosition: "47% 27%",
                    },
                    textBox: {
                      className: "col col-md-6 col-lg-4 offset-0 offset-lg-1",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          key: "content",
          containerClassName: "min-vh-60",
          columns: [
            {
              key: "loginCardCol",
              className: "col-12 col-md-6 col-lg-4 mt-3",
              items: [
                {
                  itemKey: "loginCard",
                  className: "h-100",
                  config: {
                    type: "loginCard",
                    showInfoText: false,
                  },
                },
              ],
            },
            {
              key: "cardResultsCol",
              className: "col-12 col-md-6 col-lg-4 mt-3",
              items: [
                {
                  itemKey: "currentResultCard",
                  className: "h-100",
                  config: {
                    type: "imageCard",
                    showActionBtn: true,
                    action: {
                      type: "navigate",
                      value: "/results",
                    },
                    imageSrc: "/images/results.jpg",
                  },
                },
              ],
            },
            {
              key: "cardSignupCol",
              className: "col-12 col-lg-4 mt-3",
              items: [
                {
                  itemKey: "signupCard",
                  className: "h-100",
                  config: {
                    type: "imageCard",
                    showActionBtn: true,
                    action: {
                      type: "openDialog",
                      value: "signup",
                    },
                    imageSrc: "/images/participate.jpg",
                  },
                },
              ],
            },
            {
              key: "aboutCardCol",
              className: "col-12 col-lg-4 mt-3 min-h-478",
              items: [
                {
                  itemKey: "aboutCard",
                  className: "h-100",
                  config: {
                    type: "imageCard",
                    showActionBtn: true,
                    action: {
                      type: "navigate",
                      value: "/about",
                    },
                    imageSrc: "/images/about.jpg",
                  },
                },
              ],
            },
            {
              key: "infoCard",
              className: "col-12 col-lg-4 mt-3 min-h-478",
              items: [
                {
                  itemKey: "infoCard",
                  className: "h-100",
                  config: {
                    type: "imageCard",
                    showActionBtn: true,
                    action: {
                      type: "navigate",
                      value: "/info",
                    },
                    imageSrc: "/images/info.jpg",
                  },
                },
              ],
            },
          ],
        },
        {
          key: "sponsorRow",
          containerClassName: "",
          columns: [
            {
              key: "sponsorCol",
              className: "col-12 col-md-12 mt-3",
              items: [
                {
                  itemKey: "logoCredits",
                  className: "",
                  config: {
                    type: "markdown",
                    markdownUrl: "markdowns/sponsors.md",
                    flavor: "chart-renderer",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/results",
      pageKey: "results",
      rows: [
        {
          key: "contentRow",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "contentCol",
              className: "col-12 col-lg-8",
              items: [
                {
                  itemKey: "results",
                  config: {
                    type: "markdown",
                    markdownUrl: "markdowns/results_template.md",
                    flavor: "chart-renderer",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/home",
      hideWhen: "unauth",
      pageKey: "landing",
      rows: [
        {
          key: "teaserImage",
          fullWidth: true,
          columns: [
            {
              key: "col",
              className: "w-100 p-0",
              items: [
                {
                  itemKey: "teaserImage",
                  config: {
                    type: "teaserImage",
                    image: {
                      url: "/images/landing.jpg",
                      height: 367,
                      backgroundPosition: "47% 27%",
                    },
                    textBox: {
                      className: "col col-md-6 col-lg-4 offset-0 offset-lg-1",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          key: "main",
          containerClassName: "py-3 min-vh-60",
          columns: [
            {
              key: "surveyCol",
              className: "col-12 col-lg-8",
              items: [
                {
                  itemKey: "messages",
                  className: "p-2 bg-warning-light mb-2",
                  config: {
                    type: "markdown",
                    markdownUrl: "markdowns/survey_messages.md",
                    flavor: "chart-renderer",
                  },
                },
                {
                  itemKey: "userSymptomsHistory",
                  config: {
                    type: "extension",
                    config: {
                      studyId: "influweb",
                      className: "row g-0 bg-primary",
                      type: "userSymptomsHistory",
                      label: "User Symptoms History",
                    },
                  },
                },
                {
                  itemKey: "surveyList",
                  className: "",
                  config: {
                    type: "surveyList",
                  },
                },
              ],
            },
            {
              key: "sideCol",
              className: "col-12 col-lg-4 mt-3 mt-lg-0",
              items: [
                {
                  itemKey: "references",
                  config: {
                    type: "linkList",
                    links: [
                      {
                        linkKey: "resultsLink",
                        type: "internal",
                        value: "/results",
                      },
                      {
                        linkKey: "aboutLink",
                        type: "internal",
                        value: "/about",
                      },
                      {
                        linkKey: "faqLink",
                        type: "internal",
                        value: "/faq",
                      },
                    ],
                  },
                },
                {
                  itemKey: "settingsReferences",
                  config: {
                    type: "linkList",
                    links: [
                      {
                        linkKey: "profileSettings",
                        type: "dialog",
                        value: "manageProfiles",
                      },
                      {
                        linkKey: "communicationSettings",
                        type: "dialog",
                        value: "changeNotifications",
                      },
                      {
                        linkKey: "languageSettings",
                        type: "dialog",
                        value: "changeLanguage",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/settings",
      hideWhen: "unauth",
      pageKey: "settings",
      rows: [
        {
          key: "mainRow",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "settingsCol",
              className: "col-12 col-lg-8",
              items: [
                {
                  itemKey: "account",
                  config: {
                    type: "accountSettings",
                    // allowProfileSettings: true,
                  },
                },
                {
                  itemKey: "communication",
                  config: {
                    type: "communicationSettings",
                    hideLanguageSelector: false,
                  },
                },
                {
                  itemKey: "deletion",
                  className: "",
                  config: {
                    type: "deleteAccount",
                  },
                },
              ],
            },
            {
              key: "helpCol",
              className: "col-12 col-lg-4 mt-3 mt-lg-0",
              items: [
                {
                  itemKey: "references",
                  config: {
                    type: "linkList",
                    links: [
                      {
                        linkKey: "faqLink",
                        type: "internal",
                        value: "/faq",
                      },
                      {
                        linkKey: "privacyStatementLink",
                        type: "internal",
                        value: "/privacy",
                      },
                      {
                        linkKey: "contactLink",
                        type: "internal",
                        value: "/contact",
                      },
                    ],
                  },
                },
                {
                  itemKey: "systemInfo",
                  config: {
                    type: "systemInfo",
                    showBrowserInfo: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/faq",
      pageKey: "faq",
      rows: [
        {
          key: "content",
          fullWidth: false,
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "mainCol",
              className: "col-12 col-lg-8",
              items: [
                {
                  itemKey: "topFaq",
                  className: "",
                  config: {
                    type: "simpleCard",
                    variant: "h2",
                  },
                },
                {
                  itemKey: "faq",
                  className: "",
                  config: {
                    type: "accordionList",
                    accordionCtrlsKey: "accordionControls",
                  },
                },
              ],
            },
            {
              key: "cardSignupCol",
              className: "col-12 col-lg-4 mt-3 mt-lg-0",
              items: [
                {
                  itemKey: "signupCard",
                  hideWhen: "auth",
                  className: "",
                  config: {
                    type: "imageCard",
                    action: {
                      type: "openDialog",
                      value: "signup",
                    },
                    imageSrc: "/images/participate.jpg",
                    showActionBtn: true,
                  },
                },
                {
                  itemKey: "surveyCard",
                  hideWhen: "unauth",
                  className: "",
                  config: {
                    type: "imageCard",
                    action: {
                      type: "navigate",
                      value: "/home",
                    },
                    imageSrc: "/images/survey.jpg",
                    showActionBtn: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/about",
      pageKey: "about",
      rows: [
        {
          key: "teaserImage",
          fullWidth: true,
          columns: [
            {
              key: "ti",
              className: "p-0",
              items: [
                {
                  itemKey: "topImage",
                  config: {
                    type: "teaserImage",
                    image: {
                      url: "/images/about-teaser.jpg",
                      backgroundPosition: "50% 43%",
                      height: 420,
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          key: "content",
          fullWidth: false,
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "mainCol",
              className: "col-12 col-lg-8",
              items: [
                {
                  itemKey: "aboutPolicy",
                  config: {
                    type: "markdown",
                    markdownUrl: "/markdowns/about.md",
                  },
                },
              ],
            },
            {
              key: "cardSignupCol",
              className: "col-12 col-lg-4 mt-3 mt-lg-0",
              items: [
                {
                  itemKey: "signupCard",
                  hideWhen: "auth",
                  className: "",
                  config: {
                    type: "imageCard",
                    action: {
                      type: "openDialog",
                      value: "signup",
                    },
                    imageSrc: "/images/participate.jpg",
                    showActionBtn: true,
                  },
                },
                {
                  itemKey: "surveyCard",
                  hideWhen: "unauth",
                  className: "",
                  config: {
                    type: "imageCard",
                    action: {
                      type: "navigate",
                      value: "/home",
                    },
                    imageSrc: "/images/survey.jpg",
                    showActionBtn: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/contact",
      pageKey: "contact",
      rows: [
        {
          key: "content",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "pCol",
              className: "col-12 col-sm-10 col-md-8",
              items: [
                {
                  itemKey: "contact",
                  className: "",
                  config: {
                    type: "markdown",
                    markdownUrl: "/markdowns/contact.md",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/privacy",
      pageKey: "privacy",
      rows: [
        {
          key: "content",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "pCol",
              className: "col-12 col-sm-10 col-md-8",
              items: [
                {
                  itemKey: "privacyPolicy",
                  className: "",
                  config: {
                    type: "markdown",
                    markdownUrl: "/markdowns/privacy.md",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/study-consent",
      pageKey: "study-consent",
      rows: [
        {
          key: "content",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "pCol",
              className: "col-12 col-sm-10 col-md-8",
              items: [
                {
                  itemKey: "studyPolicy",
                  className: "",
                  config: {
                    type: "markdown",
                    markdownUrl: "/consent/study.md",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/accessibility",
      pageKey: "accessibility",
      rows: [
        {
          key: "content",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "pCol",
              className: "col-12 col-sm-10 col-md-8",
              items: [
                {
                  itemKey: "accessibility",
                  className: "",
                  config: {
                    type: "markdown",
                    markdownUrl: "/markdowns/accessibility.md",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/disclaimer",
      pageKey: "disclaimer",
      rows: [
        {
          key: "content",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "pCol",
              className: "col-12 col-sm-10 col-md-8",
              items: [
                {
                  itemKey: "disclaimer",
                  className: "",
                  config: {
                    type: "markdown",
                    markdownUrl: "/markdowns/disclaimer.md",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/info",
      pageKey: "info",
      rows: [
        {
          key: "content",
          containerClassName: "my-3 min-vh-60",
          columns: [
            {
              key: "pCol",
              className: "col-12 col-sm-10 col-md-8",
              items: [
                {
                  itemKey: "info",
                  className: "",
                  config: {
                    type: "markdown",
                    markdownUrl: "/markdowns/info.md",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default pagesConfig;
