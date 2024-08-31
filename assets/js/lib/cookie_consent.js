export default {
  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/, // regex: match all cookies starting with '_ga'
          },
          {
            name: "_gid", // string: exact cookie name
          },
        ],
      },

      // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
      services: {
        ga: {
          label: "Google Analytics",
          onAccept: () => {},
          onReject: () => {},
        },
      },
    },
    ads: {},
  },
  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "I use cookies!",
          description:
            "Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage Individual preferences",
        },
        preferencesModal: {
          title: "Manage cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Accept current selection",
          closeIconLabel: "Close modal",
          sections: [
            {
              title: "Strictly Necessary cookies",
              description:
                "These cookies are essential for the proper functioning of the website and cannot be disabled.",

              //this field will generate a toggle linked to the 'necessary' category
              linkedCategory: "necessary",
            },
            {
              title: "Performance and Analytics",
              description:
                "These cookies collect information about how you use my website. All of the data is anonymized and cannot be used to identify you.",
              linkedCategory: "analytics",
            },
          ],
        },
      },
    },
  },
};
