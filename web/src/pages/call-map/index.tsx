import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Call } from "@/types/call";
import { CallList } from "@/components/map/call-list";
import { CallMap } from "@/components/map/call-map";
import type { MapRef } from "react-map-gl/mapbox";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetchChamados = async (): Promise<{ data: Call[] }> => {
  const response = await fetch(`${BACKEND_URL}/api/calls`, { credentials: 'include' });
  if (!response.ok) throw new Error('Erro ao buscar chamados');
  return response.json();
};

export function MapPage() {
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);

  const mapRef = useRef<MapRef>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['chamadosMapa'],
    queryFn: fetchChamados,
  });

  const chamados = data?.data ?? [];

  useEffect(() => {
    if (!selectedCallId) return;

    const selectedCall = chamados.find(c => c.nrChamado === selectedCallId);
    if (!selectedCall) return;

    const parseCoordinate = (coord: string) => parseFloat(coord.replace(',', '.'));
    const latitude = parseCoordinate(selectedCall.hospital.nrLatitude);
    const longitude = parseCoordinate(selectedCall.hospital.nrLongitude);

    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      duration: 2000
    });

  }, [selectedCallId, chamados]); 


  if (isLoading) return <div>Carregando mapa e chamados...</div>;
  if (isError) return <div>Erro ao carregar os dados.</div>;


  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      <div className="md:col-span-2 lg:col-span-3 h-full">
        <CallMap 
          mapRef={mapRef}
          calls={chamados} 
          selectedCallId={selectedCallId}
          onSelectCall={setSelectedCallId}
        />
      </div>

      <div className="h-full">
        <CallList 
          calls={chamados} 
          selectedCallId={selectedCallId}
          onSelectCall={setSelectedCallId}
        />
      </div>
    </div>
  );
}