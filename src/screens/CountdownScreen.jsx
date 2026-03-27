import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { ExamContext } from '../context/ExamContext';

const COLORS = { primary: '#FFC107', background: '#121212', surface: '#1E1E1E', white: '#FFFFFF', textLight: '#B3B3B3', danger: '#F44336' };

export default function CountdownScreen() {
  const { exams } = useContext(ExamContext);

  const calculateDaysLeft = (examDate) => {
    const today = new Date();
    const target = new Date(examDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const renderExam = ({ item }) => {
    const daysLeft = calculateDaysLeft(item.date);
    const isUrgent = daysLeft <= 7;

    return (
      <View style={[styles.examCard, isUrgent && styles.urgentCard]}>
        <View style={styles.dateBox}>
          <Text style={[styles.daysNumber, isUrgent && { color: COLORS.danger }]}>{daysLeft}</Text>
          <Text style={styles.daysText}>Days</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Exam Countdown</Text>
      <FlatList
        data={exams.sort((a, b) => new Date(a.date) - new Date(b.date))}
        keyExtractor={item => item.id}
        renderItem={renderExam}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginTop: 40, marginBottom: 20, paddingHorizontal: 20 },
  examCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, padding: 15, marginBottom: 15, alignItems: 'center' },
  urgentCard: { borderWidth: 1, borderColor: COLORS.danger },
  dateBox: { width: 70, height: 70, backgroundColor: COLORS.background, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  daysNumber: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  daysText: { fontSize: 12, color: COLORS.textLight, textTransform: 'uppercase' },
  infoBox: { flex: 1, marginLeft: 15 },
  subject: { fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 5 },
  dateText: { fontSize: 14, color: COLORS.textLight }
});