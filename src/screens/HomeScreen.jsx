import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ExamContext } from '../context/ExamContext';

const COLORS = { primary: '#FFC107', background: '#121212', surface: '#1E1E1E', white: '#FFFFFF', textLight: '#B3B3B3', success: '#4CAF50' };

export default function HomeScreen({ navigation }) {
  const { syllabus, exams } = useContext(ExamContext);

  // Calculate overall progress
  let totalChapters = 0;
  let masteredChapters = 0;
  syllabus.forEach(sub => {
    totalChapters += sub.chapters.length;
    masteredChapters += sub.chapters.filter(c => c.status === 'Mastered').length;
  });

  const progressPercent = totalChapters === 0 ? 0 : Math.round((masteredChapters / totalChapters) * 100);

  // Get nearest exam
  const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextExam = sortedExams.length > 0 ? sortedExams[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>Welcome back,</Text>
      <Text style={styles.title}>Ready to crush it?</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Mastery</Text>
        <Text style={styles.progressText}>{progressPercent}%</Text>
        <Text style={styles.subText}>{masteredChapters} of {totalChapters} topics mastered</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {nextExam && (
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Icon name="warning" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Next Exam</Text>
          </View>
          <Text style={styles.examSubject}>{nextExam.subject}</Text>
          <Text style={styles.subText}>{new Date(nextExam.date).toDateString()}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.timerBtn} onPress={() => navigation.navigate('Timer')}>
        <Icon name="timer" size={24} color={COLORS.background} />
        <Text style={styles.timerBtnText}>Start Study Session</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  greeting: { fontSize: 16, color: COLORS.textLight, marginTop: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, marginBottom: 30 },
  card: { backgroundColor: COLORS.surface, padding: 25, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#2C2C2C' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  progressText: { fontSize: 48, fontWeight: 'bold', color: COLORS.success, marginVertical: 10 },
  subText: { fontSize: 14, color: COLORS.textLight, marginBottom: 15 },
  progressBarBg: { height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 4 },
  examSubject: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 5 },
  timerBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, padding: 20, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  timerBtnText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' }
});