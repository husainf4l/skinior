import React, { 
  useState, 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  InteractionManager,
  LayoutAnimation,
} from 'react-native';
// Note: For haptics, would need react-native-haptic-feedback or expo-haptics
// Using basic feedback for now
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../contexts/ThemeContext';
import ChatService, {
  ChatService as ChatServiceClass,
} from '../services/ChatService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Enhanced TypeScript interfaces
interface Message {
  readonly id: string;
  content: string;
  readonly isUser: boolean;
  readonly timestamp: Date;
  isStreaming?: boolean;
  thoughts?: string;
  actions?: string;
  observations?: string;
  hasThoughts?: boolean;
  hasActions?: boolean;
  hasObservations?: boolean;
  isThinkingComplete?: boolean;
}

interface ChatScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (route: string) => void;
  };
}

interface MessageBubbleProps {
  message: Message;
  isExpanded: boolean;
  onToggleThoughts: (messageId: string) => void;
  colors: any;
  styles: any;
  scaleAnim: Animated.Value;
}

interface HeaderProps {
  navigation: ChatScreenProps['navigation'];
  onClearChat: () => void;
  colors: any;
  styles: any;
}

interface ChatState {
  messages: Message[];
  inputText: string;
  isLoading: boolean;
  threadId: string | null;
  useStreaming: boolean;
  expandedThoughts: Set<string>;
}

// Memoized Message Bubble Component for Performance
const MessageBubble = memo<MessageBubbleProps>(({ 
  message, 
  isExpanded, 
  onToggleThoughts, 
  colors, 
  styles, 
  scaleAnim 
}) => {
  const handleToggleThoughts = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleThoughts(message.id);
  }, [message.id, onToggleThoughts]);

  const timestampText = useMemo(() => 
    message.timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }), [message.timestamp]
  );

  return (
    <View
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.assistantMessage,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`${message.isUser ? 'Your message' : 'AI response'}: ${message.content}`}
    >
      {!message.isUser &&
        (message.hasThoughts ||
          message.hasActions ||
          message.hasObservations) && (
          <View style={styles.thinkingContainer}>
            <TouchableOpacity
              style={styles.thinkingHeader}
              onPress={handleToggleThoughts}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={isExpanded ? 'Hide AI reasoning' : 'Show AI reasoning'}
              accessibilityHint="Double tap to toggle AI thinking process"
            >
              <View
                style={[
                  styles.thinkingIndicator,
                  !message.isThinkingComplete &&
                    styles.thinkingIndicatorActive,
                ]}
              >
                {!message.isThinkingComplete ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <SFSymbol
                    name="brain.head.profile"
                    size={12}
                    color={colors.accent}
                    weight="medium"
                  />
                )}
              </View>
              <Text style={styles.thinkingLabel}>
                {message.isThinkingComplete
                  ? 'AI Analysis Complete'
                  : 'AI working...'}
              </Text>
              <View style={styles.thinkingControls}>
                {!message.isThinkingComplete && (
                  <View style={styles.streamingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                )}
                <SFSymbol
                  name={isExpanded ? 'chevron.up' : 'chevron.down'}
                  size={12}
                  color={colors.textTertiary}
                  weight="medium"
                />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.thinkingContent}>
                <View style={styles.thinkingProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: message.isThinkingComplete ? '100%' : '60%' },
                    ]}
                  />
                </View>

                {/* Thoughts Section */}
                {message.thoughts && (
                  <View style={styles.agenticSection}>
                    <View style={styles.agenticSectionHeader}>
                      <SFSymbol
                        name="brain"
                        size={12}
                        color={colors.accent}
                        weight="medium"
                      />
                      <Text style={styles.agenticSectionTitle}>Thinking</Text>
                    </View>
                    <Text style={styles.agenticSectionText}>
                      {message.thoughts}
                    </Text>
                  </View>
                )}

                {/* Actions Section */}
                {message.actions && (
                  <View style={styles.agenticSection}>
                    <View style={styles.agenticSectionHeader}>
                      <SFSymbol
                        name="bolt.fill"
                        size={12}
                        color={colors.warning}
                        weight="medium"
                      />
                      <Text
                        style={[
                          styles.agenticSectionTitle,
                          { color: colors.warning },
                        ]}
                      >
                        Actions
                      </Text>
                    </View>
                    <Text style={styles.agenticSectionText}>
                      {message.actions}
                    </Text>
                  </View>
                )}

                {/* Observations Section */}
                {message.observations && (
                  <View style={styles.agenticSection}>
                    <View style={styles.agenticSectionHeader}>
                      <SFSymbol
                        name="eye.fill"
                        size={12}
                        color={colors.primary}
                        weight="medium"
                      />
                      <Text
                        style={[
                          styles.agenticSectionTitle,
                          { color: colors.primary },
                        ]}
                      >
                        Observations
                      </Text>
                    </View>
                    <Text style={styles.agenticSectionText}>
                      {message.observations}
                    </Text>
                  </View>
                )}

                {!message.isThinkingComplete && (
                  <Text style={styles.streamingHint}>
                    ● Streaming AI reasoning...
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

      <Animated.View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.assistantBubble,
          !message.isUser &&
            message.hasThoughts &&
            styles.assistantBubbleWithThoughts,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {!message.isUser && message.hasThoughts && (
          <View style={styles.finalAnswerHeader}>
            <SFSymbol
              name="checkmark.seal.fill"
              size={14}
              color={colors.success}
              weight="medium"
            />
            <Text style={styles.finalAnswerLabel}>Final Answer</Text>
            {message.isThinkingComplete && (
              <View style={styles.completeBadge}>
                <Text style={styles.completeBadgeText}>✓</Text>
              </View>
            )}
          </View>
        )}

        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.assistantText,
          ]}
          selectable
        >
          {message.content}
        </Text>

        {message.isStreaming && (
          <View style={styles.streamingIndicator}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.streamingText}>
              {message.hasThoughts && !message.isThinkingComplete
                ? 'Thinking...'
                : 'Responding...'}
            </Text>
          </View>
        )}
      </Animated.View>

      <Text style={styles.timestamp} accessible={false}>
        {timestampText}
      </Text>
    </View>
  );
});

// Memoized Header Component
const ChatHeader = memo<HeaderProps>(({ navigation, onClearChat, colors, styles }) => {
  const handleBackPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.goBack();
  }, [navigation]);

  const handleClearPress = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onClearChat();
  }, [onClearChat]);

  return (
    <View style={styles.modernHeader}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        accessibilityHint="Navigate to previous screen"
      >
        <View style={styles.iconContainer}>
          <SFSymbol
            name="chevron.left"
            size={20}
            color={colors.text}
            weight="semibold"
          />
        </View>
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          AI Chat
        </Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusLabel}>Online</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.menuButton}
        onPress={handleClearPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Clear chat"
        accessibilityHint="Delete all messages in this conversation"
      >
        <View style={styles.iconContainer}>
          <SFSymbol
            name="trash.circle"
            size={24}
            color={colors.error}
            weight="medium"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
});

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors, isDark, insets), [colors, isDark, insets]);

  // Optimized state management
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    inputText: '',
    isLoading: false,
    threadId: null,
    useStreaming: true,
    expandedThoughts: new Set(),
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Initialize with optimized animations
  useEffect(() => {
    setChatState(prev => ({
      ...prev,
      threadId: ChatServiceClass.generateThreadId()
    }));

    InteractionManager.runAfterInteractions(() => {
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );
    pulseLoop.start();

    return () => {
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation(); 
      scaleAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const clearChat = useCallback(() => {
    Alert.alert(
      'Clear Chat', 
      'Are you sure you want to clear all messages?', 
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setChatState(prev => ({
              ...prev,
              messages: [],
              threadId: ChatServiceClass.generateThreadId(),
            }));
            inputRef.current?.blur();
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  const toggleThoughts = useCallback((messageId: string) => {
    setChatState(prev => {
      const newSet = new Set(prev.expandedThoughts);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return { ...prev, expandedThoughts: newSet };
    });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!chatState.inputText.trim() || chatState.isLoading || !chatState.threadId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: chatState.inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputText: '',
      isLoading: true,
    }));

    scrollToBottom();

    const assistantMessageId = `assistant_${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
      thoughts: '',
      actions: '',
      observations: '',
      hasThoughts: false,
      hasActions: false,
      hasObservations: false,
      isThinkingComplete: false,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
    }));

    try {
      if (chatState.useStreaming) {
        await ChatService.sendMessageWithRealStreaming(
          userMessage.content,
          chatState.threadId,
          (thoughtChunk: string) => {
            setChatState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      thoughts: (msg.thoughts || '') + thoughtChunk,
                      hasThoughts: true,
                      isThinkingComplete: false,
                    }
                  : msg,
              ),
              expandedThoughts: new Set([...prev.expandedThoughts, assistantMessageId]),
            }));
            scrollToBottom();
          },
          (actionChunk: string) => {
            setChatState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      actions: (msg.actions || '') + actionChunk,
                      hasActions: true,
                      isThinkingComplete: false,
                    }
                  : msg,
              ),
              expandedThoughts: new Set([...prev.expandedThoughts, assistantMessageId]),
            }));
            scrollToBottom();
          },
          (observationChunk: string) => {
            setChatState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      observations: (msg.observations || '') + observationChunk,
                      hasObservations: true,
                      isThinkingComplete: false,
                    }
                  : msg,
              ),
              expandedThoughts: new Set([...prev.expandedThoughts, assistantMessageId]),
            }));
            scrollToBottom();
          },
          (answerChunk: string) => {
            setChatState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: msg.content + answerChunk,
                      isThinkingComplete: true,
                    }
                  : msg,
              ),
            }));
            scrollToBottom();
          },
          () => {
            setChatState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, isStreaming: false }
                  : msg,
              ),
            }));
            
            // Auto-minimize thoughts after completion
            setTimeout(() => {
              setChatState(prev => {
                const newSet = new Set(prev.expandedThoughts);
                newSet.delete(assistantMessageId);
                return { ...prev, expandedThoughts: newSet };
              });
            }, 2000);

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        'Connection Error',
        error instanceof Error
          ? error.message
          : 'Failed to connect to the chat service.',
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );

      setChatState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== assistantMessageId),
      }));
    } finally {
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  }, [chatState.inputText, chatState.isLoading, chatState.threadId, chatState.useStreaming, scrollToBottom]);

  const handleInputChange = useCallback((text: string) => {
    setChatState(prev => ({ ...prev, inputText: text }));
  }, []);

  const renderMessage = useCallback((message: Message) => {
    const isExpanded = chatState.expandedThoughts.has(message.id);
    return (
      <MessageBubble
        key={message.id}
        message={message}
        isExpanded={isExpanded}
        onToggleThoughts={toggleThoughts}
        colors={colors}
        styles={styles}
        scaleAnim={scaleAnim}
      />
    );
  }, [chatState.expandedThoughts, toggleThoughts, colors, styles, scaleAnim]);

  const memoizedMessages = useMemo(() => 
    chatState.messages.map(renderMessage), 
    [chatState.messages, renderMessage]
  );

  return (
    <View style={styles.gradientBackground}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ChatHeader
          navigation={navigation}
          onClearChat={clearChat}
          colors={colors}
          styles={styles}
        />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
          >
            {chatState.messages.length === 0 ? (
              <View style={styles.emptyState}>
                <Animated.View
                  style={{
                    transform: [{ scale: pulseAnim }],
                  }}
                >
                  <SFSymbol
                    name="bubble.left.and.bubble.right"
                    size={64}
                    color={colors.textTertiary}
                    weight="ultralight"
                  />
                </Animated.View>
                <Text style={styles.emptyStateText}>
                  Start a conversation
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Ask questions, get help, or explore ideas with AI
                </Text>
              </View>
            ) : (
              memoizedMessages
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={chatState.inputText}
                onChangeText={handleInputChange}
                placeholder="Ask me anything..."
                placeholderTextColor={colors.textTertiary}
                multiline
                maxLength={2000}
                editable={!chatState.isLoading}
                accessibilityRole="search"
                accessibilityLabel="Message input"
                accessibilityHint="Type your message to the AI assistant"
                returnKeyType="send"
                enablesReturnKeyAutomatically
                textAlignVertical="center"
                autoCapitalize="sentences"
                autoCorrect
                spellCheck
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!chatState.inputText.trim() || chatState.isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!chatState.inputText.trim() || chatState.isLoading}
                accessibilityRole="button"
                accessibilityLabel="Send message"
                accessibilityHint="Send your message to the AI assistant"
                activeOpacity={0.8}
              >
                {chatState.isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <SFSymbol
                    name="arrow.up"
                    size={16}
                    color="#FFFFFF"
                    weight="semibold"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean, insets: any) =>
  StyleSheet.create({
    gradientBackground: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FBFBFD',
    },
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    keyboardContainer: {
      flex: 1,
    },
    modernHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top + 12,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: isDark 
        ? 'rgba(28, 28, 30, 0.98)'
        : 'rgba(255, 255, 255, 0.98)',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.4 : 0.05,
      shadowRadius: 4,
      elevation: 0,
      borderBottomWidth: 0.33,
      borderBottomColor: isDark 
        ? 'rgba(84, 84, 88, 0.6)'
        : 'rgba(60, 60, 67, 0.12)',
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark 
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: -0.41,
      marginBottom: 2,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark 
        ? 'rgba(48, 209, 88, 0.15)'
        : 'rgba(48, 209, 88, 0.1)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    statusDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#30D158',
      marginRight: 4,
    },
    statusLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: '#30D158',
      letterSpacing: 0.2,
    },
    menuButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messagesContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 24,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    emptyStateText: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 8,
      letterSpacing: -0.4,
    },
    emptyStateSubtext: {
      fontSize: 16,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 22,
      fontWeight: '400',
      letterSpacing: -0.24,
    },
    messageContainer: {
      marginBottom: 20,
    },
    userMessage: {
      alignItems: 'flex-end',
    },
    assistantMessage: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 16,
      borderRadius: 20,
      marginBottom: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    userBubble: {
      backgroundColor: '#007AFF',
      borderBottomRightRadius: 6,
    },
    assistantBubble: {
      backgroundColor: isDark 
        ? 'rgba(44, 44, 46, 1)'
        : 'rgba(255, 255, 255, 1)',
      borderBottomLeftRadius: 6,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: 'rgba(60, 60, 67, 0.12)',
    },
    assistantBubbleWithThoughts: {
      borderTopWidth: 1,
      borderTopColor: isDark 
        ? 'rgba(48, 209, 88, 0.4)'
        : 'rgba(48, 209, 88, 0.3)',
    },
    messageText: {
      fontSize: 17,
      lineHeight: 25,
      fontWeight: '400',
      letterSpacing: -0.41,
    },
    userText: {
      color: '#FFFFFF',
    },
    assistantText: {
      color: colors.text,
    },
    streamingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    streamingText: {
      fontSize: 13,
      color: colors.textTertiary,
      marginLeft: 8,
      fontWeight: '500',
      letterSpacing: -0.08,
    },
    thinkingContainer: {
      backgroundColor: isDark 
        ? 'rgba(28, 28, 30, 0.98)'
        : 'rgba(246, 246, 246, 0.98)',
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: 'rgba(60, 60, 67, 0.08)',
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.2 : 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    thinkingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark 
        ? 'rgba(44, 44, 46, 0.9)'
        : 'rgba(255, 255, 255, 0.9)',
      borderBottomWidth: 0.5,
      borderBottomColor: isDark 
        ? 'rgba(84, 84, 88, 0.4)'
        : 'rgba(60, 60, 67, 0.08)',
    },
    thinkingIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.accent + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    thinkingIndicatorActive: {
      backgroundColor: colors.accent + '25',
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    thinkingLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: -0.24,
    },
    thinkingControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    streamingDots: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent,
      marginHorizontal: 1,
    },
    dot1: { opacity: 0.4 },
    dot2: { opacity: 0.6 },
    dot3: { opacity: 0.8 },
    thinkingProgress: {
      height: 2,
      backgroundColor: isDark 
        ? 'rgba(84, 84, 88, 0.4)'
        : 'rgba(60, 60, 67, 0.12)',
      borderRadius: 1,
      marginBottom: 16,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 1,
    },
    thinkingContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'transparent',
    },
    agenticSection: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: isDark 
        ? 'rgba(84, 84, 88, 0.3)'
        : 'rgba(60, 60, 67, 0.08)',
    },
    agenticSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    agenticSectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.accent,
      marginLeft: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    agenticSectionText: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
      marginLeft: 20,
      letterSpacing: -0.24,
    },
    streamingHint: {
      fontSize: 11,
      color: colors.accent,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'right',
      letterSpacing: 0.2,
    },
    finalAnswerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: isDark 
        ? 'rgba(48, 209, 88, 0.4)'
        : 'rgba(48, 209, 88, 0.3)',
    },
    finalAnswerLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.success,
      marginLeft: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      flex: 1,
    },
    completeBadge: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.success,
      justifyContent: 'center',
      alignItems: 'center',
    },
    completeBadgeText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    timestamp: {
      fontSize: 12,
      color: colors.textTertiary,
      marginHorizontal: 4,
      fontWeight: '500',
      letterSpacing: -0.08,
    },
    inputContainer: {
      backgroundColor: isDark 
        ? 'rgba(28, 28, 30, 0.98)'
        : 'rgba(255, 255, 255, 0.98)',
      borderTopWidth: 0.5,
      borderTopColor: isDark 
        ? 'rgba(84, 84, 88, 0.6)'
        : 'rgba(60, 60, 67, 0.12)',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: Math.max(insets.bottom, 12),
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: isDark 
        ? 'rgba(44, 44, 46, 1)'
        : 'rgba(242, 242, 247, 1)',
      borderRadius: 20,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: 'rgba(60, 60, 67, 0.12)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.2 : 0.02,
      shadowRadius: 3,
      elevation: 1,
    },
    textInput: {
      flex: 1,
      fontSize: 17,
      color: colors.text,
      maxHeight: 120,
      minHeight: 20,
      paddingVertical: 2,
      letterSpacing: -0.41,
      fontWeight: '400',
    },
    sendButton: {
      backgroundColor: colors.accent,
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    sendButtonDisabled: {
      opacity: 0.4,
      shadowOpacity: 0,
    },
  });

export default memo(ChatScreen);