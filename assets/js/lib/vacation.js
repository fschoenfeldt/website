// Get amount of days between now and given date.
const getDaysBetween = (date) => {
  const now = new Date();
  const givenDate = new Date(date);

  const timeDiff = givenDate.getTime() - now.getTime();
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays;
};

const format = (diffDays) => `${getDaysBetween(diffDays)} Tage`;

export default () => ({
  getDaysBetween: getDaysBetween,
  format: format,
  editMode: false,
  generatedLink: null,
  handleSubmit: (event) => {
    event.preventDefault();
    const date = event.target.date.value;
    const currentUrl = location.href.replace(location.search, "");
    const newParams = new URLSearchParams({ date }).toString();
    const generatedLink = `${currentUrl}?${newParams}`;

    // TODO: show generated link. Cant' access `this` here because we're in an event.
  },
  init: () => {
    const params = new URL(document.location).searchParams;
    const date = params.get("date");

    // TODO: use custom date if present in params
    if (date) {
      console.log("i got date", date);
    } else {
      console.log("no date");
    }
  },
});
