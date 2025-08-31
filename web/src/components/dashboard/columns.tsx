
import type { Call } from "@/types/call";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CopyIcon, MoreHorizontal, Pen } from "lucide-react";
import type { NavigateFunction } from "react-router";

export const getColumns = (navigate: NavigateFunction): ColumnDef<Call>[] => [
  {
    accessorKey: "nrChamado",
    header: "N° Chamado"
  },
  {
    accessorKey: "nmPaciente",
    header: "Paciente",
  },
  {
    accessorKey: "hospital.nmHospital",
    header: "Hospital"
  },
  {
  accessorKey: "ieStatusChamado",
  header: "Status",
  cell: ({ cell }) => {
    const status = cell.getValue() as string; 
    
    if (status === "A") {
      return <Badge variant="default">Ativo</Badge>;
    }
    if (status === "P") {
      return <Badge variant="secondary" className="text-white">Em Progresso</Badge>
    }
    if (status === "F") {
      return <Badge variant="destructive">Finalizado</Badge>;
    }
    return <span>{status}</span>
  },
},
  {
    id: "actions",
    cell: ({ row }) => {
      const chamado = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-bold border-b border-b-zinc-300">Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(chamado.nrChamado))}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copiar Nº do Chamado
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/call/edit/${chamado.nrChamado}`)}>
              <Pen className="mr-2 h-4 w-4" />
              Editar / Ver Detalhes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]