import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = { primary: '#FFC107', background: '#121212', surface: '#1E1E1E', white: '#FFFFFF', textLight: '#B3B3B3', break: '#4CAF50' };

export default function TimerScreen() {
  const [mode, setMode] = useState('Study'); // 'Study' or 'Break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      switchMode();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const switchMode = () => {
    if (mode === 'Study') {
      setMode('Break');
      setTimeLeft(5 * 60);
    } else {
      setMode('Study');
      setTimeLeft(25 * 60);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'Study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isStudy = mode === 'Study';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Focus Mode</Text>
      
      <View style={[styles.timerCircle, { borderColor: isStudy ? COLORS.primary : COLORS.break }]}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.modeText}>{mode} Session</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconBtn} onPress={resetTimer}>
          <Icon name="refresh" size={32} color={COLORS.white} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.playBtn, { backgroundColor: isStudy ? COLORS.primary : COLORS.break }]} 
          onPress={() => setIsRunning(!isRunning)}
        >
          <Icon name={isRunning ? "pause" : "play"} size={40} color={COLORS.background} style={{marginLeft: isRunning ? 0 : 5}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={switchMode}>
          <Icon name="play-skip-forward" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  header: { position: 'absolute', top: 50, fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  timerCircle: { width: 280, height: 280, borderRadius: 140, borderWidth: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 60 },
  timerText: { fontSize: 72, fontWeight: 'bold', color: COLORS.white },
  modeText: { fontSize: 18, color: COLORS.textLight, marginTop: 10, textTransform: 'uppercase', letterSpacing: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 30 },
  iconBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});