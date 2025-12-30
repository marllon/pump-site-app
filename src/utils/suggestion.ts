import { CatheterLocation, CatheterRecord, CATHETER_LOCATIONS } from '../types';

export class SuggestionService {
  /**
   * Calcula a próxima localização sugerida baseada no histórico
   * Algoritmo considera:
   * 1. Evitar a última localização usada
   * 2. Priorizar localizações menos utilizadas recentemente
   * 3. Alternar entre zonas diferentes
   * 4. Alternar entre lados (esquerdo/direito)
   */
  static getNextSuggestion(history: CatheterRecord[]): CatheterLocation {
    if (history.length === 0) {
      // Se não há histórico, sugere abdômen esquerdo como padrão
      return CATHETER_LOCATIONS.find(loc => loc.id === 'abdomen_left')!;
    }

    const lastRecord = history[history.length - 1];
    const lastLocation = CATHETER_LOCATIONS.find(loc => loc.id === lastRecord.locationId);
    
    if (!lastLocation) {
      return CATHETER_LOCATIONS[0];
    }

    // Obter registros dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRecords = history.filter(record => record.date >= thirtyDaysAgo);
    
    // Contar uso por localização nos últimos registros
    const locationUsage = new Map<string, number>();
    CATHETER_LOCATIONS.forEach(loc => locationUsage.set(loc.id, 0));
    
    recentRecords.forEach(record => {
      const count = locationUsage.get(record.locationId) || 0;
      locationUsage.set(record.locationId, count + 1);
    });

    // Filtrar localizações candidatas
    let candidates = CATHETER_LOCATIONS.filter(location => {
      // Evitar a mesma localização da última vez
      if (location.id === lastLocation.id) return false;
      
      // Evitar o mesmo lado se possível
      if (recentRecords.length >= 2) {
        const lastTwoSameSide = recentRecords
          .slice(-2)
          .every(record => {
            const loc = CATHETER_LOCATIONS.find(l => l.id === record.locationId);
            return loc && loc.side === lastLocation.side;
          });
        
        if (lastTwoSameSide && location.side === lastLocation.side) {
          return false;
        }
      }
      
      return true;
    });

    if (candidates.length === 0) {
      candidates = CATHETER_LOCATIONS.filter(loc => loc.id !== lastLocation.id);
    }

    // Priorizar por zona diferente
    const differentZoneCandidates = candidates.filter(loc => loc.zone !== lastLocation.zone);
    if (differentZoneCandidates.length > 0) {
      candidates = differentZoneCandidates;
    }

    // Escolher a localização menos utilizada entre os candidatos
    let bestCandidate = candidates[0];
    let minUsage = locationUsage.get(bestCandidate.id) || 0;

    candidates.forEach(candidate => {
      const usage = locationUsage.get(candidate.id) || 0;
      if (usage < minUsage) {
        minUsage = usage;
        bestCandidate = candidate;
      }
    });

    return bestCandidate;
  }

  /**
   * Obtém estatísticas de uso das localizações
   */
  static getUsageStats(history: CatheterRecord[]): Map<string, number> {
    const stats = new Map<string, number>();
    
    CATHETER_LOCATIONS.forEach(loc => stats.set(loc.id, 0));
    
    history.forEach(record => {
      const count = stats.get(record.locationId) || 0;
      stats.set(record.locationId, count + 1);
    });

    return stats;
  }

  /**
   * Calcula o tempo médio entre trocas
   */
  static getAverageChangeInterval(history: CatheterRecord[]): number {
    if (history.length < 2) return 0;

    const intervals: number[] = [];
    
    for (let i = 1; i < history.length; i++) {
      const current = history[i].date.getTime();
      const previous = history[i - 1].date.getTime();
      const interval = (current - previous) / (1000 * 60 * 60); // em horas
      intervals.push(interval);
    }

    const sum = intervals.reduce((acc, val) => acc + val, 0);
    return sum / intervals.length;
  }
}