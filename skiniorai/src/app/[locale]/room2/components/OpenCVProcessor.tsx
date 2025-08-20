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

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.initializeOpenCV();
  }

  private async initializeOpenCV() {
    // Wait for OpenCV to load
    const checkOpenCV = () => {
      if (typeof window !== "undefined" && window.cv && window.cv.Mat) {
        this.setupFaceDetection();
        this.startProcessing();
      } else {
        setTimeout(checkOpenCV, 100);
      }
    };
    checkOpenCV();
  }

  private setupFaceDetection() {
    try {
      // Initialize face cascade classifier
      this.faceClassifier = new window.cv.CascadeClassifier();

      // Load face detection model
      const faceCascadeFile = "haarcascade_frontalface_default.xml";
      this.loadCascadeFile(faceCascadeFile);
    } catch (error) {
      console.error("Error setting up face detection:", error);
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
    if (!this.isProcessing) return;

    try {
      // Set canvas size to match video
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      // Draw video frame to canvas
      this.ctx.drawImage(this.video, 0, 0);

      // Perform face detection
      this.detectFaces();

      // Continue processing
      requestAnimationFrame(this.processFrame);
    } catch (error) {
      console.error("Error processing frame:", error);
      setTimeout(this.processFrame, 100);
    }
  };

  private detectFaces() {
    if (!window.cv || !this.faceClassifier) {
      // Fallback: simulate face detection based on video activity
      this.simulateFaceDetection();
      return;
    }

    try {
      // Create OpenCV Mat from canvas
      const src = window.cv.imread(this.canvas);
      const gray = new window.cv.Mat();
      const faces = new window.cv.RectVector();

      // Convert to grayscale
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

      // Detect faces
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
      console.error("Face detection error:", error);
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
    if (this.faceClassifier) {
      this.faceClassifier.delete();
    }
  }
}
