export const compareExerciseUnitIds = (a: any, b: any) => {
  return a.id - b.id;
};

export const compareExerciseNames = (a: any, b: any) => {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
};

export const months: { [key: number]: string } = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};
