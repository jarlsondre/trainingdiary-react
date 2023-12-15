export const compareExerciseUnitIds = (a: any, b: any) => {
  return a.id - b.id;
};

export const compareExerciseNames = (a: any, b: any) => {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
};
