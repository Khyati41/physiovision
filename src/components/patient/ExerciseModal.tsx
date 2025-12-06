import { useRef, useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Exercise } from '@/context/PhysioContext';
import { Button } from '@/components/ui/button';
import Webcam from 'react-webcam';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

interface ExerciseModalProps {
  exercise: Exercise;
  onClose: () => void;
  onComplete?: (exerciseId: string) => void;
}

export const ExerciseModal = ({ exercise, onClose, onComplete }: ExerciseModalProps) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState('Get into position...');
  const [isUp, setIsUp] = useState(false);

  // Calculate angle between three points
  const calculateAngle = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the webcam image
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    if (results.poseLandmarks) {
      // Draw pose connections
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#22c55e',
        lineWidth: 3,
      });

      // Draw landmarks
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#16a34a',
        lineWidth: 2,
        radius: 5,
      });

      // Get key landmarks for exercise detection
      const landmarks = results.poseLandmarks;
      
      // Squat detection using hip, knee, ankle angles
      if (exercise.name.toLowerCase().includes('squat')) {
        const leftHip = landmarks[23];
        const leftKnee = landmarks[25];
        const leftAnkle = landmarks[27];
        const rightHip = landmarks[24];
        const rightKnee = landmarks[26];
        const rightAnkle = landmarks[28];

        const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
        const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

        // Check posture
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
        const hipMidY = (leftHip.y + rightHip.y) / 2;

        if (shoulderMidY > hipMidY + 0.1) {
          setFeedback('Keep your back straight!');
        } else if (avgKneeAngle < 90) {
          setFeedback('Great depth! Now push up!');
        } else if (avgKneeAngle > 160) {
          setFeedback('Good! Now squat down');
        } else {
          setFeedback('Keep going!');
        }

        // Rep counting logic
        if (avgKneeAngle < 100 && !isUp) {
          setIsUp(true);
        } else if (avgKneeAngle > 160 && isUp) {
          setIsUp(false);
          setRepCount(prev => {
            const newCount = Math.min(prev + 1, exercise.reps);
            if (newCount === exercise.reps && onComplete) {
              onComplete(exercise.id);
            }
            return newCount;
          });
        }
      }
      
      // Overhead press detection using shoulder, elbow, wrist angles
      else if (exercise.name.toLowerCase().includes('press')) {
        const leftShoulder = landmarks[11];
        const leftElbow = landmarks[13];
        const leftWrist = landmarks[15];
        const rightShoulder = landmarks[12];
        const rightElbow = landmarks[14];
        const rightWrist = landmarks[16];

        const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
        const avgArmAngle = (leftArmAngle + rightArmAngle) / 2;

        // Check if arms are raised
        const armsRaised = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;

        if (armsRaised && avgArmAngle > 160) {
          setFeedback('Arms fully extended! Now lower');
        } else if (!armsRaised) {
          setFeedback('Raise your arms above shoulders');
        } else {
          setFeedback('Keep pressing up!');
        }

        // Rep counting logic
        if (armsRaised && avgArmAngle > 160 && !isUp) {
          setIsUp(true);
        } else if (avgArmAngle < 100 && isUp) {
          setIsUp(false);
          setRepCount(prev => {
            const newCount = Math.min(prev + 1, exercise.reps);
            if (newCount === exercise.reps && onComplete) {
              onComplete(exercise.id);
            }
            return newCount;
          });
        }
      }
      
      // Generic movement detection
      else {
        setFeedback('Keep moving!');
      }
    } else {
      setFeedback('Position yourself in frame');
    }

    setIsLoading(false);
  }, [exercise.name, exercise.reps, isUp]);

  useEffect(() => {
    const initPose = async () => {
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onResults);
      poseRef.current = pose;

      // Wait for webcam to be ready
      const checkWebcam = setInterval(() => {
        if (webcamRef.current?.video?.readyState === 4) {
          clearInterval(checkWebcam);
          
          const video = webcamRef.current.video;
          
          const camera = new Camera(video, {
            onFrame: async () => {
              if (poseRef.current && video) {
                await poseRef.current.send({ image: video });
              }
            },
            width: 640,
            height: 480,
          });
          
          camera.start();
          cameraRef.current = camera;
        }
      }, 100);

      return () => clearInterval(checkWebcam);
    };

    initPose();

    return () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
    };
  }, [onResults]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative flex h-full w-full max-w-md flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-foreground">{exercise.name}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Camera Area with Pose Detection */}
        <div className="relative mx-4 flex-1 overflow-hidden rounded-2xl bg-slate/90">
          {/* Hidden webcam - used as source for MediaPipe */}
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            className="absolute opacity-0 pointer-events-none"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: 'user',
            }}
          />
          
          {/* Canvas for drawing pose */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="h-full w-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/90">
              <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                <p className="text-primary-foreground">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Webcam Feed Label */}
          <div className="absolute left-4 top-4 rounded-lg bg-background/20 px-3 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            Live Pose Detection
          </div>

          {/* Rep Counter */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
            <div className="text-6xl font-bold text-primary-foreground drop-shadow-lg">
              {repCount} / {exercise.reps}
            </div>
            <div className="mt-1 text-lg font-medium text-primary-foreground/80">
              Reps
            </div>
          </div>

          {/* Feedback Message */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-primary px-6 py-2 shadow-lg">
            <span className="text-sm font-medium text-primary-foreground">
              {feedback}
            </span>
          </div>

          {/* Completion overlay */}
          {repCount >= exercise.reps && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-2xl font-bold text-primary-foreground">Exercise Complete!</p>
                <p className="text-primary-foreground/80 mt-2">Great work!</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full rounded-xl border-border text-foreground hover:bg-secondary"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
};
