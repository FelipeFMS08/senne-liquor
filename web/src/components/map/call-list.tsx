import { Button } from "@/components/ui/button";
import type { Call } from '@/types/call';

interface CallListProps {
  calls: Call[];
  selectedCallId: number | null;
  onSelectCall: (callId: number | null) => void;
}

export function CallList({ calls, selectedCallId, onSelectCall }: CallListProps) {
  return (
    <div className="h-full w-full bg-card p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Active Calls</h2>
      
      <div className="flex items-center space-x-2 mb-4">
        <Button size="sm" variant={true ? "default" : "outline"}>Todos ({calls.length})</Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {calls.map(call => (
          <div
            key={call.nrChamado}
            className={`p-3 rounded-lg border cursor-pointer
              ${selectedCallId === call.nrChamado ? 'bg-accent border-primary' : 'bg-background'}
            `}
            onClick={() => onSelectCall(call.nrChamado)}
          >
            <p className="font-semibold">{call.nmPaciente}</p>
            <p className="text-sm text-muted-foreground">{call.hospital.nmHospital}</p>
          </div>
        ))}
      </div>
    </div>
  )
}