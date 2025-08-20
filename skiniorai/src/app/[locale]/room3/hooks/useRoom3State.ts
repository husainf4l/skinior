import { useState, useCallback } from 'react';

interface Room3Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface Room3Participant {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

interface Room3State {
  isActive: boolean;
  participants: Room3Participant[];
  messages: Room3Message[];
  currentView: 'camera' | 'screen' | 'gallery';
  error: string | null;
  sessionDuration: number;
  isRecording: boolean;
}

export function useRoom3State() {
  const [state, setState] = useState<Room3State>({
    isActive: false,
    participants: [],
    messages: [],
    currentView: 'camera',
    error: null,
    sessionDuration: 0,
    isRecording: false,
  });

  const updateState = useCallback((updates: Partial<Room3State>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const addParticipant = useCallback((participant: Omit<Room3Participant, 'id'>) => {
    const newParticipant: Room3Participant = {
      ...participant,
      id: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setState(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
    }));
  }, []);

  const removeParticipant = useCallback((participantId: string) => {
    setState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId),
    }));
  }, []);

  const sendMessage = useCallback((content: string, sender: string = 'You') => {
    const newMessage: Room3Message = {
      id: `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      content,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  const setCurrentView = useCallback((view: string) => {
    const validView = view as 'camera' | 'screen' | 'gallery';
    setState(prev => ({ ...prev, currentView: validView }));
  }, []);

  const startSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      error: null,
      sessionDuration: 0,
    }));
  }, []);

  const endSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      isRecording: false,
      participants: [],
      messages: [],
    }));
  }, []);

  const toggleRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: !prev.isRecording }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isActive: false,
      participants: [],
      messages: [],
      currentView: 'camera',
      error: null,
      sessionDuration: 0,
      isRecording: false,
    });
  }, []);

  return {
    ...state,
    updateState,
    updateError,
    addParticipant,
    removeParticipant,
    sendMessage,
    clearMessages,
    setCurrentView,
    startSession,
    endSession,
    toggleRecording,
    resetState,
  };
}
