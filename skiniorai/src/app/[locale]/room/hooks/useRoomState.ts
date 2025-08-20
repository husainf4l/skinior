import { useState, useCallback } from 'react';

// Room state management hook

interface RoomMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

interface RoomParticipant {
  id: string;
  name: string;
  isAgent: boolean;
}

interface RoomState {
  isActive: boolean;
  participants: RoomParticipant[];
  messages: RoomMessage[];
  currentView: string;
  error: string | null;
  isRecording?: boolean;
  sessionDuration?: number;
}

export function useRoomState() {
  const [state, setState] = useState<RoomState>({
    isActive: false,
    participants: [],
    messages: [],
    currentView: 'camera',
    error: null,
  });

  const updateState = useCallback((updates: Partial<RoomState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const addParticipant = useCallback((participant: Omit<RoomParticipant, 'id'>) => {
    const newParticipant: RoomParticipant = {
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
    const newMessage: RoomMessage = {
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
