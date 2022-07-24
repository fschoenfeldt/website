export const getByName = ({ ressources }, name) =>
  ressources.find((r) => r.name === name);

export const minMaxAveragePrice = (priceHistory) => {
  const prices = priceHistory.map(({ value }) => parseInt(value));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const average = Math.round(
    prices.reduce((acc, curr) => acc + curr, 0) / prices.length
  );
  return { min, max, average };
};

export const addPriceHistory = (store, ressourceName, { value }) => {
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

/**
 * Returns a list of focussable elements. If no `parentEl` is provided, the list will include all focusable elements in the document.
 * @param {HTMLElement=} parentEl
 * @link https://zellwk.com/blog/keyboard-focusable-elements/ source
 * @returns [HTMLElement]
 */
export const getKeyboardFocussableElements = (parentEl) =>
  (parentEl ? parentEl : document).querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

export const getFirstAndLast = (elements) => {
  const first = elements[0];
  const last = elements[elements.length - 1];
  return { first, last };
};
