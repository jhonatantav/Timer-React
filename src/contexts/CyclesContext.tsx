import { createContext, useReducer, useState } from "react";
import {
  CreateCycleData,
  CycleContextProviderProps,
  CyclesContextData,
  ICycle,
} from "../interfaces/CyclesInterfaces";

export const CyclesContext = createContext({} as CyclesContextData);

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cycles, dispatch] = useReducer((state: ICycle[], action: any) => {
    if (action.type === "CREATE_CYCLE") {
      return [...state, action.payload.newCycle];
    }

    return state;
  }, []);

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [totalSecondPassed, setTotalSecondPassed] = useState(0);
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
    // dispatch((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return {
    //         ...cycle,
    //         finishedDate: new Date(),
    //       };
    //     } else {
    //       return cycle;
    //     }
    //   })
    // );
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
    setActiveCycleId(id);
    setTotalSecondPassed(0);
  }

  function InterruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CYCLE",
      payload: {
        activeCycleId,
      },
    });

    // dispatch((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return {
    //         ...cycle,
    //         interruptedDate: new Date(),
    //       };
    //     } else {
    //       return cycle;
    //     }
    //   })
    // );
    setActiveCycleId(null);
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
