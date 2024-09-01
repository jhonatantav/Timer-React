import { createContext, useEffect, useReducer, useState } from "react";
import {
  ICreateCycleData,
  CycleContextProviderProps,
  ICyclesContextData,
  IInitialState,
  ICycle,
} from "../interfaces/CyclesInterfaces";
import { cycleReducer } from "../reducers/Cycle/reducers";
import {
  addNewCycleAction,
  finishedCycleAction,
  interruptCycleAction,
} from "../reducers/Cycle/actions";
import { differenceInSeconds } from "date-fns";

export const CyclesContext = createContext({} as ICyclesContextData);

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: null,
    } as IInitialState,
    (CycleStates) => {
      const storedStateAsJSON = localStorage.getItem(
        "@timer-react:cycles-state-1.0.0"
      );

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return CycleStates;
    }
  );
  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [totalSecondPassed, setTotalSecondPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@timer-react:cycles-state-1.0.0", stateJSON);
  }, [cyclesState]);

  function setSecondsPassed(seconds: number) {
    setTotalSecondPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(finishedCycleAction());
  }

  function createNewCycle(data: ICreateCycleData) {
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
