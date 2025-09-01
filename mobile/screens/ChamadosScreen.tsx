import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, SectionList, StyleSheet, SafeAreaView, ActivityIndicator, ListRenderItemInfo, SectionListData, RefreshControl } from 'react-native';
import type { ChamadosScreenProps } from '../navigation/types';
import { fetchCallsByDoctor, CallDTO } from '../api/calls';
import { authClient } from '../api/auth-client';

const Cores = {
  verdePrincipal: '#86A789',
  fundo: '#F5F5F5',
  texto: '#333',
  header: '#444',
  separador: '#E0E0E0'
};

interface IChamadoSection {
  title: string;
  data: CallDTO[];
}

function groupByHospital(calls: CallDTO[]): IChamadoSection[] {
  const map = new Map<string, CallDTO[]>();
  for (const c of calls) {
    const key = c.hospitalName || 'Sem Hospital';
    const bucket = map.get(key) ?? [];
    bucket.push(c);
    map.set(key, bucket);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

const ChamadosScreen = ({ route }: ChamadosScreenProps) => {
  const { doctorId } = route.params;
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [calls, setCalls] = useState<CallDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sections = useMemo(() => groupByHospital(calls), [calls]);

  async function load(token: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCallsByDoctor(doctorId, token);
      setCalls(data);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar chamados');
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.session?.token) {
      load(session.session.token);
    }
  }, [doctorId, session]);

  const onRefresh = async () => {
    if (session?.session?.token) {
      setRefreshing(true);
      try { await load(session.session.token); }
      finally { setRefreshing(false); }
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<CallDTO>) => (
    <View style={styles.item}>
      <Text style={styles.itemHospital}>Paciente: {item.patientName}</Text>
      <Text style={styles.itemStatus}>Status: {String(item.status)} • Tipo: {item.type} • Sexo: {item.sex}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: SectionListData<CallDTO, IChamadoSection>}) => (
    <Text style={styles.header}>{section.title}</Text>
  );

  if (loading || isSessionLoading) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color={Cores.verdePrincipal} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.tituloPagina}>Meus Chamados</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Cores.fundo, },
  centralizado: { justifyContent: 'center', alignItems: 'center', },
  tituloPagina: { fontSize: 24, fontWeight: 'bold', color: Cores.header, padding: 20, paddingBottom: 10, },
  header: { fontSize: 18, fontWeight: 'bold', backgroundColor: '#EAEAEA', paddingVertical: 10, paddingHorizontal: 20, color: Cores.header, },
  item: { backgroundColor: 'white', padding: 20, },
  itemHospital: { fontSize: 16, fontWeight: '500', color: Cores.texto, },
  itemStatus: { fontSize: 14, color: '#666', marginTop: 5, },
  separador: { height: 1, width: '100%', backgroundColor: Cores.separador, },
  error: { color: 'red', marginHorizontal: 20, marginBottom: 8 },
});

export default ChamadosScreen;