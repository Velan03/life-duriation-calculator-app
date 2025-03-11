import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function LifeCalculator() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [birthDate, setBirthDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [timeUnits, setTimeUnits] = useState({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });

  const theme = {
    background: isDarkMode ? '#000000' : '#ffffff',
    surface: isDarkMode ? '#1a1a1a' : '#f0f0f0',
    primary: isDarkMode ? '#00ff00' : '#00aa00',
    text: isDarkMode ? '#ffffff' : '#000000',
    digitBg: isDarkMode ? '#222222' : '#e0e0e0',
  };

  useEffect(() => {
    if (!birthDate) {
      setShowPicker(true);
      return;
    }

    const interval = setInterval(() => {
      calculateTime();
    }, 100);

    return () => clearInterval(interval);
  }, [birthDate]);

  const calculateTime = () => {
    if (!birthDate) return;

    const now = new Date();
    const diff = now.getTime() - birthDate.getTime();

    const milliseconds = diff;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.436875);
    const years = Math.floor(days / 365.25);

    setTimeUnits({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const DigitalNumber = ({ value, label }) => (
    <View style={[styles.digitalBox, { backgroundColor: theme.digitBg }]}>
      <Text style={[styles.digitalValue, { color: theme.primary }]}>
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={[styles.digitalLabel, { color: theme.text }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Life Timer</Text>
        <TouchableOpacity
          onPress={() => setIsDarkMode(!isDarkMode)}
          style={[styles.themeToggle, { backgroundColor: theme.surface }]}
        >
          <MaterialCommunityIcons
            name={isDarkMode ? 'weather-night' : 'weather-sunny'}
            size={24}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.dateButton, { backgroundColor: theme.surface }]}
        onPress={() => setShowPicker(true)}
      >
        <MaterialCommunityIcons name="calendar" size={24} color={theme.primary} />
        <Text style={[styles.dateButtonText, { color: theme.text }]}>
          {birthDate ? birthDate.toLocaleDateString() : 'Select Birth Date'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Animated.View 
        entering={FadeIn}
        layout={Layout.springify()}
        style={styles.digitalDisplay}
      >
        <View style={styles.row}>
          <DigitalNumber value={timeUnits.years} label="YRS" />
          <Text style={[styles.separator, { color: theme.primary }]}>:</Text>
          <DigitalNumber value={timeUnits.months} label="MON" />
          <Text style={[styles.separator, { color: theme.primary }]}>:</Text>
          <DigitalNumber value={timeUnits.weeks} label="WKS" />
        </View>
        <View style={styles.row}>
          <DigitalNumber value={timeUnits.hours} label="HRS" />
          <Text style={[styles.separator, { color: theme.primary }]}>:</Text>
          <DigitalNumber value={timeUnits.minutes} label="MIN" />
          <Text style={[styles.separator, { color: theme.primary }]}>:</Text>
          <DigitalNumber value={timeUnits.seconds} label="SEC" />
        </View>
        <View style={[styles.milliseconds, { backgroundColor: theme.digitBg }]}>
          <Text style={[styles.millisecondsText, { color: theme.primary }]}>
            {String(timeUnits.milliseconds).padStart(3, '0')}
          </Text>
          <Text style={[styles.millisecondsLabel, { color: theme.text }]}>MILLISECONDS</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 12,
    borderRadius: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  dateButtonText: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '600',
  },
  digitalDisplay: {
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  digitalBox: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  digitalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  digitalLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  separator: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  milliseconds: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  millisecondsText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  millisecondsLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});