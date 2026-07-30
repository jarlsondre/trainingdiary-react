// Ever-decreasing negative ids for optimistically-created rows. They never
// collide with real (positive) server ids and are replaced on the next refetch.
let counter = 0;

export const nextTempId = (): number => {
  counter -= 1;
  return counter;
};
