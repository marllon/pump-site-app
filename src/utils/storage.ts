import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatheterRecord, CatheterHistory } from '../types';

const STORAGE_KEY = '@catheter_history';

export class StorageService {
  static async getHistory(): Promise<CatheterHistory> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) {
        const parsed = JSON.parse(jsonValue);
        // Converter strings de data para objetos Date
        const records = parsed.records.map((record: any) => ({
          ...record,
          date: new Date(record.date),
        }));
        return { ...parsed, records };
      }
      return { records: [] };
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return { records: [] };
    }
  }

  static async saveRecord(record: CatheterRecord): Promise<void> {
    try {
      const history = await this.getHistory();
      const newHistory: CatheterHistory = {
        records: [...history.records, record],
        lastLocationId: record.locationId,
      };
      
      // Manter apenas os últimos 100 registros
      if (newHistory.records.length > 100) {
        newHistory.records = newHistory.records.slice(-100);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      throw error;
    }
  }

  static async getLastLocation(): Promise<string | null> {
    try {
      const history = await this.getHistory();
      return history.lastLocationId || null;
    } catch (error) {
      console.error('Erro ao obter última localização:', error);
      return null;
    }
  }

  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      throw error;
    }
  }

  static async exportData(): Promise<string> {
    try {
      const history = await this.getHistory();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }
}