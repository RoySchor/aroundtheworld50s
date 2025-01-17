export const serializeLocation = (country) => {
  return country.toLowerCase().replace(/ /g, "-");
};
