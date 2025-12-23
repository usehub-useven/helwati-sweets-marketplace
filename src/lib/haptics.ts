/**
 * Trigger haptic feedback (vibration) if supported by the browser
 * @param duration - Duration of vibration in milliseconds (default: 10ms for subtle feedback)
 */
export const triggerHaptic = (duration: number = 10): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (error) {
      // Silently fail if vibration is not supported or blocked
    }
  }
};