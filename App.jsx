import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { ExamProvider } from './src/context/ExamContext';

import HomeScreen from './src/screens/HomeScreen';
import TimerScreen from './src/screens/TimerScreen';
import SyllabusScreen from './src/screens/SyllabusScreen';
import ResourceScreen from './src/screens/ResourceScreen';
import CountdownScreen from './src/screens/CountdownScreen';

const Tab = createBottomTabNavigator();
const COLORS = { primary: '#FFC107', background: '#121212', surface: '#1E1E1E', inactive: '#757575', white: '#FFFFFF' };

export default function App() {
  return (
    <ExamProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.inactive,
            tabBarStyle: { backgroundColor: COLORS.surface, borderTopWidth: 0, elevation: 10, height: 65 },
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
              else if (route.name === 'Timer') iconName = focused ? 'timer' : 'timer-outline';
              else if (route.name === 'Syllabus') iconName = focused ? 'list' : 'list-outline';
              else if (route.name === 'Resources') iconName = focused ? 'folder' : 'folder-outline';
              else if (route.name === 'Exams') iconName = focused ? 'calendar' : 'calendar-outline';
              return <Icon name={iconName} size={24} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Timer" component={TimerScreen} />
          <Tab.Screen name="Syllabus" component={SyllabusScreen} />
          <Tab.Screen name="Resources" component={ResourceScreen} />
          <Tab.Screen name="Exams" component={CountdownScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ExamProvider>
  );
}