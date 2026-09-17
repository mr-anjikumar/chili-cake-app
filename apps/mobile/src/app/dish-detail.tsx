import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../api';

type Dish = {
  id: string;
  name: string;
  photo_url: string | null;
  place_name: string | null;
  average_rating: number;
};

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [dish, setDish] = useState<Dish | null>(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDish = async () => {
      try {
        const response = await api.get<Dish[]>('/dishes');
        const found = response.data.find((item) => item.id === id);
        if (!found) {
          Alert.alert('Dish not found', 'This dish may have been removed.');
          router.back();
          return;
        }
        setDish(found);
      } catch (error: any) {
        Alert.alert(
          'Could not load dish',
          error?.response?.data?.message || error?.message || 'Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadDish();
  }, [id, router]);

  const submitRating = async () => {
    if (!dish || rating < 1) {
      Alert.alert('Choose a rating', 'Tap 1 to 5 stars first.');
      return;
    }

    try {
      setSaving(true);
      await api.post(`/dishes/${dish.id}/ratings`, { rating });
      Alert.alert('Thanks!', 'Your rating was saved.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Could not save rating',
        error?.response?.data?.message || error?.message || 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!dish) {
    return (
      <View style={styles.center}>
        <Text>Dish not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>DISH DETAILS</Text>
      <Text style={styles.name}>{dish.name}</Text>
      <Text style={styles.place}>
        {dish.place_name || 'Place not specified'}
      </Text>

      <View style={styles.ratingCard}>
        <Text style={styles.averageLabel}>Community average</Text>
        <Text style={styles.average}>
          ★ {Number(dish.average_rating || 0).toFixed(1)}
        </Text>
      </View>

      <Text style={styles.prompt}>How would you rate it?</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={`${value} star${value === 1 ? '' : 's'}`}
            onPress={() => setRating(value)}
            style={styles.starButton}
          >
            <Text style={[styles.star, value <= rating && styles.selectedStar]}>
              ★
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.ratingHint}>
        {rating === 0 ? 'Tap a star to choose' : `Your rating: ${rating} / 5`}
      </Text>

      <Pressable
        style={[styles.submitButton, saving && styles.disabledButton]}
        onPress={submitRating}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>Submit rating</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
    padding: 24,
    paddingTop: 36,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9F1',
  },
  eyebrow: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  name: {
    color: '#2B2118',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },
  place: {
    color: '#786D63',
    fontSize: 16,
    marginTop: 6,
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginTop: 28,
    alignItems: 'center',
  },
  averageLabel: {
    color: '#786D63',
    fontSize: 14,
  },
  average: {
    color: '#B45309',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },
  prompt: {
    color: '#2B2118',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 36,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  starButton: {
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  star: {
    color: '#D6C8B8',
    fontSize: 42,
  },
  selectedStar: {
    color: '#F59E0B',
  },
  ratingHint: {
    color: '#786D63',
    textAlign: 'center',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#C2410C',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.65,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
