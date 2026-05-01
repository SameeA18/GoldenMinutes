import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { formatIncidentTime } from '../utils/incidentHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'AlertDetails'>;

export function AlertDetailsScreen({ navigation, route }: Props) {
  const { incidents } = useApp();
  const { incidentId } = route.params;

  const incident = useMemo(
    () => incidents.find((i) => i.id === incidentId),
    [incidents, incidentId]
  );

  if (!incident) {
    return (
      <ScreenContainer scroll>
        <Text style={styles.missing}>Incident not found (demo data).</Text>
        <PrimaryButton title="Back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  const isAccepted = incident.status === 'accepted';

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Incident details</Text>
      {isAccepted ? (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>You are responding (demo)</Text>
          <Text style={styles.bannerText}>
            This confirms the simulated accept flow only. No dispatch occurs.
          </Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Row label="Type" value={incident.type} />
        <Row label="Location" value={incident.locationName} />
        <Row label="Distance" value={incident.distance} />
        <Row
          label="Est. arrival (mock)"
          value={incident.estimatedArrivalTime}
        />
        <Row label="Reported" value={formatIncidentTime(incident.createdAt)} />
        <Row label="Status" value={incident.status.toUpperCase()} />
      </View>

      <PrimaryButton
        title="View map / route (placeholder)"
        onPress={() => navigation.navigate('Map', { incidentId: incident.id })}
        style={styles.btn}
      />
      <PrimaryButton
        title="Back to dashboard"
        variant="outline"
        onPress={() => navigation.navigate('Home')}
      />
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  missing: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  banner: {
    backgroundColor: colors.accentMuted,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bannerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  row: {
    marginBottom: spacing.md,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '600',
  },
  btn: {
    marginBottom: spacing.sm,
  },
});
