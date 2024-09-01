import { ReactNode } from "react";

export interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

export interface CyclesContextData {
  cycles: ICycle[];
  activeCycle: ICycle | undefined;
  activeCycleId: string | null;
  totalSecondPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  InterruptCurrentCycle: () => void;
}

export interface CycleContextProviderProps {
  children: ReactNode;
}

export interface CycleStates {
  cycles: ICycle[];
  activeCycleId: string | null;
}
