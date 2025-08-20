// Skin Analysis Frontend - LiveKit Integration
class SkinAnalysisApp {
    constructor() {
        this.room = null;
        this.localVideoTrack = null;
        this.currentRoomName = '';
        this.analysisData = {
            faces: [],
            lastUpdate: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStatus('disconnected');
    }

    setupEventListeners() {
        // Connection controls
        document.getElementById('connectBtn')?.addEventListener('click', () => this.connect());
        document.getElementById('disconnectBtn')?.addEventListener('click', () => this.disconnect());
        
        // Analysis settings
        document.getElementById('analysisInterval')?.addEventListener('input', (e) => {
            document.getElementById('intervalValue').textContent = e.target.value;
        });
        
        // Settings checkboxes
        ['enableSkinTone', 'enableTexture', 'enableProblems'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.updateAnalysisSettings());
        });
    }

    async connect() {
        try {
            const roomName = document.getElementById('roomName')?.value || 'skincare-room-demo';
            this.currentRoomName = roomName;
            
            this.updateStatus('connecting');
            this.log('🔗 Connecting to skin analysis session...');
            
            // Get access token from your backend
            const token = await this.getAccessToken();
            
            // Create room instance
            this.room = new LiveKitClient.Room({
                adaptiveStream: true,
                dynacast: true,
            });
            
            // Set up room event handlers
            this.setupRoomEvents();
            
            // Connect to room
            const url = 'wss://widdai-aphl2lb9.livekit.cloud'; // Your LiveKit URL
            await this.room.connect(url, token);
            
            // Enable camera and microphone
            await this.enableCamera();
            
            this.updateStatus('connected');
            this.log('✅ Connected successfully! Starting skin analysis...');
            
            document.getElementById('connectBtn').disabled = true;
            document.getElementById('disconnectBtn').disabled = false;
            
        } catch (error) {
            console.error('Connection failed:', error);
            this.updateStatus('error');
            this.log(`❌ Connection failed: ${error.message}`);
        }
    }

    async getAccessToken() {
        try {
            const response = await fetch('http://localhost:4008/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomName: this.currentRoomName,
                    participantName: 'skin-analysis-user',
                    metadata: {
                        type: "skincare_consultation",
                        visionConfig: {
                            analysisInterval: parseInt(document.getElementById('analysisInterval')?.value || 5),
                            enableSkinTone: document.getElementById('enableSkinTone')?.checked,
                            enableTextureAnalysis: document.getElementById('enableTexture')?.checked,
                            enableProblemDetection: document.getElementById('enableProblems')?.checked
                        },
                        language: "english"
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error('Failed to get access token:', error);
            throw error;
        }
    }

    setupRoomEvents() {
        // Track subscribed - when we receive video from the vision agent
        this.room.on(LiveKitClient.RoomEvent.TrackSubscribed, (track, publication, participant) => {
            if (track.kind === LiveKitClient.Track.Kind.Video) {
                this.log(`📹 Receiving processed video from ${participant.identity}`);
                
                // Display the processed video with overlays
                const videoElement = document.getElementById('remoteVideo');
                if (videoElement) {
                    track.attach(videoElement);
                }
            }
        });

        // Data received - analysis results from vision agent
        this.room.on(LiveKitClient.RoomEvent.DataReceived, (payload, participant) => {
            try {
                const data = JSON.parse(new TextDecoder().decode(payload));
                this.handleAnalysisData(data);
            } catch (error) {
                console.error('Failed to parse analysis data:', error);
            }
        });

        // Participant connected
        this.room.on(LiveKitClient.RoomEvent.ParticipantConnected, (participant) => {
            this.log(`👤 ${participant.identity} joined the session`);
        });

        // Connection quality changed
        this.room.on(LiveKitClient.RoomEvent.ConnectionQualityChanged, (quality, participant) => {
            if (participant === this.room.localParticipant) {
                this.updateConnectionQuality(quality);
            }
        });

        // Disconnected
        this.room.on(LiveKitClient.RoomEvent.Disconnected, (reason) => {
            this.log(`🔌 Disconnected: ${reason}`);
            this.updateStatus('disconnected');
        });
    }

    async enableCamera() {
        try {
            // Create local video track
            this.localVideoTrack = await LiveKitClient.createLocalVideoTrack({
                resolution: LiveKitClient.VideoPresets.h720.resolution,
            });
            
            // Attach to local video element
            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                this.localVideoTrack.attach(localVideo);
            }
            
            // Publish to room
            await this.room.localParticipant.publishTrack(this.localVideoTrack);
            
            this.log('📹 Camera enabled and streaming');
            
        } catch (error) {
            console.error('Failed to enable camera:', error);
            this.log(`❌ Camera error: ${error.message}`);
        }
    }

    handleAnalysisData(data) {
        this.analysisData = { ...data, lastUpdate: Date.now() };
        this.updateAnalysisDisplay(data);
        this.logAnalysisData(data);
    }

    updateAnalysisDisplay(data) {
        // Update face count
        const faceCount = data.faces?.length || 0;
        this.updateElement('faceCount', faceCount);

        if (faceCount > 0) {
            const firstFace = data.faces[0];
            
            // Update skin tone
            this.updateElement('skinTone', firstFace.skin_tone || 'Unknown');
            
            // Update texture score
            const textureScore = firstFace.texture_score || 0;
            this.updateElement('textureScore', `${textureScore.toFixed(1)}/10`);
            
            // Update hydration level
            const hydration = firstFace.hydration_level || 0;
            this.updateElement('hydrationLevel', `${hydration.toFixed(1)}%`);
            
            // Update problem areas
            this.updateProblemAreas(firstFace.problem_areas || []);
            
            // Generate recommendations
            this.updateRecommendations(firstFace);
        } else {
            // No faces detected
            this.updateElement('skinTone', 'No face detected');
            this.updateElement('textureScore', '-');
            this.updateElement('hydrationLevel', '-');
            this.updateProblemAreas([]);
        }
    }

    updateProblemAreas(problems) {
        const problemList = document.getElementById('problemList');
        if (!problemList) return;

        if (problems.length === 0) {
            problemList.innerHTML = '<p class="no-problems">✅ No problems detected</p>';
            return;
        }

        const problemsHtml = problems.map(problem => `
            <div class="problem-item">
                <span class="problem-type">${this.formatProblemType(problem.type)}</span>
                <span class="problem-severity">Severity: ${problem.severity?.toFixed(1) || 'N/A'}</span>
            </div>
        `).join('');

        problemList.innerHTML = problemsHtml;
    }

    updateRecommendations(faceData) {
        const recommendations = this.generateRecommendations(faceData);
        const recommendationList = document.getElementById('recommendationList');
        
        if (!recommendationList) return;

        const recommendationsHtml = recommendations.map(rec => `
            <div class="recommendation-item">
                <span class="recommendation-icon">${rec.icon}</span>
                <span class="recommendation-text">${rec.text}</span>
            </div>
        `).join('');

        recommendationList.innerHTML = recommendationsHtml;
    }

    generateRecommendations(faceData) {
        const recommendations = [];
        
        // Texture-based recommendations
        const textureScore = faceData.texture_score || 0;
        if (textureScore < 5) {
            recommendations.push({
                icon: '🧴',
                text: 'Consider using a gentle exfoliating cleanser to improve skin texture'
            });
        }
        
        // Hydration-based recommendations
        const hydration = faceData.hydration_level || 0;
        if (hydration < 50) {
            recommendations.push({
                icon: '💧',
                text: 'Your skin appears dehydrated. Use a hydrating serum and drink more water'
            });
        }
        
        // Problem area recommendations
        const problems = faceData.problem_areas || [];
        if (problems.some(p => p.type === 'dark_spot')) {
            recommendations.push({
                icon: '☀️',
                text: 'Dark spots detected. Use SPF daily and consider vitamin C serum'
            });
        }
        
        // General recommendations
        if (recommendations.length === 0) {
            recommendations.push({
                icon: '✨',
                text: 'Your skin looks healthy! Maintain your current routine'
            });
        }
        
        return recommendations;
    }

    formatProblemType(type) {
        const typeMap = {
            'dark_spot': '🔴 Dark Spot',
            'blemish': '🟡 Blemish',
            'wrinkle': '📏 Fine Line',
            'acne': '🔴 Acne'
        };
        return typeMap[type] || `⚠️ ${type}`;
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    logAnalysisData(data) {
        const timestamp = new Date().toLocaleTimeString();
        const faceCount = data.faces?.length || 0;
        
        if (faceCount > 0) {
            const face = data.faces[0];
            this.log(`📊 [${timestamp}] Analysis: ${faceCount} face(s), Tone: ${face.skin_tone}, Texture: ${face.texture_score?.toFixed(1)}, Hydration: ${face.hydration_level?.toFixed(1)}%`);
        } else {
            this.log(`📊 [${timestamp}] No faces detected in current frame`);
        }
    }

    updateAnalysisSettings() {
        // This would send updated settings to the vision agent
        // For now, just log the change
        const settings = {
            enableSkinTone: document.getElementById('enableSkinTone')?.checked,
            enableTexture: document.getElementById('enableTexture')?.checked,
            enableProblems: document.getElementById('enableProblems')?.checked,
            analysisInterval: parseInt(document.getElementById('analysisInterval')?.value || 5)
        };
        
        this.log(`⚙️ Analysis settings updated: ${JSON.stringify(settings)}`);
    }

    updateConnectionQuality(quality) {
        const qualityMap = {
            [LiveKitClient.ConnectionQuality.Excellent]: '🟢 Excellent',
            [LiveKitClient.ConnectionQuality.Good]: '🟡 Good',
            [LiveKitClient.ConnectionQuality.Poor]: '🟠 Poor',
            [LiveKitClient.ConnectionQuality.Lost]: '🔴 Lost'
        };
        
        const qualityText = qualityMap[quality] || '⚪ Unknown';
        this.log(`📶 Connection quality: ${qualityText}`);
    }

    async disconnect() {
        try {
            if (this.localVideoTrack) {
                this.localVideoTrack.stop();
                this.localVideoTrack = null;
            }
            
            if (this.room) {
                await this.room.disconnect();
                this.room = null;
            }
            
            this.updateStatus('disconnected');
            this.log('🔌 Disconnected from skin analysis session');
            
            document.getElementById('connectBtn').disabled = false;
            document.getElementById('disconnectBtn').disabled = true;
            
            // Clear video elements
            ['localVideo', 'remoteVideo'].forEach(id => {
                const video = document.getElementById(id);
                if (video) {
                    video.srcObject = null;
                }
            });
            
        } catch (error) {
            console.error('Disconnect error:', error);
            this.log(`❌ Disconnect error: ${error.message}`);
        }
    }

    updateStatus(status) {
        const statusElement = document.getElementById('status');
        if (!statusElement) return;
        
        statusElement.className = `status ${status}`;
        
        const statusText = {
            'disconnected': '🔴 Disconnected',
            'connecting': '🟡 Connecting...',
            'connected': '🟢 Connected',
            'error': '❌ Error'
        };
        
        statusElement.textContent = statusText[status] || status;
    }

    log(message) {
        console.log(message);
        
        const dataLog = document.getElementById('dataLog');
        if (dataLog) {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.textContent = message;
            
            dataLog.appendChild(logEntry);
            dataLog.scrollTop = dataLog.scrollHeight;
            
            // Keep only last 50 entries
            while (dataLog.children.length > 50) {
                dataLog.removeChild(dataLog.firstChild);
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skinAnalysisApp = new SkinAnalysisApp();
});
