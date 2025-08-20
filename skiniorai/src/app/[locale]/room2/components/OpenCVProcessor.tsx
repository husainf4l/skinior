declare global {
  interface Window {
    cv: any;
  }
}

export class OpenCVProcessor {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isProcessing: boolean = false;
  private faceClassifier: any = null;
  private onFaceDetected?: (detected: boolean, quality: number) => void;
  private lastDetectionTime = 0;
  private detectionInterval = 500; // Detect every 500ms instead of every frame
  private hasLoggedError = false; // Prevent spam logging

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.initializeOpenCV();
  }

  private async initializeOpenCV() {
    console.log("🔧 Initializing OpenCV for face detection...");

    // Wait for OpenCV to load with timeout
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds max wait

    const checkOpenCV = () => {
      attempts++;

      if (
        typeof window !== "undefined" &&
        window.cv &&
        window.cv.Mat &&
        window.cv.imread
      ) {
        console.log("✅ OpenCV loaded successfully");
        this.setupFaceDetection();
        this.startProcessing();
      } else if (attempts < maxAttempts) {
        setTimeout(checkOpenCV, 100);
      } else {
        console.warn(
          "⚠️ OpenCV failed to load, using simulated face detection"
        );
        // Don't start processing automatically if OpenCV failed
        // The processor will use simulation mode when detectFaces is called
        this.hasLoggedError = true; // Mark as having logged the failure
        this.startProcessing(); // Start with simulation mode
      }
    };

    checkOpenCV();
  }

  private setupFaceDetection() {
    try {
      // Check if cascade classifier is available
      if (!window.cv.CascadeClassifier) {
        console.log("CascadeClassifier not available, using simulation mode");
        return;
      }

      // Initialize face cascade classifier
      this.faceClassifier = new window.cv.CascadeClassifier();

      // In a real implementation, you would load the cascade file
      // For development, we'll skip the actual file loading and rely on simulation
      console.log("Face detection setup completed (simulation mode)");

      // Set classifier to null to force simulation mode since we don't have the actual cascade file
      this.faceClassifier = null;
    } catch (error) {
      console.error("Error setting up face detection:", error);
      this.faceClassifier = null;
    }
  }

  private loadCascadeFile(filename: string) {
    // In a real implementation, you would load the cascade file
    // For now, we'll use a simulated face detection
    console.log("Loading cascade file:", filename);
  }

  public setFaceDetectionCallback(
    callback: (detected: boolean, quality: number) => void
  ) {
    this.onFaceDetected = callback;
  }

  private startProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.processFrame();
  }

  private processFrame = () => {
    if (!this.isProcessing || !this.video || !this.canvas) {
      return;
    }

    try {
      // Set canvas size to match video
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      // Draw video frame to canvas
      this.ctx.drawImage(this.video, 0, 0);

      // Throttle face detection to prevent infinite loops
      const now = Date.now();
      if (now - this.lastDetectionTime > this.detectionInterval) {
        this.lastDetectionTime = now;
        this.detectFaces();
      }

      // Continue processing
      requestAnimationFrame(this.processFrame);
    } catch (error) {
      if (!this.hasLoggedError) {
        console.error("Error processing frame:", error);
        this.hasLoggedError = true;
      }
      // Use fallback simulation and continue with longer delay
      this.simulateFaceDetection();
      setTimeout(this.processFrame, 1000);
    }
  };

  private detectFaces() {
    // Check if OpenCV is available and ready
    if (!window.cv || !window.cv.Mat || !window.cv.imread) {
      // Only log once to prevent spam
      if (!this.hasLoggedError) {
        console.log("OpenCV not ready, using simulated face detection");
        this.hasLoggedError = true;
      }
      this.simulateFaceDetection();
      return;
    }

    // Check if face classifier is properly initialized
    if (!this.faceClassifier) {
      if (!this.hasLoggedError) {
        console.log(
          "Face classifier not initialized, using simulated detection"
        );
        this.hasLoggedError = true;
      }
      this.simulateFaceDetection();
      return;
    }

    try {
      // Ensure canvas has content before processing
      if (!this.canvas.width || !this.canvas.height) {
        this.simulateFaceDetection();
        return;
      }

      // Reset error flag if we reach here successfully
      this.hasLoggedError = false;

      // Create OpenCV Mat from canvas
      const src = window.cv.imread(this.canvas);
      const gray = new window.cv.Mat();
      const faces = new window.cv.RectVector();

      // Convert to grayscale
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

      // Detect faces using the classifier
      this.faceClassifier.detectMultiScale(gray, faces, 1.1, 3, 0);

      // Draw face rectangles and calculate quality
      const faceCount = faces.size();
      let faceDetected = faceCount > 0;
      let quality = 0;

      if (faceDetected) {
        for (let i = 0; i < faceCount; i++) {
          const face = faces.get(i);

          // Draw rectangle around face
          this.ctx.strokeStyle = "#00ff00";
          this.ctx.lineWidth = 3;
          this.ctx.strokeRect(face.x, face.y, face.width, face.height);

          // Calculate quality based on face size and position
          const faceArea = face.width * face.height;
          const canvasArea = this.canvas.width * this.canvas.height;
          const faceRatio = faceArea / canvasArea;

          // Ideal face should be 10-30% of the frame
          if (faceRatio >= 0.1 && faceRatio <= 0.3) {
            quality = Math.min(100, (faceRatio / 0.2) * 100);
          } else {
            quality = 50; // Face too small or too large
          }
        }
      }

      // Clean up
      src.delete();
      gray.delete();
      faces.delete();

      // Notify callback
      if (this.onFaceDetected) {
        this.onFaceDetected(faceDetected, quality);
      }
    } catch (error) {
      // Only log error once to prevent spam
      if (!this.hasLoggedError) {
        // Provide more specific error information
        if (typeof error === "number") {
          console.warn(
            `OpenCV error code ${error} - falling back to simulation mode`
          );
        } else {
          console.error("Face detection error:", error);
        }
        this.hasLoggedError = true;
      }
      this.simulateFaceDetection();
    }
  }

  private simulateFaceDetection() {
    // Simple fallback: assume face is detected if video is active
    const hasVideo = this.video.videoWidth > 0 && this.video.videoHeight > 0;
    const quality = hasVideo ? 75 : 0;

    if (this.onFaceDetected) {
      this.onFaceDetected(hasVideo, quality);
    }
  }

  public captureFrame(): string | null {
    try {
      // Capture current frame
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      return this.canvas.toDataURL("image/jpeg", 0.8);
    } catch (error) {
      console.error("Error capturing frame:", error);
      return null;
    }
  }

  public analyzeSkin(imageData: string): Promise<any> {
    // This would connect to your AI skin analysis API
    return new Promise((resolve) => {
      // Simulate analysis delay
      setTimeout(() => {
        resolve({
          overallScore: 85,
          skinType: "Combination",
          concerns: ["Slight dehydration", "Minor pores"],
          texture: {
            score: 88,
            description: "Good texture with minor roughness",
          },
          hydration: {
            score: 75,
            description: "Moderately hydrated, could improve",
          },
          pigmentation: { score: 92, description: "Even skin tone" },
          wrinkles: { score: 95, description: "Minimal signs of aging" },
          pores: { score: 80, description: "Normal pore size" },
          recommendations: [
            "Use a hydrating serum",
            "Apply SPF daily",
            "Consider a gentle exfoliant",
          ],
          capturedImage: imageData,
          timestamp: new Date(),
        });
      }, 3000);
    });
  }

  public cleanup() {
    this.isProcessing = false;
    this.hasLoggedError = false; // Reset error flag for next session
    if (this.faceClassifier) {
      try {
        this.faceClassifier.delete();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  public stopProcessing() {
    this.isProcessing = false;
    this.hasLoggedError = false; // Reset error flag
  }

  public resumeProcessing() {
    if (!this.isProcessing) {
      this.hasLoggedError = false; // Reset error flag
      this.startProcessing();
    }
  }

  public resetErrorState() {
    this.hasLoggedError = false;
  }
}
