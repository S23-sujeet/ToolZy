import { useCallback, useState } from 'react';

export type TaskStatus = 'idle' | 'processing' | 'done' | 'error';

/** Small shared hook so every tool page handles async processing/errors consistently. */
export function useAsyncTask() {
  const [status, setStatus] = useState<TaskStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (task: () => Promise<void>) => {
    setStatus('processing');
    setError(null);
    try {
      await task();
      setStatus('done');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, run, reset };
}
