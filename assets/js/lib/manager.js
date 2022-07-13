// TODO use `pathPrefix` from `.eleventy.js`
const addPathPrefix = (path, pathPrefix = "/html/website/") =>
  `${pathPrefix}img/${path}`;

const getByName = ({ ressources }, name) =>
  ressources.find((r) => r.name === name);

const minMaxAveragePrice = (priceHistory) => {
  const prices = priceHistory.map(({ value }) => parseInt(value));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const average = Math.round(
    prices.reduce((acc, curr) => acc + curr, 0) / prices.length
  );
  return { min, max, average };
};

const addPriceHistory = (store, ressourceName, { value }) => {
  const ressourceFound = getByName(store, ressourceName);
  const priceHistory = [...ressourceFound.priceHistory, { value }];

  const modifiedRessource = {
    ...ressourceFound,
    priceHistory,
    ...minMaxAveragePrice(priceHistory),
  };

  console.log({ modifiedRessource });

  // return replaced ressources
  return store.ressources.map((r) =>
    r.name === ressourceName ? modifiedRessource : r
  );
};

export const store = {
  modalVisible: false,
  ressources: [
    {
      name: "Crystal",
      path: addPathPrefix("crystal.png"),
      priceHistory: [
        /* {
          value: 89,
        },
        {
          value: 90,
        },
        {
          value: 97,
        }, */
      ],
    },
    {
      name: "Energy Rod",
      path: addPathPrefix("energy_rod.png"),
      priceHistory: [
        /* {
          value: 154,
        },
        {
          value: 142,
        },
        {
          value: 160,
        }, */
      ],
    },
    {
      name: "Hyperium",
      path: addPathPrefix("hyperium.png"),
      priceHistory: [],
    },
    {
      name: "Hyperfuel",
      path: addPathPrefix("hyper_fuel.png"),
      priceHistory: [],
    },
    {
      name: "Electronics Component",
      path: addPathPrefix("electronics.png"),
      priceHistory: [],
    },
  ],
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
