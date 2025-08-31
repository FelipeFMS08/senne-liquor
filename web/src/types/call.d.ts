import type { Doctor } from "./doctor";
import type { Hospital } from "./hospital";

export type Call = {
  nrChamado: number;
  cdHospital: number;
  ieTipoChamado: string;
  nmPaciente: string;
  ieSexo: string;
  ieStatusChamado: string;
  medico: Doctor | null;        
  hospital: Hospital;          
} 

export type CallSubmitData = {
  cdHospital: number;
  ieTipoChamado: string;  
  nmPaciente: string;
  ieSexo: string;
  ieStatusChamado: string;
  cdMedico?: number | null;   
}
