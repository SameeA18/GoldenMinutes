import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import type { Incident } from '../types/models';
import { formatIncidentTime } from '../utils/incidentHelpers';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  incident: Incident;
  onAccept: () => void;
  onDecline: () => void;
};

export function AlertCard({ incident, onAccept, onDecline }: Props) {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <View style={styles.accentBar} />
      <Text style={styles.title}>Nearby demo alert</Text>
      <Text style={styles.type}>{incident.type}</Text>
      <Text style={styles.meta}>{incident.distance} · {incident.locationName}</Text>
      <Text style={styles.time}>{formatIncidentTime(incident.createdAt)}</Text>
      <Text style={styles.hint}>
        Prototype only — not a real emergency. No services are notified.
      </Text>
      <View style={styles.row}>
        <PrimaryButton
          title="Decline"
          variant="outline"
          onPress={onDecline}
          style={styles.half}
        />
        <PrimaryButton title="Accept" onPress={onAccept} style={styles.half} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  type: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
});
