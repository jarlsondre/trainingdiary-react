import SetService, {
  type NewSetData,
  type UpdateSetData,
} from "../services/set.service";

export const createSet = (data: NewSetData) =>
  SetService.addSet(data).then((r) => r.data);

export const deleteSet = (id: number): Promise<number> =>
  SetService.deleteSet(id).then(() => id);

export const updateSet = (data: UpdateSetData) =>
  SetService.updateSet(data).then((r) => r.data);
