// import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { BackHandler } from 'react-native';
import { Folder, Note, SaveNoteProps } from './types';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';

interface AppContextType {
  notes: Note[];
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveNote: ({ id, title, content, desc }: SaveNoteProps) => void;
  setEditItem: React.Dispatch<React.SetStateAction<Note | null>>;
  editItem: Note | null;
  deleteNotesByIds: (ids: number[]) => Promise<void>;
  setActiveFilter: React.Dispatch<React.SetStateAction<number>>;
  activeFilter: number

}

interface AppProviderProps {
  children: ReactNode;
}


const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Note | null>(null);
  const [activeFilter, setActiveFilter] = useState(-1);

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
  // const saveNote = ({id,title,content,desc}: SaveNoteProps) => {
  //   console.log({id})
  //   // Validate: Save only if either title or content is not empty
  //   if (!title?.trim() && !content?.trim()) {
  //     console.warn("Note not saved: Both title and content are empty.");
  //     return;
  //   }

  //   setNotes((prevNotes) => {
  //     // Update an existing note
  //     if (id) {
  //       console.log("have")
  //       return prevNotes.map((note) =>
  //         note.id === id
  //           ? {
  //               ...note,
  //               title: title ?? note.title, // Preserve current title if null
  //               content: content ?? note.content, // Preserve current content if null
  //               desc: desc ?? note.desc, // Preserve current content if null
  //             }
  //           : note
  //       );
  //     }

  //     // Add a new note
  //     const newNote: Note = {
  //       id: prevNotes.length ? Math.max(...prevNotes.map((n) => n.id)) + 1 : 1,
  //       date: new Date(),
  //       title: title ?? "Undefinded",
  //       content: content ?? "",
  //       desc: desc ?? "",
  //     };
  //     return [...prevNotes, newNote];
  //   });
  // };

  const saveNote = async ({ id, title, content, desc }: SaveNoteProps) => {
    console.log({ id });

    if (!title?.trim() && !content?.trim()) {
      console.warn("Note not saved: Both title and content are empty.");
      return;
    }

    const date = new Date().toISOString(); // Store date as ISO string for consistency

    if (id) {
      // Update an existing note
      await db.runAsync(
        `UPDATE notes 
           SET title = ?, content = ?, desc = ?, date = ? 
           WHERE id = ?;`,
        [title ?? "", content ?? "", desc ?? "", date, id]
      ).then(() => fetchNotes()).catch((error) => console.error("Error updating note:", error));
    } else {
      // Add a new note
      await db.runAsync(
        `INSERT INTO notes (title, content, desc, date, folderId) 
           VALUES (?, ?, ?, ?,?);`,
        [title ?? "Untitled", content ?? "", desc ?? "", date, 0]
      ).then(() => fetchNotes()).catch((error) => console.error("Error adding note:", error));
    }

  };
  const deleteNotesByIds = async (ids: number[]) => {
    if (!ids || ids.length === 0) {
      console.log('No IDs provided');
      return;
    }

    const placeholders = ids.map(() => '?').join(',');

    try {
      await db.runAsync(
        `DELETE FROM notes WHERE id IN (${placeholders});`,
        ...ids
      );
      console.log(`${ids.length} notes deleted successfully`);
      setNotes(prev => prev.filter(el => !ids.includes(el.id)))
    } catch (error) {
      console.error('Error deleting notes:', error);
    }
  };

  async function fetchNotes() {
    const result = await db.getAllAsync<Note>('SELECT * FROM notes');
    setNotes(result);
  }
  async function fetchFolders() {
    const result = await db.getAllAsync<Folder>('SELECT * FROM folders');
    setFolders(result);
  }

  useEffect(() => {
    fetchFolders();
    fetchNotes();

  }, []);

  return (
    <AppContext.Provider value={{folders, setFolders,  notes, setNotes, open, setOpen, saveNote, setEditItem, editItem, deleteNotesByIds, activeFilter, setActiveFilter }}>
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
