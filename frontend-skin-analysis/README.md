# Frontend Skin Analysis

A real-time web interface for AI-powered skin analysis using LiveKit and computer vision.

## Features

- **Live Video Analysis**: Real-time video processing with OpenCV-based skin analysis
- **Interactive Overlays**: Face detection boxes, analysis points, and problem area highlighting
- **Real-time Metrics**: Live display of skin tone, texture score, hydration levels
- **Problem Detection**: Visual identification of dark spots, blemishes, and skin issues
- **Smart Recommendations**: AI-generated skincare recommendations based on analysis
- **Responsive Design**: Beautiful glass-morphism UI that works on desktop and mobile

## Components

### HTML Structure

- **Video Section**: Live camera feed with analysis overlays
- **Analysis Panel**: Real-time metrics and results display
- **Control Interface**: Connection and analysis controls

### JavaScript Features

- **SkinAnalysisClient**: Main client class handling LiveKit connection
- **Real-time Data Processing**: Receives and displays analysis data from Agent16
- **Canvas Overlays**: Draws analysis markers on video feed
- **Recommendation Engine**: Generates personalized skincare advice

## Setup

1. **Start a local server**:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve . -p 8080
```

2. **Open in browser**:

```
http://localhost:8080
```

3. **Configure backend**:
   - Update LiveKit URL in `script.js`
   - Implement token generation endpoint
   - Ensure Agent16 is running on port 8009

## Configuration

### LiveKit Connection

```javascript
const url = "wss://your-livekit-url";
const token = await generateRoomToken();
```

### Analysis Settings

```json
{
  "visionConfig": {
    "analysisInterval": 5,
    "enableSkinTone": true,
    "enableTextureAnalysis": true,
    "enableProblemDetection": true
  }
}
```

## Features Showcase

### Real-time Analysis

- Face detection with bounding boxes
- Skin tone classification (5 categories)
- Texture quality scoring (0-10 scale)
- Hydration level estimation (percentage)

### Visual Overlays

- Green face detection boxes
- Red analysis point grid
- Problem area highlighting
- Live metric display

### Smart Recommendations

- Texture improvement suggestions
- Hydration-based product recommendations
- Dark spot treatment advice
- Sun protection reminders

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support with WebRTC enabled
- **Mobile**: Responsive design with touch controls

## Development

### Testing without Agent16

The frontend includes mock data for development:

```javascript
// Mock analysis data
const mockAnalysis = {
  faces: [
    {
      bbox: [100, 100, 200, 200],
      skin_tone: "Medium",
      texture_score: 7.5,
      hydration_level: 65,
    },
  ],
};
```

### Customization

- Modify analysis display in `updateAnalysisDisplay()`
- Customize overlays in `drawAnalysisOverlay()`
- Add new recommendations in `generateRecommendations()`

## Production Deployment

1. **Token Generation**: Implement secure backend endpoint
2. **HTTPS**: Required for camera access
3. **WebRTC**: Ensure firewall/NAT compatibility
4. **Error Handling**: Add connection retry logic
