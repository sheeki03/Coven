import { useState, useRef, useCallback, useEffect } from 'react';

interface Props {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

const RECORDING_TIMEOUT = 12_000; // 12s max
const MIN_RECORDING_MS = 1000; // minimum 1s to get usable audio

function checkWebmSupport(): boolean {
  if (typeof MediaRecorder === 'undefined') return false;
  return MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
}

export default function VoiceButton({ onRecordingComplete, disabled, isProcessing }: Props) {
  const [recording, setRecording] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [micDenied, setMicDenied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [tooShort, setTooShort] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef(0);
  const callbackRef = useRef(onRecordingComplete);
  callbackRef.current = onRecordingComplete;

  useEffect(() => {
    if (!checkWebmSupport()) setMicSupported(false);
  }, []);

  // Clear "too short" message after 2s
  useEffect(() => {
    if (!tooShort) return;
    const t = setTimeout(() => setTooShort(false), 2000);
    return () => clearTimeout(t);
  }, [tooShort]);

  const cleanupTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  const stopRecording = useCallback(() => {
    cleanupTimers();
    setRecording(false);
    setElapsed(0);

    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      // Nothing to stop — clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      return;
    }

    // Check minimum duration
    const duration = Date.now() - startTimeRef.current;
    if (duration < MIN_RECORDING_MS) {
      // Too short — discard
      recorder.ondataavailable = null;
      recorder.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
      };
      recorder.stop();
      chunksRef.current = [];
      setTooShort(true);
      return;
    }

    // Normal stop: let onstop handler fire FIRST, then clean up stream
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
      chunksRef.current = [];

      // Now safe to release the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      if (blob.size > 100) { // sanity check — empty webm headers are ~40 bytes
        callbackRef.current(blob);
      }
    };

    recorder.stop();
  }, [cleanupTimers]);

  const startRecording = useCallback(async () => {
    if (!micSupported || disabled || isProcessing) return;
    setTooShort(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(250); // larger chunks = more reliable assembly
      startTimeRef.current = Date.now();
      setRecording(true);
      setElapsed(0);

      // Elapsed timer
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 100);

      // Auto-stop at 12s
      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, RECORDING_TIMEOUT);
    } catch {
      setMicDenied(true);
      setRecording(false);
    }
  }, [micSupported, disabled, isProcessing, stopRecording]);

  const toggleRecording = useCallback(() => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [recording, stopRecording, startRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  if (!micSupported) {
    return (
      <p className="font-body text-iron/40 text-sm italic text-center py-2">
        Voice capture isn't supported here yet.
      </p>
    );
  }

  if (micDenied) {
    return (
      <p className="font-body text-iron/40 text-sm italic text-center py-2">
        Microphone access denied. Use cards or type below.
      </p>
    );
  }

  const seconds = Math.floor(elapsed / 1000);
  const progress = Math.min(elapsed / RECORDING_TIMEOUT, 1);
  const circumference = 2 * Math.PI * 38; // r=38 for 80px button

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main mic button — dramatically large */}
      <div className="relative">
        {/* Outer ambient glow */}
        {!disabled && !isProcessing && !recording && (
          <div className="absolute inset-0 rounded-full bg-gold/8 blur-xl scale-150 animate-breathe" />
        )}
        {recording && (
          <div className="absolute inset-0 rounded-full bg-crimson/15 blur-2xl scale-[1.8] animate-pulse" />
        )}

        <button
          onClick={toggleRecording}
          disabled={disabled || isProcessing}
          className={`
            relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 transition-all duration-300 cursor-pointer
            flex items-center justify-center
            ${recording
              ? 'border-crimson-bright bg-crimson/20 shadow-[0_0_30px_rgba(198,40,40,0.4),0_0_60px_rgba(139,26,26,0.2)]'
              : disabled || isProcessing
                ? 'border-iron/15 bg-iron/5 opacity-30 cursor-not-allowed'
                : 'border-gold/30 bg-gradient-to-br from-gold/8 to-gold/3 hover:border-gold/50 hover:shadow-[0_0_24px_rgba(196,163,90,0.15),0_0_48px_rgba(196,163,90,0.05)] active:scale-95'
            }
          `}
        >
          {isProcessing ? (
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          ) : recording ? (
            /* Stop square */
            <div className="w-7 h-7 rounded-md bg-crimson-bright shadow-[0_0_12px_rgba(198,40,40,0.5)]" />
          ) : (
            /* Mic icon — larger */
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gold/70">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" fill="currentColor" opacity="0.7" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 19v4m-4 0h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}

          {/* Progress ring when recording — larger, bolder */}
          {recording && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
              {/* Track ring */}
              <circle
                cx="40" cy="40" r="38"
                fill="none"
                stroke="rgba(139,26,26,0.15)"
                strokeWidth="3"
              />
              {/* Progress arc */}
              <circle
                cx="40" cy="40" r="38"
                fill="none"
                stroke="rgba(198,40,40,0.6)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progress * circumference} ${circumference}`}
                className="transition-[stroke-dasharray] duration-100"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Status text — readable size */}
      {recording && (
        <span className="font-body text-crimson-bright/80 text-sm tabular-nums tracking-wide">
          Recording... {seconds}s / 12s — tap to stop
        </span>
      )}

      {tooShort && (
        <span className="font-body text-amber-400/80 text-sm">
          Too short — speak for at least 1 second
        </span>
      )}

      {!recording && !isProcessing && !tooShort && (
        <span className="font-body text-iron/40 text-sm tracking-wide">
          Tap to speak your question
        </span>
      )}

      {isProcessing && (
        <span className="font-body text-gold/60 text-sm animate-pulse tracking-wide">
          Transcribing your words...
        </span>
      )}
    </div>
  );
}
