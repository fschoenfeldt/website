import Alpine from "alpinejs";
import * as CookieConsent from "vanilla-cookieconsent";
import ccOptions from "./lib/cookie_consent";
import projectManager from "./lib/project_manager";

// https://github.com/orestbida/cookieconsent
CookieConsent.run(ccOptions);

// initialize alpine
window.Alpine = Alpine;
Alpine.data("projectManager", projectManager);
Alpine.start();
