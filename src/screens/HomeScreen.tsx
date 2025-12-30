import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { BodyMap } from '../components/BodyMap';
import { CatheterLocation, CatheterRecord, CATHETER_LOCATIONS } from '../types';
import { StorageService } from '../utils/storage';
import { SuggestionService } from '../utils/suggestion';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState<CatheterLocation | undefined>();
  const [suggestedLocation, setSuggestedLocation] = useState<CatheterLocation | undefined>();
  const [lastLocation, setLastLocation] = useState<CatheterLocation | undefined>();
  const [history, setHistory] = useState<CatheterRecord[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const historyData = await StorageService.getHistory();
      setHistory(historyData.records);

      // Encontrar última localização
      if (historyData.lastLocationId) {
        const lastLoc = CATHETER_LOCATIONS.find(loc => loc.id === historyData.lastLocationId);
        setLastLocation(lastLoc);
      }

      // Obter sugestão
      if (historyData.records.length > 0) {
        const suggestion = SuggestionService.getNextSuggestion(historyData.records);
        setSuggestedLocation(suggestion);
        setSelectedLocation(suggestion); // Auto-selecionar a sugestão
      } else {
        // Primeira vez usando o app
        const defaultLocation = CATHETER_LOCATIONS.find(loc => loc.id === 'abdomen_left')!;
        setSuggestedLocation(defaultLocation);
        setSelectedLocation(defaultLocation);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados salvos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!selectedLocation) {
      Alert.alert('Atenção', 'Por favor, selecione uma localização.');
      return;
    }

    try {
      const newRecord: CatheterRecord = {
        id: Date.now().toString(),
        locationId: selectedLocation.id,
        date: new Date(),
        notes: notes.trim() || undefined,
      };

      await StorageService.saveRecord(newRecord);
      
      Alert.alert(
        'Sucesso!',
        `Cateter aplicado em: ${selectedLocation.displayName}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setNotes('');
              loadData(); // Recarregar dados e obter nova sugestão
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar o registro.');
    }
  };

  const handleAddNotes = () => {
    setShowNotesModal(true);
  };



  const getTimeSinceLastChange = () => {
    if (!history.length) return null;
    
    const lastRecord = history[history.length - 1];
    const now = new Date();
    const diff = now.getTime() - lastRecord.date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours}h atrás`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h atrás`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🩺 Controle de Cateter</Text>
        <Text style={styles.subtitle}>Bomba de Insulina</Text>
      </View>

      {/* Informações da última aplicação */}
      {lastLocation && (
        <View style={styles.lastApplicationCard}>
          <Text style={styles.cardTitle}>Última Aplicação</Text>
          <Text style={styles.lastLocationText}>
            📍 {lastLocation.displayName}
          </Text>
          <Text style={styles.timeText}>
            ⏰ {getTimeSinceLastChange()}
          </Text>
        </View>
      )}

      {/* Mapa corporal */}
      <BodyMap
        selectedLocation={selectedLocation}
        suggestedLocation={suggestedLocation}
        onLocationSelect={setSelectedLocation}
      />

      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.notesButton}
          onPress={handleAddNotes}
        >
          <Text style={styles.notesButtonText}>
            {notes ? '📝 Editar Observações' : '📝 Adicionar Observações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveRecord}
        >
          <Text style={styles.saveButtonText}>
            ✅ Aplicar Cateter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resumo de observações */}
      {notes && (
        <View style={styles.notesPreview}>
          <Text style={styles.notesPreviewLabel}>Observações:</Text>
          <Text style={styles.notesPreviewText}>{notes}</Text>
        </View>
      )}

      {/* Botão para histórico */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyButtonText}>
          📊 Ver Histórico Completo
        </Text>
      </TouchableOpacity>

      {/* Modal de observações */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNotesModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Observações</Text>
            <TouchableOpacity onPress={() => setShowNotesModal(false)}>
              <Text style={styles.modalSaveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Digite suas observações sobre esta aplicação (opcional)..."
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>
      </Modal>
    </ScrollView>
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
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  lastApplicationCard: {
    backgroundColor: '#f8f9fa',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  lastLocationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  notesButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  notesButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesPreview: {
    margin: 16,
    marginTop: 0,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  notesPreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  notesPreviewText: {
    fontSize: 14,
    color: '#6c757d',
  },
  historyButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6c757d',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  notesInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
});