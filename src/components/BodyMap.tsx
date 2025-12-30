import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CatheterLocation, CATHETER_LOCATIONS } from '../types';

interface BodyMapProps {
  selectedLocation?: CatheterLocation;
  suggestedLocation?: CatheterLocation;
  onLocationSelect: (location: CatheterLocation) => void;
  disabled?: boolean;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedLocation,
  suggestedLocation,
  onLocationSelect,
  disabled = false,
}) => {
  const renderLocationButton = (location: CatheterLocation) => {
    const isSelected = selectedLocation?.id === location.id;
    const isSuggested = suggestedLocation?.id === location.id;
    
    return (
      <TouchableOpacity
        key={location.id}
        style={[
          styles.locationButton,
          isSelected && styles.selectedLocation,
          isSuggested && !isSelected && styles.suggestedLocation,
        ]}
        onPress={() => !disabled && onLocationSelect(location)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.locationText,
            isSelected && styles.selectedText,
            isSuggested && !isSelected && styles.suggestedText,
          ]}
        >
          {location.displayName}
        </Text>
        {isSuggested && !isSelected && (
          <Text style={styles.suggestionLabel}>Sugerido</Text>
        )}
      </TouchableOpacity>
    );
  };

  const abdomenLocations = CATHETER_LOCATIONS.filter(loc => loc.zone === 'abdomen');
  const legLocations = CATHETER_LOCATIONS.filter(loc => loc.zone === 'legs');
  const gluteLocations = CATHETER_LOCATIONS.filter(loc => loc.zone === 'glutes');
  const lumbarLocations = CATHETER_LOCATIONS.filter(loc => loc.zone === 'lumbar');

  return (
    <View style={styles.container}>
      <Text style={styles.zoneTitle}>Mapa Corporal</Text>
      
      {/* Abdômen */}
      <View style={styles.zone}>
        <Text style={styles.zoneLabel}>Abdômen</Text>
        <View style={styles.locationRow}>
          {abdomenLocations.map(renderLocationButton)}
        </View>
      </View>

      {/* Pernas */}
      <View style={styles.zone}>
        <Text style={styles.zoneLabel}>Pernas</Text>
        <View style={styles.locationRow}>
          {legLocations.map(renderLocationButton)}
        </View>
      </View>

      {/* Glúteos */}
      <View style={styles.zone}>
        <Text style={styles.zoneLabel}>Glúteos</Text>
        <View style={styles.locationRow}>
          {gluteLocations.map(renderLocationButton)}
        </View>
      </View>

      {/* Lombar */}
      <View style={styles.zone}>
        <Text style={styles.zoneLabel}>Lombar</Text>
        <View style={styles.locationRow}>
          {lumbarLocations.map(renderLocationButton)}
        </View>
      </View>

      {suggestedLocation && (
        <View style={styles.suggestionInfo}>
          <Text style={styles.suggestionInfoText}>
            💡 Sugestão: {suggestedLocation.displayName}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  zoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2c3e50',
  },
  zone: {
    marginBottom: 20,
  },
  zoneLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e',
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  locationButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
  },
  selectedLocation: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  suggestedLocation: {
    backgroundColor: '#f39c12',
    borderColor: '#e67e22',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
  },
  selectedText: {
    color: '#ffffff',
  },
  suggestedText: {
    color: '#ffffff',
  },
  suggestionLabel: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 2,
  },
  suggestionInfo: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  suggestionInfoText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
    textAlign: 'center',
  },
});