import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import weddingApi from "../../services/weddingApi";

export function useCurrentWedding() {
  const location = useLocation();
  const [wedding, setWedding] = useState(() => {
    if (location.state?.wedding) return location.state.wedding;
    try {
      const cached =
        sessionStorage.getItem("everweb_pending_wedding") ||
        localStorage.getItem("everweb_recent_wedding");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (wedding) {
      try {
        localStorage.setItem("everweb_recent_wedding", JSON.stringify(wedding));
      } catch (err) {
        void err;
      }
      return undefined;
    }
    let cancelled = false;
    weddingApi
      .getAll()
      .then((items) => {
        if (!cancelled && items.length > 0) {
          setWedding(items[0]);
          try {
            sessionStorage.setItem(
              "everweb_pending_wedding",
              JSON.stringify(items[0])
            );
            localStorage.setItem(
              "everweb_recent_wedding",
              JSON.stringify(items[0])
            );
          } catch (err) {
            void err;
          }
        }
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
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const weddingId = wedding?.id;
    if (!weddingId) return undefined;
    let cancelled = false;
    weddingApi
      .getFeatures(weddingId)
      .then((all) => {
        if (!cancelled && all?.[section]) {
          dataRef.current = all[section];
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

  // Lắng nghe tín hiệu cập nhật thời gian thực từ Trợ lý EverWeb AI hoặc các trang khác
  useEffect(() => {
    const handleFeatureUpdate = (event) => {
      if (event.detail && event.detail.section === section && event.detail.data) {
        setData((prev) => {
          const updated = { ...prev, ...event.detail.data };
          dataRef.current = updated;
          return updated;
        });
      }
    };
    window.addEventListener("everweb:feature-updated", handleFeatureUpdate);
    return () => {
      window.removeEventListener("everweb:feature-updated", handleFeatureUpdate);
    };
  }, [section]);

  const weddingId = wedding?.id;

  const saveSection = useCallback(
    async (patchOrUpdater) => {
      const prev = dataRef.current;
      const nextValue =
        typeof patchOrUpdater === "function"
          ? patchOrUpdater(prev)
          : { ...prev, ...patchOrUpdater };
      dataRef.current = nextValue;
      setData(nextValue);

      if (!weddingId) return;
      try {
        await weddingApi.updateFeatureSection(weddingId, section, nextValue);
      } catch {
        // Optimistic state remains; caller may toast if needed
      }
    },
    [weddingId, section]
  );

  return { data, setData, saveSection, isLoaded };
}
