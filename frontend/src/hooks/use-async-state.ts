import React from 'react';

export function useAsyncState<T>(
  asyncFunction: () => Promise<T>,
  initialState: T | null = null,
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  run: () => void;
} {
  const [data, setData] = React.useState<T | null>(initialState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const run = React.useCallback(() => {
    setLoading(true);
    setError(null);
    asyncFunction()
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [asyncFunction]);

  React.useEffect(() => {
    run();
  }, []);

  return { data, loading, error, run };
}
