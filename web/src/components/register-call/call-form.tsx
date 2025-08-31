import type { Doctor } from "@/types/doctor";
import type { Hospital } from "@/types/hospital";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const formSchema = z.object({
  nmPaciente: z.string().min(3, "Nome do paciente é obrigatório"),
  cdHospital: z.number("Selecione um hospital."),
  ieTipoChamado: z.string("Selecione um tipo de chamado."),
  ieSexo: z.string("Selecione o sexo do paciente."),
  ieStatusChamado: z.string("Selecione um status do chamado."),
  cdMedico: z.number().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface CallFormProps {
  initialData?: Partial<FormValues>;
  hospitals: Hospital[];
  medicos: Doctor[];
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export function CallForm({ initialData, hospitals, medicos, onSubmit, isSubmitting, isEditMode }: CallFormProps) {
    const navigate = useNavigate();
    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { 
      nmPaciente: "",
    },
  });
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Editar Chamado' : 'Registrar Novo Chamado'}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="nmPaciente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Paciente</FormLabel>
                <FormControl><Input placeholder="Nome completo do paciente" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cdHospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione o hospital de origem" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {hospitals.map(hospital => (
                      <SelectItem key={hospital.cdHospital} value={String(hospital.cdHospital)}>
                        {hospital.nmHospital}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ieTipoChamado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="U">Urgente</SelectItem>
                      <SelectItem value="E">Emergência</SelectItem>
                      <SelectItem value="N">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ieSexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Sexo" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ieStatusChamado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="A">Aberto</SelectItem>
                      <SelectItem value="P">Em Progresso</SelectItem>
                      <SelectItem value="F">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cdMedico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico Responsável (Opcional)</FormLabel>
                <Select onValueChange={(value) => field.onChange(value ? Number(value) : null)} defaultValue={String(field.value ?? '')}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Atribuir a um médico" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {/* Opção para limpar a seleção */}
                    <SelectItem value="null">Nenhum</SelectItem> 
                    {medicos.map(medico => (
                      <SelectItem key={medico.cdMedico} value={String(medico.cdMedico)}>
                        {medico.nmMedico}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Chamado"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
