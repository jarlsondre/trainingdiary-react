import {
  compareExerciseNames,
  compareExerciseUnitIds,
  formatDate,
  months,
} from "./utils";

describe("compareExerciseUnitIds", () => {
  it("sorts by ascending id", () => {
    const units = [{ id: 3 }, { id: 1 }, { id: 2 }];
    expect(units.sort(compareExerciseUnitIds).map((u) => u.id)).toEqual([
      1, 2, 3,
    ]);
  });
});

describe("compareExerciseNames", () => {
  it("sorts alphabetically", () => {
    const exercises = [
      { name: "Squat" },
      { name: "Bench Press" },
      { name: "Deadlift" },
    ];
    expect(exercises.sort(compareExerciseNames).map((e) => e.name)).toEqual([
      "Bench Press",
      "Deadlift",
      "Squat",
    ]);
  });

  it("treats equal names as equal", () => {
    expect(compareExerciseNames({ name: "Squat" }, { name: "Squat" })).toBe(0);
  });
});

describe("formatDate", () => {
  it("formats an ISO datetime as a long US date", () => {
    expect(formatDate("2026-07-14T12:00:00Z")).toBe("July 14, 2026");
  });
});

describe("months", () => {
  it("maps JS month indices to names", () => {
    expect(months[0]).toBe("January");
    expect(months[11]).toBe("December");
  });
});
