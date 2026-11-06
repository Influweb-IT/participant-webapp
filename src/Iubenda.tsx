import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CookiePreferences, cookiePreferenceSlice } from './reducers/consentReducers';

const Iubenda: React.FC = () => {

  const instance = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const _iub : any = { };
    _iub.csConfiguration = {
      "ccpaAcknowledgeOnDisplay": true,
      "consentOnContinuedBrowsing": false,
      "countryDetection": true,
      "enableCcpa": true,
      "enableLgpd": true,
      "floatingPreferencesButtonDisplay": "bottom-right",
      "invalidateConsentWithoutLog": true,
      "lgpdAppliesGlobally": false,
      "perPurposeConsent": true,
      "siteId": 2864935,
      "cookiePolicyId": 34173099,
      "lang": "it",
      "banner": {
        "acceptButtonCaptionColor": "#FFFFFF",
        "acceptButtonColor": "#870A30",
        "acceptButtonDisplay": true,
        "backgroundColor": "#FFFFFF",
        "brandBackgroundColor": "#FFEBEB",
        "brandTextColor": "#000000",
        "closeButtonDisplay": false,
        "customizeButtonCaptionColor": "#4D4D4D",
        "customizeButtonColor": "#DADADA",
        "customizeButtonDisplay": true,
        "explicitWithdrawal": true,
        "listPurposes": true,
        "logo": "https://influweb.org/assets/images/logo2.png",
        "position": "float-top-center",
        "prependOnBody": true,
        "rejectButtonCaptionColor": "#4D4D4D",
        "rejectButtonColor": "#DADADA",
        "rejectButtonDisplay": true,
        "slideDown": false,
        "textColor": "#000000"
      },
      "callback": {
        "onPreferenceExpressed": onPreferenceExpressed
      }
    };

    function onPreferenceExpressed(preferences: { purposes: CookiePreferences; }) {
      dispatch(cookiePreferenceSlice.actions.preferencesChanged({ ...preferences.purposes }));
    }

    const _window : Window | any = window;

    _window._iub = _iub;

    const scriptTag = document.createElement("script");

    // explicit https: protocol-relative becomes http:// on a plain-http page, which the CSP blocks
    scriptTag.src = "https://cdn.iubenda.com/cs/iubenda_cs.js";
    if(instance !== null && instance.current !== null) {
      instance.current.appendChild(scriptTag);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={instance} />
    </>
  );
};

export default Iubenda;
