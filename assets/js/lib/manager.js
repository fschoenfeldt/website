import { transform } from "./manager/transform_ressource";
import {
  addPriceHistory,
  minMaxAveragePrice,
  getByName,
} from "./manager/utils";
import Chart from "chart.js/auto";

const version = 1;

export const store = {
  init() {
    const ressourcesFromStorage = localStorage.getItem("ressources");

    if (ressourcesFromStorage && ressourcesFromStorage.length) {
      console.info("Loading your ressources from local storage...");
      const ressourcesToStore = JSON.parse(ressourcesFromStorage);
      this.ressources = ressourcesToStore;
      console.log("✅ Loading Done!");
    } else {
      const initialItems = [
        "Crystal",
        "Energy Rod",
        "Hyperium",
        "Hyperfuel",
        "Electronics Component",
        "Raw Chemicals",
        "Chemicals",
      ]
        .map(transform)
        .map((r) => ({
          ...r,
          ...minMaxAveragePrice(r.priceHistory),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      this.ressources = initialItems;
    }
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
    const ressource = getByName(this.$store.manager, name);
    const { priceHistory } = ressource;

    console.log(ressource);

    const ctx = this.$root.querySelector("#priceHistoryChart");
    Chart.defaults.font.size = 16;
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
        ],
      },
      options: {
        animation: false,
        elements: {
          line: {
            tension: 0.3,
          },
        },
      },
    });

    this.$nextTick(() => {
      this.ressource = ressource;
      this.$refs.name.value = name;
      this.$refs.input.focus();
    });
  },
  handleModal(e) {
    console.log({ e });
    console.log(this.$refs.input.value);
    console.log(this.$refs.name.value);

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
    });

    /*  console.log("adding to", name);
    

    console.log(this.$store.manager.ressources[0]); */
  },
  hideAddPriceModal(_e) {
    this.$store.manager.modalVisible = false;
    this.$refs.input.value = "";
    this.$store.manager.priceHistoryChart.destroy();
  },
};

export const data = () => ({
  /* handleModal: ({ detail: { name } }) => {
    visible = true;
    console.log(name);
  }, */
});
