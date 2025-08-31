import { getColumns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Toaster } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL!;

const fetchChamados = async (
  page = 1,
  limit = 10,
  status = "",
  search = ""
) => {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status: status,
    search: search,
  });

  const response = await fetch(
    `${BACKEND_URL}/api/calls?${queryParams.toString()}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erro ao buscar os chamados");
  return response.json();
};

export function Dashboard() {
  const {data: session, isPending} = authClient.useSession();
  const navigate = useNavigate();
      if (isPending) {
        return <div>Carregando...</div>;
      }
    
      const isAuthenticated = !session;
      if (isAuthenticated) {
        return <Navigate to="/login" replace />;
      }
      
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["chamados", pageIndex, pageSize, statusFilter, searchTerm],
    queryFn: () =>
      fetchChamados(pageIndex + 1, pageSize, statusFilter, searchTerm),
  });

  const chamados = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

    const columns = getColumns(navigate);

  const table = useReactTable({
    data: chamados,
    columns,
    pageCount: totalPages,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  if (isError) return <span>Erro: {error.message}</span>;

  return (
    <main className="min-h-screen w-screen bg-zinc-200 pt-20 px-10">
      <div className="flex w-full justify-between">
        <h1 className="font-bold text-3xl">Painel de Chamados</h1>
        <Button variant="secondary" onClick={() => navigate('/call/new')} className="text-white font-bold">Novo Chamado</Button>
      </div>

      <div className="flex items-center space-x-4 my-4 mt-10">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value === "all" ? "" : value);
          }}
        >
          <SelectTrigger className="w-[180px] bg-zinc-50 border border-zinc-300 py-5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="A">Ativo</SelectItem>
            <SelectItem value="P">Em Progresso</SelectItem>
            <SelectItem value="F">Finalizado</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Buscar por paciente..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-full bg-zinc-50 border border-zinc-300 py-5"
        />
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <DataTable table={table} columns={columns} />
      )}

      <Toaster />
    </main>
  );
}
