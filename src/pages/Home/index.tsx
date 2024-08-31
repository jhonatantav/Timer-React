import { HandPalm, Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutsInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O tempo mínimo é de 5 minutos")
    .max(60, "O tempo máximo é de 60 minutos"),
});
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });
  const [cycle, setCycle] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [totalSecondPassed, setTotalSecondPassed] = useState(0);

  let interval: number;

  const activeCycle = cycle.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  const currentSecond = activeCycle ? totalSeconds - totalSecondPassed : 0;

  const amountMinutes = Math.floor(currentSecond / 60);

  const amountSeconds = currentSecond % 60;

  useEffect(() => {
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          setCycle((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return {
                  ...cycle,
                  finishedDate: new Date(),
                };
              } else {
                return cycle;
              }
            })
          );

          setTotalSecondPassed(totalSeconds);

          clearInterval(interval);
        } else {
          setTotalSecondPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  const id = String(new Date().getTime());

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycle((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setTotalSecondPassed(0);

    reset();
  }

  function handleStopCycle() {
    setCycle((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

  const minutes = String(amountMinutes).padStart(2, "0");
  const seconds = String(amountSeconds).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
    [minutes, seconds, activeCycle];
  });

  const task = watch("task");
  const isSubmittingDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="Tasks"
            placeholder="Dê um nome para o timer"
            {...register("task")}
            disabled={!!activeCycle}
          />
          <datalist id="tasks">
            <option value="Descanso" />
            <option value="Alongamento" />
          </datalist>

          <label htmlFor="">Durante</label>
          <MinutsInput
            type="number"
            id="minutsAmount"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
            disabled={!!activeCycle}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton onClick={handleStopCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmittingDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
