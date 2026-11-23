import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import weddingApi from "../../services/weddingApi";

export function useCurrentWedding() {
  const location = useLocation();
  const [wedding, setWedding] = useState(() => {
    if (location.state?.wedding) return location.state.wedding;
    try {
      const cached = sessionStorage.getItem("everweb_pending_wedding");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (wedding) return undefined;
    let cancelled = false;
    weddingApi
      .getAll()
      .then((items) => {
        if (!cancelled && items.length > 0) setWedding(items[0]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [wedding]);

  return { wedding, setWedding };
}

/**
 * Đọc & lưu cấu hình của từng chức năng con trực tiếp xuống Neon DB qua API.
 */
export function useWeddingFeature(wedding, section, fallback) {
  const [data, setData] = useState(fallback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const weddingId = wedding?.id;
    if (!weddingId) return undefined;
    let cancelled = false;
    weddingApi
      .getFeatures(weddingId)
      .then((all) => {
        if (!cancelled && all?.[section]) {
          setData(all[section]);
        }
        if (!cancelled) setIsLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [wedding?.id, section]);

  const saveSection = useCallback(
    async (patchOrUpdater) => {
      let nextValue;
      setData((prev) => {
        nextValue =
          typeof patchOrUpdater === "function"
            ? patchOrUpdater(prev)
            : { ...prev, ...patchOrUpdater };
        return nextValue;
      });
      if (!wedding?.id) return;
      try {
        await weddingApi.updateFeatureSection(wedding.id, section, nextValue);
      } catch {
        // Optimistic state remains; caller may toast if needed
      }
    },
    [wedding?.id, section]
  );

  return { data, setData, saveSection, isLoaded };
}
