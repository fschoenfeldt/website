// Get amount of days between now and given date.
const getDaysBetween = (date) => {
  const now = new Date();
  const givenDate = new Date(date);

  const timeDiff = givenDate.getTime() - now.getTime();
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays;
};

const format = (diffDays) => `${getDaysBetween(diffDays)} Tage`;

const localeDateString = (date, locale = "de-DE") => {
  return new Date(date).toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// filter out null values of object
const filterObject = (obj) => {
  return Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== "")
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
};

export const store = {
  getDaysBetween: getDaysBetween,
  format: format,
  localeDateString: localeDateString,
  editMode: false,
  generatedLink: null,
  vacationLocation: null,
  vacationImageSearch: null,
  vacationImagesResult: null,
  vacationImage: null,
  date: null,
  async submitVacationImageSearch(e) {
    console.debug(this.$store.vacation.vacationImageSearch);
    const vacationImageSearch = this.$store.vacation.vacationImageSearch;

    if (vacationImageSearch !== "") {
      const response = await fetch(
        `http://fschoenf.uber.space/fh/api/search/photos/${vacationImageSearch}`,
      );

      const data = await response.json();

      this.$store.vacation.vacationImagesResult = data.data;

      console.debug(data.data);
    }
  },
  async submitVactionForm() {
    const date = this.$refs.inputdate.value;
    const vacationLocation = this.$refs.inputvacationlocation.value;
    const vacationImage = this.$store.vacation.vacationImage;

    const params = {
      date,
      vacationLocation,
      vacationImage,
    };
    console.debug(filterObject(params));

    const currentUrl = location.href.replace(location.search, "");
    const newParams = new URLSearchParams(filterObject(params)).toString();
    this.$store.vacation.generatedLink = `${currentUrl}?${newParams}`;
  },
  async init() {
    const params = new URL(document.location).searchParams;
    const date = params.get("date");
    const vacationLocation = params.get("vacationLocation");
    const vacationImage = params.get("vacationImage");

    if (date) {
      this.date = date;
    } else {
      this.editMode = true;
    }

    if (vacationLocation) {
      this.vacationLocation = vacationLocation;
    }
    if (vacationImage) {
      const response = await fetch(
        `http://fschoenf.uber.space/fh/api/content/photos/${vacationImage}`,
      );
      const data = await response.json();

      this.vacationImage = data.data;
    }
  },
};
