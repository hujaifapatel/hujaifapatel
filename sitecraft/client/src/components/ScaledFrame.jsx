import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Renders content at a "virtual" width (e.g. 1280px desktop) and scales it to
 * the available space. Templates use container queries (@container), so the
 * layout responds to the virtual width, not the browser window.
 *
 * - height: visible height of the frame (px). Falls back to the aspect ratio.
 * - scrollable: allow scrolling inside (not for thumbnails).
 * - resetKey: when it changes, the inner scroll jumps back to the top (page change).
 */
export default function ScaledFrame({ width = 1280, height, aspect = 0.68, scrollable = false, resetKey, className = '', children }) {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [resetKey]);
  const [avail, setAvail] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setAvail(entry.contentRect.width));
    ro.observe(el);
    setAvail(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const scale = avail ? Math.min(1, avail / width) : 0;
  const frameW = width * scale;
  const frameH = height ?? avail * aspect;

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="mx-auto overflow-hidden" style={{ width: frameW || '100%', height: frameH }}>
        {scale > 0 && (
          // the transformed div becomes the containing block for "fixed" elements (WhatsApp button)
          <div style={{ width, height: frameH / scale, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <div ref={scrollRef} className={`h-full ${scrollable ? 'overflow-y-auto' : 'overflow-hidden pointer-events-none select-none'}`}>
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
