import { createContext, useReducer, useState } from "react";
import {
  CreateCycleData,
  CycleContextProviderProps,
  CyclesContextData,
  CycleStates,
  ICycle,
} from "../interfaces/CyclesInterfaces";
import { cycleReducer } from "../reducers/Cycle/CycleReducer";
import {
  addNewCycleAction,
  finishedCycleAction,
  interruptCycleAction,
} from "../reducers/Cycle/actions";

export const CyclesContext = createContext({} as CyclesContextData);

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cycleReducer, {
    cycles: [],
    activeCycleId: null,
  } as CycleStates);

  const [totalSecondPassed, setTotalSecondPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setTotalSecondPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(finishedCycleAction());
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));
    setTotalSecondPassed(0);
  }

  function InterruptCurrentCycle() {
    dispatch(interruptCycleAction());
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
