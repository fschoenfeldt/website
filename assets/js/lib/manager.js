import {
  transform,
  maybeUpdateRessources,
  getRecipe,
} from "./manager/transform_ressource";
import {
  addPriceHistory,
  minMaxAveragePrice,
  getByName,
  getKeyboardFocussableElements,
  getFirstAndLast,
} from "./manager/utils";
import Chart from "chart.js/auto";

const version = 1;
const initialRessources = [
  "Energium",
  "Energy Rod",
  "Hyperium",
  "Hyperfuel",
  "Electronics Component",
  "Raw Chemicals",
  "Chemicals",
  "Artificial Meat",
  "Fabrics",
  "Fertilizer",
  "Fibers",
  "Fruit",
  "Infra Block",
  "Nuts and Seeds",
  "Root Vegetables",
  "Space Food",
  "Tech Block",
  "Base Metals",
  "Noble Metals",
  "Optronics Component",
  "Ice",
  "Water",
].map(transform);

export const store = {
  init() {
    const ressourcesFromStorage = localStorage.getItem("ressources");
    let ressourcesToApply = [];

    if (ressourcesFromStorage && ressourcesFromStorage.length) {
      console.info("Loading your ressources from local storage...");
      const ressourcesFromSavegame = JSON.parse(ressourcesFromStorage);
      console.debug({ ressourcesFromSavegame });

      const ressourcesUpdateCompleted = maybeUpdateRessources(
        ressourcesFromSavegame,
        initialRessources
      );
      console.debug({ ressourcesUpdateCompleted });

      ressourcesToApply = ressourcesUpdateCompleted;
      console.log("✅ Loading Done!");
    } else {
      ressourcesToApply = initialRessources;
    }

    this.ressources = ressourcesToApply
      .map((r) => ({
        ...r,
        ...minMaxAveragePrice(r.priceHistory),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  persist(_ressources) {
    const previousState = JSON.parse(localStorage.getItem("ressources"));
    console.log({ previousState });
    const stateToSave = this.ressources;
    console.log({ stateToSave });

    if (JSON.stringify(previousState) !== JSON.stringify(stateToSave)) {
      console.info("Saving your state...");
      localStorage.setItem("ressources", JSON.stringify(stateToSave));
      console.log("✅ Saving Done!");
    }
  },
  clearStorage() {
    console.info("Clearing your state...");
    localStorage.clear();
    location.reload();
  },
  modalVisible: false,
  changeVisibility: false,
  ressources: [],
  version: version,
  getByName,
  toggleRessourceVisibility({ name }) {
    this.ressources = this.ressources.map((r) => {
      if (r.name === name) {
        return {
          ...r,
          visible: !r.visible,
        };
      }
      return r;
    });
  },
  showAddPriceModal({ detail: { name } }) {
    this.$store.manager.modalVisible = true;
    const ressource = {
      ...getByName(this.$store.manager, name),
      recipe: getRecipe(name),
    };
    const { priceHistory, average } = ressource;

    console.log(ressource);

    // Chart initialisation
    const ctx = this.$root.querySelector("#priceHistoryChart");
    Chart.defaults.font.size = 16;
    Chart.defaults.color = "rgba(165, 243, 252, 0.8)";
    this.$store.manager.priceHistoryChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [...priceHistory.keys()],
        datasets: [
          {
            label: "Prices of " + name,
            backgroundColor: "rgba(165, 243, 252, 0.8)",
            borderColor: "rgba(165, 243, 252, 0.8)",
            data: priceHistory.map((p) => p.value),
          },
          /* {
            label: "Average Price of " + name,
            backgroundColor: "rgba(165, 243, 252, 0.6)",
            borderColor: "rgba(165, 243, 252, 0.6)",
            data: [...priceHistory.map((_p) => average)],
          }, */
        ],
      },
      options: {
        animation: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          line: {
            tension: 0.3,
          },
        },
      },
    });

    this.$nextTick(() => {
      this.ressource = ressource;
      // remember last focused element
      this.$store.manager.lastFocusedElement = document.activeElement;
      // TODO remove hidden name input
      this.$refs.name.value = name;
      this.$refs.input.focus();
    });
  },
  handleModal(e) {
    console.log({ e });
    console.log(this.$refs.input.value);
    console.log(this.$refs.name.value);

    // TODO remove hidden name input
    const name = this.$refs.name.value;
    const value = this.$refs.input.value;

    const newRessources = addPriceHistory(this.$store.manager, name, {
      value,
    });

    this.$store.manager.ressources = newRessources;

    this.$nextTick(() => {
      this.$store.manager.modalVisible = false;
      this.$refs.input.value = "";
      this.$store.manager.priceHistoryChart.destroy();
      this.$store.manager.lastFocusedElement.focus();
    });

    /*  console.log("adding to", name);
    

    console.log(this.$store.manager.ressources[0]); */
  },
  hideAddPriceModal(_e) {
    this.ressource = {};
    this.$store.manager.modalVisible = false;
    this.$refs.input.value = "";
    this.$store.manager.priceHistoryChart.destroy();
    this.$store.manager.lastFocusedElement.focus();
  },
  handleTabModal(e) {
    const elems = getKeyboardFocussableElements(this.$root);
    const { first, last } = getFirstAndLast(elems);

    // as AlpineJS doesn't support an exact modifier, we need to check on the `shiftKey`
    // -> https://github.com/alpinejs/alpine/issues/273
    if (document.activeElement === last && !e.shiftKey) {
      first.focus();
      e.preventDefault();
    }
  },
  handleShiftTabModal(e) {
    const elems = getKeyboardFocussableElements(this.$root);
    const { first, last } = getFirstAndLast(elems);

    if (document.activeElement === first) {
      last.focus();
      e.preventDefault();
    }
  },
};

export const data = () => ({
  /* handleModal: ({ detail: { name } }) => {
    visible = true;
    console.log(name);
  }, */
});
