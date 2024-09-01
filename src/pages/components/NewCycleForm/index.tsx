import { TaskInput, MinutsInput, FormContainer } from "../../Home/styles";
import { useContext } from "react";
import { CyclesContext } from "../../Home";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
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
  );
}
