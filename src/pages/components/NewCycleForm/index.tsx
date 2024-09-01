import { min, max } from "date-fns";
import { id } from "date-fns/locale";
import { TaskInput, MinutsInput, FormContainer } from "../../Home/styles";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function NewCycleForm() {
  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod
      .number()
      .min(1, "O tempo mínimo é de 5 minutos")
      .max(60, "O tempo máximo é de 60 minutos"),
  });

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

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
