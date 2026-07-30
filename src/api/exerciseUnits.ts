import ExerciseUnitService, {
  type NewExerciseUnit,
} from "../services/exerciseUnit.service";
import type { ExerciseUnitInterface } from "../types/models";

export const createExerciseUnit = (data: NewExerciseUnit) =>
  ExerciseUnitService.addExerciseUnit(data).then((r) => r.data);

export const deleteExerciseUnit = (id: number): Promise<number> =>
  ExerciseUnitService.deleteExerciseUnit(id).then(() => id);

export const updateExerciseUnit = (
  id: number,
  data: Partial<ExerciseUnitInterface>,
) => ExerciseUnitService.updateExerciseUnit(id, data).then((r) => r.data);
