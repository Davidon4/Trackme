declare global {
  interface Window {
    Reddimon?: {
      track: (conversionType?: string) => Promise<{
        success: boolean;
        reason?: string;
        error?: string;
      }>;
      trackSignup: () => Promise<{
        success: boolean;
        reason?: string;
        error?: string;
      }>;
      getTrackingData: () => Record<string, string | number | boolean>;
      getSessionId: () => string;
    };
  }
}

export {};
