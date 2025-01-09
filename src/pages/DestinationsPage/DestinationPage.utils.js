export const serializeCountry = (country) => {
  return country.toLowerCase().replace(/ /g, "-");
};
