import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ExamContext } from '../context/ExamContext';

const COLORS = { primary: '#FFC107', background: '#121212', surface: '#1E1E1E', white: '#FFFFFF', textLight: '#B3B3B3', reading: '#2196F3', mastered: '#4CAF50', todo: '#F44336' };

export default function SyllabusScreen() {
  const { syllabus, cycleStatus, addSubject, addChapter } = useContext(ExamContext);
  
  const [subjectModal, setSubjectModal] = useState(false);
  const [chapterModal, setChapterModal] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [inputText, setInputText] = useState('');

  const handleAddSubject = () => {
    if (inputText.trim()) addSubject(inputText);
    setSubjectModal(false);
    setInputText('');
  };

  const handleAddChapter = () => {
    if (inputText.trim() && activeSubjectId) addChapter(activeSubjectId, inputText);
    setChapterModal(false);
    setInputText('');
    setActiveSubjectId(null);
  };

  const getStatusColor = (status) => status === 'Mastered' ? COLORS.mastered : status === 'Reading' ? COLORS.reading : COLORS.todo;

  const renderSubject = ({ item }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectTitle}>{item.subject}</Text>
        <TouchableOpacity onPress={() => { setActiveSubjectId(item.id); setChapterModal(true); }}>
          <Icon name="add-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {item.chapters.map(chap => (
        <View key={chap.id} style={styles.chapterRow}>
          <Text style={styles.chapterTitle}>{chap.title}</Text>
          <TouchableOpacity style={[styles.statusBadge, { borderColor: getStatusColor(chap.status) }]} onPress={() => cycleStatus(item.id, chap.id)}>
            <Text style={[styles.statusText, { color: getStatusColor(chap.status) }]}>{chap.status}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Syllabus</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setSubjectModal(true)}>
          <Icon name="add" size={20} color={COLORS.background} />
          <Text style={styles.addBtnText}>Subject</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={syllabus} keyExtractor={item => item.id} renderItem={renderSubject} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} />

      {/* Input Modal */}
      <Modal transparent visible={subjectModal || chapterModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{subjectModal ? "New Subject" : "New Topic"}</Text>
            <TextInput style={styles.input} placeholder="Enter name..." placeholderTextColor={COLORS.textLight} value={inputText} onChangeText={setInputText} autoFocus />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setSubjectModal(false); setChapterModal(false); setInputText(''); }}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={subjectModal ? handleAddSubject : handleAddChapter}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  addBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', gap: 5 },
  addBtnText: { color: COLORS.background, fontWeight: 'bold' },
  subjectCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#2C2C2C' },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  subjectTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, flex: 1 },
  chapterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2C2C2C' },
  chapterTitle: { fontSize: 16, color: COLORS.white, flex: 1, paddingRight: 10 },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, width: 90, alignItems: 'center', backgroundColor: '#121212' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#333' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 15 },
  input: { backgroundColor: COLORS.background, color: COLORS.white, padding: 15, borderRadius: 8, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  cancelBtn: { padding: 15 },
  cancelText: { color: COLORS.textLight, fontWeight: 'bold', fontSize: 16 },
  saveBtn: { backgroundColor: COLORS.primary, paddingVertical: 15, paddingHorizontal: 25, borderRadius: 8 },
  saveText: { color: COLORS.background, fontWeight: 'bold', fontSize: 16 }
});