import { ReactNode } from "react";

export interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export interface ICreateCycleData {
  task: string;
  minutesAmount: number;
}

export interface ICyclesContextData {
  cycles: ICycle[];
  activeCycle: ICycle | undefined;
  activeCycleId: string | null;
  totalSecondPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: ICreateCycleData) => void;
  InterruptCurrentCycle: () => void;
}

export interface CycleContextProviderProps {
  children: ReactNode;
}

export interface IInitialState {
  cycles: ICycle[];
  activeCycleId: string | null;
}
