import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import type { Incident } from '../types/models';
import { formatIncidentTime } from '../utils/incidentHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

function statusColor(status: Incident['status']) {
  switch (status) {
    case 'accepted':
      return colors.success;
    case 'declined':
      return colors.textSecondary;
    case 'missed':
      return colors.warning;
    default:
      return colors.primary;
  }
}

export function HistoryScreen({ navigation }: Props) {
  const { incidents } = useApp();
  const sorted = [...incidents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ScreenContainer>
      <View style={styles.listWrap}>
        <Text style={styles.title}>Incident history</Text>
        <Text style={styles.sub}>
          Simulated alerts only — for dissertation evaluation.
        </Text>
        <FlatList
          style={styles.list}
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            sorted.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No incidents recorded yet.</Text>
          }
          renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            style={styles.row}
            onPress={() =>
              navigation.navigate('AlertDetails', { incidentId: item.id })
            }
          >
            <View style={styles.rowTop}>
              <Text style={styles.type}>{item.type}</Text>
              <Text
                style={[
                  styles.badge,
                  { color: statusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>
            <Text style={styles.meta}>
              {formatIncidentTime(item.createdAt)} · {item.distance}
            </Text>
          </Pressable>
        )}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.textSecondary,
  },
  row: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  type: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  meta: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
