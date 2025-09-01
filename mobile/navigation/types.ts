import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Chamados: { doctorId: string };
};

export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;
export type ChamadosScreenProps = StackScreenProps<RootStackParamList, 'Chamados'>;