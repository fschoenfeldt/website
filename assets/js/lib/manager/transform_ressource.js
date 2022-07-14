// TODO use `pathPrefix` from `.eleventy.js`
const addPathPrefix = (path, pathPrefix = "/html/website/") =>
  `${pathPrefix}img/manager/${path}`;

const toFileName = (ressource_name) => {
  // lowercase and replace spaces with underscores
  const safeName = ressource_name.toLowerCase().replace(/\s/g, "_");
  return addPathPrefix(`${safeName}.png`);
};

const recipes = {
  Hyperfuel: [
    {
      name: "Hyperium",
      amount: 2,
    },
  ],
  "Energy Rod": [
    {
      name: "Energium",
      amount: 0.5,
    },
  ],
  Chemicals: [
    {
      name: "Raw Chemicals",
      amount: 0.5,
    },
  ],
  "Electronics Component": [
    {
      name: "Base Metals",
      amount: 0.2,
    },
    {
      name: "Noble Metals",
      amount: 0.2,
    },
  ],
};

export const getRecipe = (name) => name && recipes[name];

export const transform = (
  ressource_name,
  _index,
  _all_resources,
  mock = false
) => {
  return {
    name: ressource_name,
    path: toFileName(ressource_name),
    visible: mock ? Math.random() > 0.5 : false,
    priceHistory: mock
      ? [
          {
            value: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
          },
          {
            value: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
          },
          {
            value: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
          },
          {
            value: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
          },
          {
            value: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
          },
          {
            value: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
          },
          {
            value: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
          },
        ]
      : [],
  };
};

// Adding any new ressources that are not in the savegame
export const maybeUpdateRessources = (
  ressourcesFromSavegame,
  initialRessources
) => {
  const newRessourcesAfterUpdate = initialRessources.filter(
    ({ name: nameUpdate }) => {
      console.debug(`is ${nameUpdate} in savegame?`);
      const result = !!ressourcesFromSavegame.find(
        ({ name: nameSavegame }) => nameUpdate === nameSavegame
      );
      console.debug(result);
      return !result;
    }
  );

  return [...ressourcesFromSavegame, ...newRessourcesAfterUpdate];
};
