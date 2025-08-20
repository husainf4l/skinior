class SkinAnalysisClient {
    constructor() {
        this.room = null;
        this.localTrack = null;
        this.remoteTrack = null;
        this.analysisData = null;
        this.isAnalyzing = false;
        this.canvas = document.getElementById('analysisOverlay');
        this.ctx = this.canvas.getContext('2d');
        
                // Use the token from your API
        this.config = {
            url: 'wss://widdai-aphl2lb9.livekit.cloud',
            token: 'eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tIjoic2tpbi1hbmFseXNpcy1saXZlIiwicm9vbUpvaW4iOnRydWV9LCJpc3MiOiJBUEl6dzc0cmNoZ0NNN2UiLCJleHAiOjE3NTU2NTI4NDUsIm5iZiI6MCwic3ViIjoiR3Vlc3QifQ.Ndsg1ts2CGB5GBgcbcccjJW-N2nW1MQ3L7OQ0mMQWkI',
            roomName: 'skin-analysis-live'
        };
        
        this.setupEventListeners();
        this.startLocalVideo();
    }

    setupEventListeners() {
        document.getElementById('connectBtn').addEventListener('click', () => this.connectToRoom());
        document.getElementById('toggleCamera').addEventListener('click', () => this.toggleCamera());
        document.getElementById('toggleAnalysis').addEventListener('click', () => this.toggleAnalysis());
        
        // Resize canvas when window resizes
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    async startLocalVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }, 
                audio: false 
            });
            
            const videoElement = document.getElementById('localVideo');
            videoElement.srcObject = stream;
            
            // Resize canvas to match video
            videoElement.addEventListener('loadedmetadata', () => {
                this.resizeCanvas();
            });
            
        } catch (error) {
            console.error('Failed to start local video:', error);
            this.updateStatus('Failed to access camera', 'error');
        }
    }

    resizeCanvas() {
        const videoElement = document.getElementById('localVideo');
        const container = videoElement.parentElement;
        
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    async connectToRoom() {
        try {
            this.updateStatus('Connecting to room...', 'warning');
            
            this.room = new LiveKit.Room({
                adaptiveStream: true,
                dynacast: true,
            });

            this.room.on(LiveKit.RoomEvent.Connected, () => {
                console.log('Connected to room');
                this.updateStatus('Connected - Analysis Ready', 'success');
                this.isAnalyzing = true;
            });

            this.room.on(LiveKit.RoomEvent.Disconnected, () => {
                console.log('Disconnected from room');
                this.updateStatus('Disconnected', 'error');
                this.isAnalyzing = false;
            });

            this.room.on(LiveKit.RoomEvent.TrackSubscribed, (track, publication, participant) => {
                if (track.kind === LiveKit.Track.Kind.Video && participant.isAgent) {
                    console.log('Subscribed to agent video track (processed)');
                    this.handleAgentVideo(track);
                }
            });

            this.room.on(LiveKit.RoomEvent.DataReceived, (payload, participant) => {
                if (participant.isAgent) {
                    this.handleAnalysisData(payload);
                }
            });

            // Connect using the pre-generated token
            await this.room.connect(this.config.url, this.config.token);

            // Publish local video
            await this.publishLocalVideo();
            
        } catch (error) {
            console.error('Failed to connect to room:', error);
            this.updateStatus('Connection failed', 'error');
        }
    }

    async publishLocalVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }, 
                audio: false 
            });

            this.localTrack = await LiveKit.createLocalVideoTrack({
                resolution: LiveKit.VideoPresets.h720.resolution,
                facingMode: 'user'
            });

            await this.room.localParticipant.publishTrack(this.localTrack);
            console.log('Published local video track');
            
        } catch (error) {
            console.error('Failed to publish video:', error);
        }
    }

    async generateRoomToken() {
        // This is a mock token generation - implement your token endpoint
        const roomName = `skincare-analysis-${Date.now()}`;
        const participantName = `user-${Math.random().toString(36).substr(2, 9)}`;
        
        // In production, call your backend endpoint to generate token
        const response = await fetch('/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomName: roomName,
                participantName: participantName,
                metadata: JSON.stringify({
                    type: "skincare_analysis",
                    visionConfig: {
                        analysisInterval: 5,
                        enableSkinTone: true,
                        enableTextureAnalysis: true,
                        enableProblemDetection: true
                    },
                    language: "english"
                })
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get room token');
        }

        const data = await response.json();
        return data.token;
    }

    handleAnalysisData(payload) {
        try {
            const data = JSON.parse(new TextDecoder().decode(payload));
            this.analysisData = data;
            this.updateAnalysisDisplay(data);
            this.drawAnalysisOverlay(data);
        } catch (error) {
            console.error('Failed to parse analysis data:', error);
        }
    }

    updateAnalysisDisplay(data) {
        // Update face count
        document.getElementById('facesCount').textContent = data.faces?.length || 0;
        
        // Update analysis metrics
        if (data.faces && data.faces.length > 0) {
            const face = data.faces[0]; // Use first detected face
            
            // Skin tone
            document.getElementById('skinTone').textContent = face.skin_tone || 'Unknown';
            
            // Texture score
            const textureScore = face.texture_score || 0;
            document.getElementById('textureScore').textContent = `${textureScore.toFixed(1)}/10`;
            document.getElementById('textureProgress').style.width = `${(textureScore / 10) * 100}%`;
            
            // Hydration level
            const hydrationLevel = face.hydration_level || 0;
            document.getElementById('hydrationLevel').textContent = `${hydrationLevel.toFixed(1)}%`;
            document.getElementById('hydrationProgress').style.width = `${hydrationLevel}%`;
            
            // Update problem areas
            this.updateProblemAreas(face.problem_areas || []);
            
            // Generate recommendations
            this.updateRecommendations(face);
        }
        
        // Update processing time
        if (data.processing_time) {
            document.getElementById('processingTime').textContent = `${data.processing_time}ms`;
        }
        
        // Update analysis status
        const statusElement = document.getElementById('analysisStatus');
        statusElement.className = 'status-indicator analyzing';
    }

    updateProblemAreas(problems) {
        const container = document.getElementById('problemAreas');
        
        if (problems.length === 0) {
            container.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">No issues detected</p>';
            return;
        }
        
        container.innerHTML = problems.map(problem => `
            <div class="problem-item">
                <div class="problem-type">${problem.type.replace('_', ' ').toUpperCase()}</div>
                <div class="problem-severity">Severity: ${problem.severity?.toFixed(1) || 'Unknown'}</div>
            </div>
        `).join('');
    }

    updateRecommendations(faceData) {
        const recommendations = this.generateRecommendations(faceData);
        const container = document.getElementById('recommendations');
        
        if (recommendations.length === 0) {
            container.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">All good! No specific recommendations</p>';
            return;
        }
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">${rec}</div>
        `).join('');
    }

    generateRecommendations(faceData) {
        const recommendations = [];
        
        // Texture-based recommendations
        if (faceData.texture_score < 5) {
            recommendations.push('Consider using a gentle exfoliating cleanser to improve skin texture');
        }
        
        // Hydration-based recommendations
        if (faceData.hydration_level < 40) {
            recommendations.push('Your skin appears dehydrated. Use a hydrating serum and moisturizer');
        } else if (faceData.hydration_level < 60) {
            recommendations.push('Maintain hydration with a daily moisturizer');
        }
        
        // Problem area recommendations
        if (faceData.problem_areas && faceData.problem_areas.length > 0) {
            const hasDarkSpots = faceData.problem_areas.some(p => p.type === 'dark_spot');
            if (hasDarkSpots) {
                recommendations.push('Dark spots detected. Consider using vitamin C serum or retinoids');
            }
        }
        
        // Skin tone recommendations
        if (faceData.skin_tone) {
            if (faceData.skin_tone.includes('Light')) {
                recommendations.push('Use SPF 30+ daily to protect from UV damage');
            } else if (faceData.skin_tone.includes('Dark')) {
                recommendations.push('Focus on evening skin tone with niacinamide products');
            }
        }
        
        return recommendations;
    }

    drawAnalysisOverlay(data) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!data.faces || data.faces.length === 0) return;
        
        const videoElement = document.querySelector('#localVideo, #remoteVideo:not([style*="display: none"])');
        if (!videoElement) return;
        
        // Calculate scaling factors
        const scaleX = this.canvas.width / videoElement.videoWidth;
        const scaleY = this.canvas.height / videoElement.videoHeight;
        
        data.faces.forEach(face => {
            const [x, y, w, h] = face.bbox;
            
            // Scale coordinates
            const scaledX = x * scaleX;
            const scaledY = y * scaleY;
            const scaledW = w * scaleX;
            const scaledH = h * scaleY;
            
            // Draw face bounding box
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);
            
            // Draw analysis points
            if (face.landmarks) {
                this.ctx.fillStyle = '#ff0000';
                face.landmarks.forEach(([px, py]) => {
                    const scaledPx = (x + px) * scaleX;
                    const scaledPy = (y + py) * scaleY;
                    this.ctx.beginPath();
                    this.ctx.arc(scaledPx, scaledPy, 3, 0, 2 * Math.PI);
                    this.ctx.fill();
                });
            }
            
            // Draw problem areas
            if (face.problem_areas) {
                this.ctx.strokeStyle = '#ff0000';
                this.ctx.lineWidth = 1;
                face.problem_areas.forEach(problem => {
                    const [px, py, pw, ph] = problem.region;
                    const scaledPx = (x + px) * scaleX;
                    const scaledPy = (y + py) * scaleY;
                    const scaledPw = pw * scaleX;
                    const scaledPh = ph * scaleY;
                    this.ctx.strokeRect(scaledPx, scaledPy, scaledPw, scaledPh);
                });
            }
            
            // Draw text overlay
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(`Tone: ${face.skin_tone || 'Unknown'}`, scaledX, scaledY - 10);
            this.ctx.fillText(`Texture: ${(face.texture_score || 0).toFixed(1)}/10`, scaledX, scaledY - 30);
            this.ctx.fillText(`Hydration: ${(face.hydration_level || 0).toFixed(1)}%`, scaledX, scaledY - 50);
        });
    }

    updateStatus(message, type) {
        const statusElement = document.getElementById('connectionStatus');
        const indicator = statusElement.querySelector('.status-indicator');
        
        statusElement.className = `connection-status ${type}`;
        statusElement.innerHTML = `<div class="status-indicator"></div>${message}`;
    }

    toggleCamera() {
        if (this.localTrack) {
            this.localTrack.mute();
            document.getElementById('toggleCamera').textContent = 
                this.localTrack.isMuted ? 'Enable Camera' : 'Disable Camera';
        }
    }

    toggleAnalysis() {
        this.isAnalyzing = !this.isAnalyzing;
        document.getElementById('toggleAnalysis').textContent = 
            this.isAnalyzing ? 'Stop Analysis' : 'Start Analysis';
        
        // Send analysis control message to agent
        if (this.room) {
            const controlMessage = {
                type: 'control',
                action: this.isAnalyzing ? 'start_analysis' : 'stop_analysis'
            };
            
            this.room.localParticipant.publishData(
                new TextEncoder().encode(JSON.stringify(controlMessage)),
                LiveKit.DataPacket_Kind.RELIABLE
            );
        }
    }

    resetUI() {
        document.getElementById('connectBtn').textContent = 'Connect to Analysis';
        document.getElementById('toggleCamera').disabled = true;
        document.getElementById('toggleAnalysis').disabled = true;
        
        // Reset analysis display
        document.getElementById('facesCount').textContent = '0';
        document.getElementById('skinTone').textContent = '-';
        document.getElementById('textureScore').textContent = '-';
        document.getElementById('hydrationLevel').textContent = '-';
        document.getElementById('textureProgress').style.width = '0%';
        document.getElementById('hydrationProgress').style.width = '0%';
        
        // Clear overlays
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async disconnect() {
        if (this.room) {
            await this.room.disconnect();
            this.room = null;
        }
        
        if (this.localTrack) {
            this.localTrack.stop();
            this.localTrack = null;
        }
    }
}

// Initialize the skin analysis client when page loads
document.addEventListener('DOMContentLoaded', () => {
    const client = new SkinAnalysisClient();
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        client.disconnect();
    });
});

// Mock token generation for testing (replace with your backend endpoint)
if (!window.location.pathname.includes('/api/token')) {
    // Mock fetch for development
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url === '/api/token') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    token: 'mock-token-for-development'
                })
            });
        }
        return originalFetch.apply(this, arguments);
    };
}
