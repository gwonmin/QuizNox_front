import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DependencyList,
  type ReactNode,
} from "react";

export type AsyncHoldRegistration = { end: () => void };

type HandbookContentReadyContextValue = {
  /** Mermaid·동적 import 등 비동기로 끝나는 블록마다 한 번 호출 */
  registerAsyncHold: () => AsyncHoldRegistration;
};

export const HandbookContentReadyContext =
  createContext<HandbookContentReadyContextValue | null>(null);

/**
 * 핸드북 MDX 본문에서 비동기 위젯이 모두 끝날 때까지 오버레이로 가립니다.
 * 자식 layout effect에서 hold 등록 → 부모 layout effect 시점에 pending 집계가 끝난 상태입니다.
 */
export function HandbookContentReadyProvider({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const pendingRef = useRef(new Set<string>());
  const serialRef = useRef(0);
  const [blocking, setBlocking] = useState(true);

  const registerAsyncHold = useCallback(() => {
    const id = `handbook-async-${++serialRef.current}`;
    pendingRef.current.add(id);
    return {
      end: () => {
        if (pendingRef.current.delete(id)) {
          setBlocking(pendingRef.current.size > 0);
        }
      },
    };
  }, []);

  const value = useMemo(
    () => ({ registerAsyncHold }),
    [registerAsyncHold]
  );

  useLayoutEffect(() => {
    setBlocking(pendingRef.current.size > 0);
  });

  return (
    <HandbookContentReadyContext.Provider value={value}>
      <div className="relative" aria-busy={blocking}>
        {children}
        {blocking ? (
          <div className="absolute inset-0 z-10 flex min-h-[200px] items-center justify-center bg-background/85 backdrop-blur-[1px]">
            {fallback}
          </div>
        ) : null}
      </div>
    </HandbookContentReadyContext.Provider>
  );
}

/**
 * `HandbookContentReadyProvider` 안에서만 동작합니다. Provider 밖에서는 no-op입니다.
 *
 * - `holdIdentityDeps`가 바뀔 때마다 이전 hold는 정리되고 새 hold가 잡힙니다 (예: `code` 변경).
 * - 비동기 작업이 끝나면 `completeHold()`를 `finally`에서 호출하세요. 언마운트 시에는 자동 정리됩니다.
 */
export function useHandbookAsyncHold(holdIdentityDeps: DependencyList): {
  completeHold: () => void;
} {
  const ctx = useContext(HandbookContentReadyContext);
  const regRef = useRef<AsyncHoldRegistration | null>(null);

  useLayoutEffect(() => {
    if (!ctx) {
      regRef.current = null;
      return;
    }
    const reg = ctx.registerAsyncHold();
    regRef.current = reg;
    return () => {
      reg.end();
      regRef.current = null;
    };
    // holdIdentityDeps는 호출부에서 명시적으로 넘기는 식별자(예: props)입니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, ...holdIdentityDeps]);

  const completeHold = useCallback(() => {
    regRef.current?.end();
  }, []);

  return { completeHold };
}
