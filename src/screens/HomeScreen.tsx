import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AlertCard } from '../components/AlertCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import {
  formatIncidentTime,
  shouldShowActiveAlert,
} from '../utils/incidentHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const {
    volunteer,
    incidents,
    activeAlert,
    toggleAvailability,
    simulateEmergency,
    acceptActiveAlert,
    declineActiveAlert,
    logoutDemo,
    lastSimulateMessage,
    clearSimulateMessage,
  } = useApp();

  useEffect(() => {
    if (lastSimulateMessage) {
      Alert.alert('Demo alert', lastSimulateMessage, [
        { text: 'OK', onPress: clearSimulateMessage },
      ]);
    }
  }, [lastSimulateMessage, clearSimulateMessage]);

  const showCard = shouldShowActiveAlert(volunteer.isAvailable, activeAlert);
  const recent = incidents.slice(0, 4);

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hello, {volunteer.name}</Text>
          <Text style={styles.role}>{volunteer.trainingLevel}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => void logoutDemo()}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.statusPill}>
        <Text style={styles.statusLabel}>Availability</Text>
        <Text
          style={[
            styles.statusValue,
            !volunteer.isAvailable && styles.statusOff,
          ]}
        >
          {volunteer.isAvailable ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      <PrimaryButton
        title={
          volunteer.isAvailable ? 'Set unavailable' : 'Set available'
        }
        variant={volunteer.isAvailable ? 'secondary' : 'primary'}
        onPress={toggleAvailability}
        style={styles.toggleBtn}
      />

      {!volunteer.isAvailable ? (
        <Text style={styles.warn}>
          You will not receive demo alerts while unavailable.
        </Text>
      ) : null}

      {showCard && activeAlert ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active alert</Text>
          <AlertCard
            incident={activeAlert}
            onAccept={() => {
              const accepted = acceptActiveAlert();
              if (accepted) {
                navigation.navigate('AlertDetails', {
                  incidentId: accepted.id,
                });
              }
            }}
            onDecline={declineActiveAlert}
          />
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Demo controls</Text>
        <PrimaryButton
          title="Simulate nearby emergency alert"
          onPress={() => simulateEmergency()}
        />
        <Text style={styles.demoHint}>
          Triggers a fake incident for testing. Only works when you are
          available.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent demo incidents</Text>
        {recent.length === 0 ? (
          <Text style={styles.empty}>No simulated incidents yet.</Text>
        ) : (
          recent.map((inc) => (
            <Pressable
              key={inc.id}
              accessibilityRole="button"
              style={styles.incidentRow}
              onPress={() =>
                navigation.navigate('AlertDetails', { incidentId: inc.id })
              }
            >
              <Text style={styles.incidentType}>{inc.type}</Text>
              <Text style={styles.incidentMeta}>
                {inc.status.toUpperCase()} · {inc.distance} ·{' '}
                {formatIncidentTime(inc.createdAt)}
              </Text>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.navRow}>
        <PrimaryButton
          title="Profile"
          variant="outline"
          onPress={() => navigation.navigate('Profile')}
          style={styles.navHalf}
        />
        <PrimaryButton
          title="History"
          variant="outline"
          onPress={() => navigation.navigate('History')}
          style={styles.navHalf}
        />
      </View>
      <PrimaryButton
        title="Safety disclaimer"
        variant="outline"
        onPress={() => navigation.navigate('Disclaimer')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  role: {
    marginTop: 4,
    fontSize: 15,
    color: colors.textSecondary,
  },
  linkBtn: {
    padding: spacing.xs,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  statusPill: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  statusLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.success,
  },
  statusOff: {
    color: colors.textSecondary,
  },
  toggleBtn: {
    marginBottom: spacing.md,
  },
  warn: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  demoHint: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  empty: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  incidentRow: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  incidentMeta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  navHalf: {
    flex: 1,
  },
});
