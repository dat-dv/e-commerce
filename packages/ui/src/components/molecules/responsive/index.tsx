"use client";

import useMediaQuery from "@/hooks/use-media-query";

const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const;

interface ResponsiveRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackClassName?: string;
  query: string;

  /**
   * Khi media query chưa resolve:
   *
   * true  -> render chính children làm fallback, bọc bằng fallbackClassName.
   * false -> render fallback được truyền vào.
   *
   * Mục tiêu:
   * - Tránh flickering ở lần render đầu.
   * - Cho CSS quyết định ẩn/hiện trước khi JS media query hydrate xong.
   */
  isFallbackChildren?: boolean;
}

/**
 * ResponsiveRender
 *
 * Cách hoạt động:
 *
 * 1. Server render:
 *    - Vì chưa có `window.matchMedia`, server không biết màn hình user.
 *    - Component có thể render fallback ban đầu.
 *
 * 2. First client render:
 *    - `useMediaQuery` có thể vẫn trả về `undefined`.
 *    - Khi đó ta render fallback.
 *    - Nếu `isFallbackChildren = true`, fallback chính là `children`.
 *    - `fallbackClassName` dùng Tailwind responsive class để CSS tự ẩn/hiện đúng màn hình.
 *
 * 3. Sau khi hydrate:
 *    - `useMediaQuery` trả về true / false.
 *    - Nếu match thì render children thật.
 *    - Nếu không match thì return null để unmount khỏi UI.
 *
 * Ưu điểm:
 * - Giảm flickering.
 * - Tốt hơn cho responsive UI có desktop/mobile version riêng.
 * - Vẫn có HTML ban đầu cho layout tương ứng thông qua CSS.
 *
 * Lưu ý:
 * - Nếu dùng `isFallbackChildren = true`, children có thể được mount trong giai đoạn đầu.
 * - Vì vậy không nên đặt logic nặng, fetch, subscribe, listener, hoặc side-effect riêng biệt
 *   bên trong cả mobile và desktop version.
 *
 * Ví dụ cần tránh:
 * - DesktopHeader gọi notification API.
 * - MobileHeader cũng gọi notification API.
 * - Khi render fallback children, cả hai có thể bị mount ban đầu và gây duplicate execution.
 *
 * Cách xử lý:
 * - Đưa logic shared như notification, auth, search params, pathname listener
 *   ra parent/common hook.
 * - Responsive component chỉ nên lo phần UI.
 * - Với component nặng như chart, map, PDF viewer, canvas, animation lớn:
 *   nên dùng `isFallbackChildren = false` và truyền fallback nhẹ.
 */
function ResponsiveRender({
  children,
  fallback = null,
  fallbackClassName,
  query,
  isFallbackChildren = false,
}: ResponsiveRenderProps) {
  const matches = useMediaQuery(query);

  if (matches === undefined) {
    const initialNode = isFallbackChildren ? children : fallback;

    if (initialNode === null || initialNode === undefined) return null;

    return <div className={fallbackClassName}>{initialNode}</div>;
  }

  if (!matches) return null;

  return children;
}

interface ResponsiveOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;

  /**
   * Default true:
   * - Tự lấy children làm fallback ban đầu.
   * - CSS sẽ ẩn/hiện bằng fallbackClassName để tránh flicker.
   *
   * Set false khi:
   * - Component quá nặng.
   * - Component có side-effect.
   * - Component có fetch/subscription/listener riêng.
   */
  isFallbackChildren?: boolean;
}

export function RenderDesktopOnly({
  children,
  fallback,
  isFallbackChildren = true,
}: ResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden lg:block"
      query={`(min-width: ${BREAKPOINTS.desktop}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletAndAbove({
  children,
  fallback,
  isFallbackChildren = true,
}: ResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden md:block"
      query={`(min-width: ${BREAKPOINTS.tablet}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletOnly({
  children,
  fallback,
  isFallbackChildren = true,
}: ResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden md:block lg:hidden"
      query={`(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${
        BREAKPOINTS.desktop - 1
      }px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletAndBelow({
  children,
  fallback,
  isFallbackChildren = true,
}: ResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="lg:hidden"
      query={`(max-width: ${BREAKPOINTS.desktop - 1}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderMobileOnly({
  children,
  fallback,
  isFallbackChildren = true,
}: ResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="md:hidden"
      query={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}
