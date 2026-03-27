import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExamContext = createContext();

const DUMMY_SYLLABUS = [
  {
    id: 's1', subject: 'Mobile App Development',
    chapters: [{ id: 'c1', title: 'React Native Basics', status: 'Mastered' }, { id: 'c2', title: 'Navigation & State', status: 'Reading' }]
  }
];

const DUMMY_EXAMS = [
  { id: 'e1', subject: 'Mobile App Development', date: '2026-04-24T09:00:00' },
  { id: 'e2', subject: 'Software Testing', date: '2026-04-27T09:00:00' },
];

const DUMMY_RESOURCES = [
  { id: 'r1', subject: 'Mobile App Development', title: 'Full RN Crash Course', type: 'link', link: 'https://youtube.com' }
];

export const ExamProvider = ({ children }) => {
  const [syllabus, setSyllabus] = useState(DUMMY_SYLLABUS);
  const [exams] = useState(DUMMY_EXAMS);
  const [resources, setResources] = useState(DUMMY_RESOURCES);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedSyllabus = await AsyncStorage.getItem('@examcrunch_syllabus');
      const savedResources = await AsyncStorage.getItem('@examcrunch_resources');
      if (savedSyllabus) setSyllabus(JSON.parse(savedSyllabus));
      if (savedResources) setResources(JSON.parse(savedResources));
    } catch (e) {
      console.error(e);
    }
  };

  const cycleStatus = async (subjectId, chapterId) => {
    const updated = syllabus.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          chapters: sub.chapters.map(chap => {
            if (chap.id === chapterId) {
              const nextStatus = chap.status === 'To-Do' ? 'Reading' : chap.status === 'Reading' ? 'Mastered' : 'To-Do';
              return { ...chap, status: nextStatus };
            }
            return chap;
          })
        };
      }
      return sub;
    });
    setSyllabus(updated);
    await AsyncStorage.setItem('@examcrunch_syllabus', JSON.stringify(updated));
  };

  const addSubject = async (subjectName) => {
    const newSubject = { id: Date.now().toString(), subject: subjectName, chapters: [] };
    const updated = [...syllabus, newSubject];
    setSyllabus(updated);
    await AsyncStorage.setItem('@examcrunch_syllabus', JSON.stringify(updated));
  };

  const addChapter = async (subjectId, chapterTitle) => {
    const updated = syllabus.map(sub => {
      if (sub.id === subjectId) {
        return { ...sub, chapters: [...sub.chapters, { id: Date.now().toString(), title: chapterTitle, status: 'To-Do' }] };
      }
      return sub;
    });
    setSyllabus(updated);
    await AsyncStorage.setItem('@examcrunch_syllabus', JSON.stringify(updated));
  };

  const addResource = async (subjectName, title, link) => {
    const type = link.includes('youtube.com') || link.includes('youtu.be') ? 'youtube' : 'link';
    const newRes = { id: Date.now().toString(), subject: subjectName, title, type, link };
    const updated = [newRes, ...resources];
    setResources(updated);
    await AsyncStorage.setItem('@examcrunch_resources', JSON.stringify(updated));
  };

  return (
    <ExamContext.Provider value={{ syllabus, exams, resources, cycleStatus, addSubject, addChapter, addResource }}>
      {children}
    </ExamContext.Provider>
  );
};