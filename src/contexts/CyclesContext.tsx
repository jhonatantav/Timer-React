import { createContext, useReducer, useState } from "react";
import {
  CreateCycleData,
  CycleContextProviderProps,
  CyclesContextData,
  CycleStates,
  ICycle,
} from "../interfaces/CyclesInterfaces";

export const CyclesContext = createContext({} as CyclesContextData);

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CycleStates, action: any) => {
      switch (action.type) {
        case "CREATE_CYCLE": {
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          };
        }
        case "INTERRUPT_CYCLE": {
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
        case "FINISHED_CYCLE": {
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
    },
    { cycles: [], activeCycleId: null }
  );

  const [totalSecondPassed, setTotalSecondPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setTotalSecondPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: "FINISHED_CYCLE",
      payload: {
        activeCycleId,
      },
    });
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: "CREATE_CYCLE",
      payload: {
        newCycle,
      },
    });
    setTotalSecondPassed(0);
  }

  function InterruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CYCLE",
      payload: {
        activeCycleId,
      },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        totalSecondPassed,
        setSecondsPassed,
        createNewCycle,
        InterruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
