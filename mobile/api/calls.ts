import { API_BASE_URL, DOCTORS_CALLS_PATH } from './config';

export type CallDTO = {
  id: string; 
  hospitalName: string;
  patientName: string;
  status: string; 
  type: string;   
  sex: string;    
  hospitalId: number;
  latitude?: string;
  longitude?: string;
};

export interface BackendCall {
  nrChamado: number;
  nmPaciente: string;
  ieTipoChamado: string;
  ieStatusChamado: string;
  ieSexo: string;
  hospital: {
    cdHospital: number;
    nmHospital: string;
    nrLatitude?: string;
    nrLongitude?: string;
  };
  medico: {
    cdMedico: number;
    nmMedico: string;
  };
}

export interface BackendCallsResponse {
  data: BackendCall[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [k: string]: any;
  };
}

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

function mapStatus(code: string): string {
  switch ((code || '').toUpperCase()) {
    case 'P': return 'Pendente';
    case 'A': return 'Em andamento';
    case 'C': return 'Concluído';
    default: return code;
  }
}

function mapType(code: string): string {
  switch ((code || '').toUpperCase()) {
    case 'E': return 'Emergência';
    case 'U': return 'Urgência';
    default: return code;
  }
}

export async function fetchCallsByDoctor(
  doctorId: string,
  token: string,
  opts?: { signal?: AbortSignal }
): Promise<CallDTO[]> {
  const controller = !opts?.signal ? new AbortController() : undefined;
  const signal = opts?.signal ?? controller?.signal;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const url = `${API_BASE_URL}${DOCTORS_CALLS_PATH}/calls/${encodeURIComponent(doctorId)}`;
  const res = await fetch(url, { method: 'GET', headers, signal, credentials: 'include' }, );
  if (!res.ok) {
    const err: ApiError = new Error(`Failed to fetch calls: ${res.status}`);
    err.status = res.status;
    try { err.data = await res.json(); } catch {}
    throw err;
  }
  const payload: BackendCallsResponse | BackendCall[] = await res.json();
  const list: BackendCall[] = Array.isArray((payload as BackendCallsResponse)?.data)
    ? (payload as BackendCallsResponse).data
    : (Array.isArray(payload) ? (payload as BackendCall[]) : []);

  return list.map((c) => ({
    id: String(c.nrChamado),
    hospitalName: c.hospital?.nmHospital || 'Sem Hospital',
    patientName: c.nmPaciente,
    status: mapStatus(c.ieStatusChamado),
    type: mapType(c.ieTipoChamado),
    sex: c.ieSexo,
    hospitalId: c.hospital?.cdHospital ?? 0,
    latitude: c.hospital?.nrLatitude,
    longitude: c.hospital?.nrLongitude,
  }));
}
