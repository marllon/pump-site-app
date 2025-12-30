import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { CatheterRecord, CATHETER_LOCATIONS } from '../types';
import { StorageService } from '../utils/storage';
import { SuggestionService } from '../utils/suggestion';

interface HistoryScreenProps {
  navigation: any;
}

interface HistoryItem extends CatheterRecord {
  locationName: string;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<Map<string, number>>(new Map());
  const [averageInterval, setAverageInterval] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await StorageService.getHistory();
      
      // Converter registros adicionando nome da localização
      const historyWithNames: HistoryItem[] = historyData.records.map(record => {
        const location = CATHETER_LOCATIONS.find(loc => loc.id === record.locationId);
        return {
          ...record,
          locationName: location?.displayName || 'Localização desconhecida',
        };
      }).reverse(); // Mais recentes primeiro

      setHistory(historyWithNames);
      
      // Calcular estatísticas
      const usageStats = SuggestionService.getUsageStats(historyData.records);
      setStats(usageStats);
      
      const avgInterval = SuggestionService.getAverageChangeInterval(historyData.records);
      setAverageInterval(avgInterval);
      
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatInterval = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  const handleExportData = async () => {
    try {
      const exportData = await StorageService.exportData();
      const message = `Dados do Controle de Cateter - Bomba de Insulina\n\nTotal de registros: ${history.length}\nIntervalo médio: ${formatInterval(averageInterval)}\n\nDados completos em JSON:\n\n${exportData}`;
      
      await Share.share({
        message,
        title: 'Dados do Controle de Cateter',
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja apagar todo o histórico? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearHistory();
              setHistory([]);
              setStats(new Map());
              setAverageInterval(0);
              Alert.alert('Sucesso', 'Histórico apagado com sucesso.');
            } catch {
              Alert.alert('Erro', 'Não foi possível apagar o histórico.');
            }
          },
        },
      ]
    );
  };

  const renderHistoryItem = ({ item, index }: { item: HistoryItem; index: number }) => {
    const isRecent = index < 3;
    
    return (
      <View style={[styles.historyItem, isRecent && styles.recentItem]}>
        <View style={styles.historyHeader}>
          <Text style={styles.locationName}>{item.locationName}</Text>
          <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
        </View>
        
        {item.notes && (
          <Text style={styles.historyNotes}>📝 {item.notes}</Text>
        )}
        
        {isRecent && (
          <Text style={styles.recentLabel}>Recente</Text>
        )}
      </View>
    );
  };

  const renderStatItem = (locationId: string, count: number) => {
    const location = CATHETER_LOCATIONS.find(loc => loc.id === locationId);
    if (!location || count === 0) return null;
    
    const percentage = history.length > 0 ? (count / history.length) * 100 : 0;
    
    return (
      <View key={locationId} style={styles.statItem}>
        <Text style={styles.statLocation}>{location.displayName}</Text>
        <View style={styles.statBar}>
          <View style={[styles.statProgress, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.statCount}>{count}x ({Math.round(percentage)}%)</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📊 Histórico</Text>
        <View style={styles.headerSpacer} />
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
          <Text style={styles.emptySubtext}>
            Faça sua primeira aplicação de cateter para começar a acompanhar o histórico.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          ListHeaderComponent={
            <View>
              {/* Estatísticas gerais */}
              <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>📈 Estatísticas</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{history.length}</Text>
                    <Text style={styles.statLabel}>Aplicações</Text>
                  </View>
                  
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {averageInterval > 0 ? formatInterval(averageInterval) : '-'}
                    </Text>
                    <Text style={styles.statLabel}>Intervalo Médio</Text>
                  </View>
                </View>
              </View>

              {/* Estatísticas por localização */}
              <View style={styles.locationStats}>
                <Text style={styles.statsTitle}>📍 Uso por Localização</Text>
                {Array.from(stats.entries()).map(([locationId, count]) =>
                  renderStatItem(locationId, count)
                )}
              </View>

              <Text style={styles.historyTitle}>📋 Registros</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={handleExportData}
              >
                <Text style={styles.exportButtonText}>📤 Exportar Dados</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearHistory}
              >
                <Text style={styles.clearButtonText}>🗑️ Limpar Histórico</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#3498db',
  },
  backButton: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: '#f8f9fa',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  locationStats: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    marginBottom: 12,
  },
  statLocation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statBar: {
    height: 8,
    backgroundColor: '#dee2e6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  statProgress: {
    height: '100%',
    backgroundColor: '#3498db',
  },
  statCount: {
    fontSize: 12,
    color: '#6c757d',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  recentItem: {
    borderColor: '#3498db',
    backgroundColor: '#f8f9ff',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  historyNotes: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
    marginTop: 8,
  },
  recentLabel: {
    fontSize: 10,
    color: '#3498db',
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#17a2b8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 60,
  },
});