import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ExamContext } from '../context/ExamContext';

const COLORS = { primary: '#FFC107', background: '#121212', surface: '#1E1E1E', white: '#FFFFFF', textLight: '#B3B3B3', yt: '#FF0000', drive: '#4CAF50' };

export default function ResourceScreen() {
  const { resources, addResource } = useContext(ExamContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ subject: '', title: '', link: '' });

  const handleSave = () => {
    if (!form.subject || !form.title || !form.link) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    addResource(form.subject, form.title, form.link);
    setModalVisible(false);
    setForm({ subject: '', title: '', link: '' });
  };

  const openLink = (url) => {
    // Basic linking fallback for the prototype
    Alert.alert("Link Output", `Would open: ${url}`);
  };

  const renderResource = ({ item }) => (
    <TouchableOpacity style={styles.resourceCard} onPress={() => openLink(item.link)}>
      <View style={[styles.iconBox, { backgroundColor: item.type === 'youtube' ? COLORS.yt + '20' : COLORS.drive + '20' }]}>
        <Icon name={item.type === 'youtube' ? 'logo-youtube' : 'link'} size={24} color={item.type === 'youtube' ? COLORS.yt : COLORS.drive} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Vault</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Icon name="add" size={20} color={COLORS.background} />
          <Text style={styles.addBtnText}>Link</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={resources} 
        keyExtractor={item => item.id} 
        renderItem={renderResource} 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} 
        ListEmptyComponent={<Text style={{color: COLORS.textLight}}>No resources added.</Text>}
      />

      {/* Resource Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Resource</Text>
            
            <TextInput style={styles.input} placeholder="Subject Name (e.g. Maths)" placeholderTextColor={COLORS.textLight} value={form.subject} onChangeText={(t) => setForm({...form, subject: t})} />
            <TextInput style={styles.input} placeholder="Topic Title" placeholderTextColor={COLORS.textLight} value={form.title} onChangeText={(t) => setForm({...form, title: t})} />
            <TextInput style={styles.input} placeholder="URL Link" placeholderTextColor={COLORS.textLight} value={form.link} onChangeText={(t) => setForm({...form, link: t})} autoCapitalize="none" keyboardType="url" />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveText}>Save Link</Text></TouchableOpacity>
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
  resourceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 15, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#2C2C2C' },
  iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  infoBox: { flex: 1, marginLeft: 15 },
  title: { fontSize: 16, fontWeight: 'bold', color: COLORS.white },
  subject: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#333' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 15 },
  input: { backgroundColor: COLORS.background, color: COLORS.white, padding: 15, borderRadius: 8, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginTop: 5 },
  cancelBtn: { padding: 15 },
  cancelText: { color: COLORS.textLight, fontWeight: 'bold', fontSize: 16 },
  saveBtn: { backgroundColor: COLORS.primary, paddingVertical: 15, paddingHorizontal: 25, borderRadius: 8 },
  saveText: { color: COLORS.background, fontWeight: 'bold', fontSize: 16 }
});