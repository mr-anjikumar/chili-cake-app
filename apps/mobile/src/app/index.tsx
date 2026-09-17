import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../api';

type Dish = {
  id: string;
  name: string;
  photo_url: string | null;
  place_name: string | null;
  lat: number | null;
  lng: number | null;
  average_rating: number;
};

export default function DiscoverScreen() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDishes = useCallback(async () => {
    try {
      setError('');
      const response = await api.get<Dish[]>('/dishes');
      setDishes(response.data);
    } catch {
      setError('Could not load dishes. Check that the backend is running and your phone is on the same Wi-Fi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const refresh = () => {
    setRefreshing(true);
    loadDishes();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>CHILI CAKE</Text>
          <Text style={styles.title}>Discover dishes</Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/add-dish')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <View style={styles.message}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadDishes}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          contentContainerStyle={
            dishes.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No dishes yet. Add the first one!
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.dishCard}
              onPress={() =>
                router.push({
                  pathname: '/dish-detail',
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.dishIcon}>
                <Text style={styles.dishEmoji}>🍽️</Text>
              </View>
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.place}>
                  {item.place_name || 'Place not specified'}
                </Text>
              </View>
              <Text style={styles.rating}>
                ★ {Number(item.average_rating || 0).toFixed(1)}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
    paddingTop: 64,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: '#2B2118',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#C2410C',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loader: {
    marginTop: 40,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#6B6259',
    fontSize: 16,
    textAlign: 'center',
  },
  dishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dishIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishEmoji: {
    fontSize: 26,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    color: '#2B2118',
    fontSize: 16,
    fontWeight: '700',
  },
  place: {
    color: '#786D63',
    marginTop: 4,
    fontSize: 13,
  },
  rating: {
    color: '#B45309',
    fontWeight: '800',
  },
  message: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  error: {
    color: '#B91C1C',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#C2410C',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
