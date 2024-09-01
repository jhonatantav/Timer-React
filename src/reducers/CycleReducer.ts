import { CycleStates } from "../interfaces/CyclesInterfaces";

export enum ActionTypes {
  CREATE_CYCLE = "CREATE_CYCLE",
  INTERRUPT_CYCLE = "INTERRUPT_CYCLE",
  FINISHED_CYCLE = "FINISHED_CYCLE",
}

export function cycleReducer(state: CycleStates, action: any) {
  switch (action.type) {
    case ActionTypes.CREATE_CYCLE: {
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      };
    }
    case ActionTypes.INTERRUPT_CYCLE: {
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return {
              ...cycle,
              interruptedDate: new Date(),
            };
          } else {
            return cycle;
          }
        }),

        activeCycleId: null,
      };
    }
    case ActionTypes.FINISHED_CYCLE: {
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return {
              ...cycle,
              finishedDate: new Date(),
            };
          } else {
            return cycle;
          }
        }),

        activeCycleId: null,
      };
    }
    default:
      return state;
  }
}
