import { transform } from "./manager/transform_source";
import {
  addPriceHistory,
  minMaxAveragePrice,
  getByName,
} from "./manager/utils";

export const store = {
  modalVisible: false,
  changeVisibility: false,
  ressources: [
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
    .sort((a, b) => a.name.localeCompare(b.name)),

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
  showModal({ detail: { name } }) {
    this.$store.manager.modalVisible = true;
    const { path } = getByName(this.$store.manager, name);

    this.$nextTick(() => {
      this.$refs.name.value = name;
      this.$refs.modalTitle.innerHTML = `new price for ${name}`;
      this.$refs.modalIcon.src = path;
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
    });

    /*  console.log("adding to", name);
    

    console.log(this.$store.manager.ressources[0]); */
  },
};

export const data = () => ({
  /* handleModal: ({ detail: { name } }) => {
    visible = true;
    console.log(name);
  }, */
});
