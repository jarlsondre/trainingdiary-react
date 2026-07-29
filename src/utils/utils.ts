interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

export const compareExerciseUnitIds = (a: HasId, b: HasId): number => {
  return a.id - b.id;
};

export const compareExerciseNames = (a: HasName, b: HasName): number => {
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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
