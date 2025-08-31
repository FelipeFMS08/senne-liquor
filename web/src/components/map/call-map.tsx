import type { Call } from "@/types/call";
import type { Ref } from "react";
import Map, { Marker, NavigationControl, Popup, type MapRef } from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN!;

interface CallMapProps {
   mapRef: Ref<MapRef>;
  calls: Call[];
  selectedCallId: number | null;
  onSelectCall: (callId: number | null) => void;
}

export function CallMap({ calls, selectedCallId, onSelectCall, mapRef}: CallMapProps) {
    const parseCoordinate = (coord: string) => parseFloat(coord.replace(',', '.'));
    const selectedCall = calls.find(c => c.nrChamado === selectedCallId);

    return (
      <div className="h-full w-full">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: -23.550520, 
          longitude: -46.633308,
          zoom: 10,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11" 
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="bottom-right" />
        
        {calls.map(call => (
          <Marker
            key={call.nrChamado}
            longitude={parseCoordinate(call.hospital.nrLongitude)}
            latitude={parseCoordinate(call.hospital.nrLatitude)}
            onClick={() => onSelectCall(call.nrChamado)}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white cursor-pointer transition-all
              ${selectedCallId === call.nrChamado ? 'bg-primary scale-150 shadow-lg' : 'bg-secondary'}
            `}>
            </div>
          </Marker>
        ))}

       {selectedCall && (
          <Popup
            longitude={parseCoordinate(selectedCall.hospital.nrLongitude)}
            latitude={parseCoordinate(selectedCall.hospital.nrLatitude)}
            onClose={() => onSelectCall(null)}
            closeOnClick={false} 
            anchor="bottom" 
          >
            <div className="p-1">
              <h3 className="font-bold text-base">{selectedCall.nmPaciente}</h3>
              <p className="text-sm">{selectedCall.hospital.nmHospital}</p>
              <p className="text-xs text-muted-foreground">Status: {selectedCall.ieStatusChamado}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
    )
}