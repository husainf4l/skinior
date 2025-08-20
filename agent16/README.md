# Agent16 - Computer Vision Skin Analysis Agent

A real-time computer vision agent that performs skin analysis using OpenCV and overlays analysis markers on video streams.

## Features

- Real-time face detection and tracking
- Skin tone analysis with LAB color space
- Texture quality assessment using Laplacian variance
- Problem area detection (dark spots, blemishes)
- Hydration level estimation
- Live video overlay with analysis nodes and markers

## Setup

1. Install computer vision dependencies:

```bash
pip install -r requirements-vision.txt
```

2. Set environment variables:

```bash
export LIVEKIT_URL="your-livekit-url"
export LIVEKIT_API_KEY="your-api-key"
export LIVEKIT_API_SECRET="your-api-secret"
export LIVEKIT_AGENT_PORT=8009
```

3. Run the agent:

```bash
python main.py dev
```

## Configuration

Configure analysis via room metadata:

```json
{
  "visionConfig": {
    "analysisInterval": 5,
    "enableSkinTone": true,
    "enableTextureAnalysis": true,
    "enableProblemDetection": true
  },
  "language": "english"
}
```

## Architecture

- **SkinAnalysisAgent**: Main agent handling video stream processing
- **SkinAnalyzer**: Core skin analysis algorithms
- **ColorAnalyzer**: Skin tone detection and classification
- **TextureAnalyzer**: Skin texture quality assessment

## Analysis Features

### Skin Tone Detection

- LAB color space analysis
- 5-category classification (Very Light to Very Dark)

### Texture Analysis

- Laplacian variance-based smoothness scoring
- 0-10 scale texture quality rating

### Problem Detection

- Dark spot identification
- Blemish area detection with severity scoring

### Visual Overlays

- Face bounding boxes
- Analysis point grid
- Problem area highlighting
- Real-time metric display
