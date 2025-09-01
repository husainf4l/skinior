# Chat Feature Documentation

## Overview

The chat feature provides real-time AI chat functionality using a streaming API endpoint. Users can have conversations with an AI assistant while maintaining thread continuity.

## Features

### ✅ Implemented

- **Clean Chat Interface**: Modern chat UI with message bubbles and timestamps
- **Thread Management**: Each conversation maintains a unique thread ID
- **API Integration**: Connects to `http://192.168.1.68:8007/chat-agent/chat/stream`
- **Error Handling**: Graceful error handling with user-friendly messages
- **Theme Integration**: Supports light/dark themes from the global theme system
- **Navigation Integration**: Accessible from side menu and floating action button
- **Message Persistence**: Messages persist during the session
- **Loading States**: Visual feedback during message sending
- **Clear Chat**: Option to clear conversation and start fresh

### 🔄 Future Enhancements

- **Real-time Streaming**: Character-by-character streaming (when React Native supports it better)
- **Message Persistence**: Save chat history to AsyncStorage
- **File Attachments**: Support for images and documents
- **Voice Messages**: Audio input/output
- **Message Search**: Search through chat history
- **Export Chat**: Export conversations as text/PDF

## API Integration

### Endpoint

```
POST http://192.168.1.68:8007/chat-agent/chat/stream
```

### Request Format

```json
{
  "message": "User's message text",
  "thread_id": "thread_1693584000000_abc123xyz"
}
```

### Response Format

Expected to return either:

- JSON with `content` or `message` field
- Plain text response

## File Structure

```
src/
├── screens/
│   └── Chat.tsx              # Main chat interface
├── services/
│   └── ChatService.ts        # API communication service
├── components/
│   └── MainLayout.tsx        # Updated with chat navigation
└── contexts/
    └── ThemeContext.tsx      # Theme integration
```

## Usage

### Accessing Chat

1. **From Side Menu**: Open the hamburger menu → "AI Chat"
2. **From Dashboard**: Tap the floating chat button (blue circle with chat icon)

### Chat Interface

- **Message Input**: Type message and tap send button
- **Message History**: Scrollable conversation history
- **Clear Chat**: Tap trash icon to clear conversation
- **Thread ID**: Displayed at bottom for debugging

### Navigation

- **Back Navigation**: Use device back button or navigate via side menu
- **Menu Access**: Hamburger menu remains accessible in chat

## Technical Details

### Thread Management

- Thread IDs are auto-generated: `thread_${timestamp}_${randomString}`
- New thread created when clearing chat
- Thread ID passed with every message for continuity

### Error Handling

- Network errors show user-friendly alerts
- Failed messages are removed from chat
- Graceful fallback for malformed responses

### Performance

- Efficient re-rendering with proper React keys
- Automatic scrolling to latest messages
- Minimal re-renders during typing

## Integration Notes

### Theme Support

The chat screen fully integrates with the global theme system:

- `colors.background` - Main background
- `colors.card` - Input area and message bubbles
- `colors.text` - Primary text color
- `colors.textTertiary` - Secondary text (timestamps, placeholders)
- `colors.accent` - Send button and user message bubbles
- `colors.error` - Error states and delete button

### Navigation Stack

Chat screen is added to the main navigation stack and accessible from:

- MainLayout side menu
- Dashboard floating action button
- Direct navigation calls

## Configuration

### API Endpoint

To change the API endpoint, update the `baseUrl` in `src/services/ChatService.ts`:

```typescript
private baseUrl = 'http://your-api-endpoint:port/chat-agent';
```

### Styling

Chat appearance can be customized in the `getStyles` function in `Chat.tsx`. All colors reference the theme system for consistency.
