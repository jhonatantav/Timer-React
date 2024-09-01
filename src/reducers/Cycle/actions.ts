import { ICycle } from "../../interfaces/CyclesInterfaces";

export enum ActionTypes {
  CREATE_CYCLE = "CREATE_CYCLE",
  INTERRUPT_CYCLE = "INTERRUPT_CYCLE",
  FINISHED_CYCLE = "FINISHED_CYCLE",
}

export function addNewCycleAction(newCycle: ICycle) {
  return {
    type: ActionTypes.CREATE_CYCLE,
    payload: {
      newCycle,
    },
  };
}

export function finishedCycleAction() {
  return {
    type: ActionTypes.FINISHED_CYCLE,
  };
}

export function interruptCycleAction() {
  return {
    type: ActionTypes.INTERRUPT_CYCLE,
  };
}
