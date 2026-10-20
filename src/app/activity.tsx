import { Stack, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { describeApiError } from '@/api/errors';
import { ActivityRow } from '@/components/activity/ActivityRow';
import { AppButton } from '@/components/ui/AppButton';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { screenColumn } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateMessage } from '@/components/ui/StateMessage';
import { useActivity } from '@/hooks/useActivity';
import { useManualRefresh } from '@/hooks/useManualRefresh';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

const SKELETON_ROWS = 6;

const ActivitySkeleton = () => (
  <>
    {Array.from({ length: SKELETON_ROWS }, (_, index) => (
      <View key={index} style={styles.skeletonRow}>
        <Skeleton width="50%" height={16} />
        <Skeleton width="30%" height={12} />
      </View>
    ))}
  </>
);

const ActivityScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const activityQuery = useActivity();
  const { isRefreshing, refresh } = useManualRefresh(activityQuery.refetch);
  const { data: items, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = activityQuery;

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) fetchNextPage();
  };

  const renderFooter = () => {
    if (isFetchingNextPage) return <ActivitySkeleton />;
    if (isFetchNextPageError) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerError}>Couldn&apos;t load more: {describeApiError(activityQuery.error)}</Text>
          <AppButton label="Try again" variant="secondary" onPress={() => fetchNextPage()} />
        </View>
      );
    }
    if (items && items.length > 0 && !hasNextPage) return <Text style={styles.end}>That&apos;s everything.</Text>;
    return null;
  };

  const renderEmpty = () => {
    if (activityQuery.isPending) return <ActivitySkeleton />;
    if (activityQuery.isError) {
      return (
        <StateMessage
          tone="danger"
          icon="cloud-offline-outline"
          title="Couldn't load activity"
          message={describeApiError(activityQuery.error)}
          actionLabel="Try again"
          onAction={refresh}
          actionLoading={isRefreshing}
        />
      );
    }
    return <StateMessage icon="receipt-outline" title="No activity yet" message="Payback, reversals and claims will appear here." />;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Activity',
          // Opened directly (reload, shared link): there is no back, so offer a way home.
          headerLeft: router.canGoBack()
            ? undefined
            : () => <HeaderButton label="Home" onPress={() => router.replace('/')} />,
        }}
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={[screenColumn, { paddingBottom: spacing.xl + insets.bottom }]}
        data={items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityRow item={item} />}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skeletonRow: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  footer: {
    gap: spacing.sm,
  },
  footerError: {
    fontSize: fontSize.sm,
    color: colors.danger,
    textAlign: 'center',
  },
  end: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default ActivityScreen;
