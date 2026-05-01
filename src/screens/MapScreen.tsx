import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export function MapScreen({ navigation, route }: Props) {
  const { incidents } = useApp();
  const { incidentId } = route.params;

  const incident = useMemo(
    () => incidents.find((i) => i.id === incidentId),
    [incidents, incidentId]
  );

  if (!incident) {
    return (
      <ScreenContainer scroll>
        <Text style={styles.missing}>Incident not found.</Text>
        <PrimaryButton title="Back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Route overview (mock)</Text>
      <Text style={styles.sub}>
        Static placeholder — no live GPS or routing. Illustrates how arrival
        information could be shown to a responder.
      </Text>

      <View style={styles.mapPlaceholder}>
        <View style={styles.pinRow}>
          <View style={[styles.dot, styles.you]} />
          <Text style={styles.pinLabel}>You (mock position)</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.pinRow}>
          <View style={[styles.dot, styles.incident]} />
          <Text style={styles.pinLabel}>Incident (mock position)</Text>
        </View>
        <Text style={styles.coords}>
          Volunteer: {incident.volunteerLat?.toFixed(4)},{' '}
          {incident.volunteerLng?.toFixed(4)}
        </Text>
        <Text style={styles.coords}>
          Incident: {incident.incidentLat?.toFixed(4)},{' '}
          {incident.incidentLng?.toFixed(4)}
        </Text>
      </View>

      <View style={styles.stats}>
        <Stat label="Distance" value={incident.distance} />
        <Stat
          label="Est. arrival (demo)"
          value={incident.estimatedArrivalTime}
        />
      </View>

      <PrimaryButton
        title="Back to incident"
        variant="outline"
        onPress={() => navigation.navigate('AlertDetails', { incidentId })}
      />
    </ScreenContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  missing: {
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  mapPlaceholder: {
    backgroundColor: '#E8EEF2',
    borderRadius: 16,
    padding: spacing.lg,
    minHeight: 220,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  you: {
    backgroundColor: colors.accent,
  },
  incident: {
    backgroundColor: colors.primary,
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  line: {
    height: 36,
    width: 2,
    backgroundColor: colors.textSecondary,
    marginLeft: 6,
    marginVertical: spacing.xs,
    opacity: 0.4,
  },
  coords: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'System',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
});
