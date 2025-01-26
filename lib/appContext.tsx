// import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { BackHandler } from 'react-native';
import { Note } from './types';
import { StatusBar } from 'expo-status-bar';

interface AppContextType {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface AppProviderProps {
  children: ReactNode;
}


const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // const db = useSQLiteContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleBackPress = () => {
      if (open) {
        setOpen(false);
        // Custom back logic
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    };

    // Add the event listener
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup the event listener on unmount or when `open` changes
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [open]);

  // async function fetchNotes() {
  //   const result = await db.getAllAsync<Note>('SELECT * FROM notes');
  //   setNotes(result);
  // }

  // useEffect(() => {
  //   fetchNotes();
  // }, []);

  return (
    <AppContext.Provider value={{ notes, setNotes, open, setOpen }}>
      <StatusBar style={open ? "dark" : 'light'} />
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
