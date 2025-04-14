import { useContext } from 'react';
import { ContentContext } from '../context/ContentContext';

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a ContentProvider");
  }

  return context;
}