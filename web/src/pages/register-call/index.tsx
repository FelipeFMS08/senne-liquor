import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Call, CallSubmitData } from "@/types/call";
import type { Hospital } from "@/types/hospital";
import type { Doctor } from "@/types/doctor";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { CallForm } from "@/components/register-call/call-form";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = {
  fetchCallById: async (id: string): Promise<Call> => {
    const res = await fetch(`${BACKEND_URL}/api/calls/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Falha ao buscar dados do chamado");
    const data = await res.json();
    return data;
  },
  createCall: async (data: CallSubmitData): Promise<Call> => {
    const res = await fetch(`${BACKEND_URL}/api/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Falha ao criar chamado");
    return res.json();
  },
  updateCall: async ({
    id,
    data,
  }: {
    id: string;
    data: CallSubmitData;
  }): Promise<Call> => {
    const res = await fetch(`${BACKEND_URL}/api/calls/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Falha ao atualizar chamado");
    return res.json();
  },
  deleteCall: async (id: string): Promise<void> => {
    const res = await fetch(`${BACKEND_URL}/api/calls/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Falha ao deletar chamado");
  },
  fetchHospitals: async (): Promise<Hospital[]> => {
    const res = await fetch(`${BACKEND_URL}/api/hospitals`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Falha ao buscar hospitais");
    const data = await res.json();
    return data.data;
  },
  fetchMedicos: async (): Promise<Doctor[]> => {
    const res = await fetch(`${BACKEND_URL}/api/doctors`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Falha ao buscar médicos");
    const data = await res.json();
    return data.data;
  },
};

export function RegisterCallPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: callData, isLoading: isLoadingCall } = useQuery({
    queryKey: ["chamado", id],
    queryFn: () => apiClient.fetchCallById(id!),
    enabled: isEditMode,
  });

  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery({
    queryKey: ["hospitals"],
    queryFn: apiClient.fetchHospitals,
  });
  const { data: medicos, isLoading: isLoadingMedicos } = useQuery({
    queryKey: ["medicos"],
    queryFn: apiClient.fetchMedicos,
  });

  const { mutate: saveCall, isPending: isSaving } = useMutation({
    mutationFn: (formData: CallSubmitData) =>
      isEditMode
        ? apiClient.updateCall({ id, data: formData })
        : apiClient.createCall(formData),
    onSuccess: () => {
      toast.success(
        `Chamado ${isEditMode ? "atualizado" : "criado"} com sucesso.`
      );
      queryClient.invalidateQueries({ queryKey: ["chamados"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteCall, isPending: isDeleting } = useMutation({
    mutationFn: () => apiClient.deleteCall(id!),
    onSuccess: () => {
      toast.success("Chamado removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["chamados"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isLoading = isLoadingCall || isLoadingHospitals || isLoadingMedicos;
  if (isLoading)
    return (
      <div className="container py-10">Carregando dados do formulário...</div>
    );

  return (
    <div className="w-screen min-h-screen bg-zinc-100 flex items-center justify-center"> 
      <div className="container py-20">
        <CallForm
          initialData={callData}
          hospitals={hospitals || []}
          medicos={medicos || []}
          onSubmit={saveCall}
          isSubmitting={isSaving}
          isEditMode={isEditMode}
        />

        {isEditMode && (
          <div className="max-w-2xl mx-auto mt-6 flex justify-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Deletando..." : "Deletar Chamado"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você tem certeza absoluta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Isso removerá
                    permanentemente o chamado dos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteCall()}>
                    Sim, deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
