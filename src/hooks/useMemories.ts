import { useCallback, useEffect, useRef, useState } from 'react';
import type { Memory, SortOrder } from '../types';
import { listMemories } from '../lib/memories';

interface UseMemoriesResult {
  memories: Memory[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  /** Đánh dấu một kỷ niệm vừa đăng để làm nổi bật trong danh sách. */
  highlightId: string | null;
  markCreated: (memory: Memory) => void;
}

export function useMemories(
  zoneId: string,
  cohort: string | null,
  sort: SortOrder,
): UseMemoriesResult {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);

    listMemories({ zoneId, cohort, sort })
      .then((data) => {
        if (cancelled || currentRequest !== requestId.current) return;
        setMemories(data);
      })
      .catch((err: unknown) => {
        if (cancelled || currentRequest !== requestId.current) return;
        setMemories([]);
        setError(err instanceof Error ? err.message : 'Không tải được kho ảnh kỷ niệm.');
      })
      .finally(() => {
        if (cancelled || currentRequest !== requestId.current) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [zoneId, cohort, sort, refreshToken]);

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  const markCreated = useCallback((memory: Memory) => {
    setHighlightId(memory.id);
    setRefreshToken((token) => token + 1);
  }, []);

  return { memories, loading, error, refresh, highlightId, markCreated };
}
