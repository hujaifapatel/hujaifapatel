import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Kisi bhi content ko "virtual" width (jaise 1280px desktop) par render karke
 * available jagah ke hisab se scale karta hai. Template ke andar container
 * queries (@container) hain, isliye layout virtual width ke hisab se banta hai.
 *
 * - height: frame ki visible height (px). Nahi di to aspect ratio use hoga.
 * - scrollable: andar scroll allow kare ya nahi (thumbnails me nahi).
 */
export default function ScaledFrame({ width = 1280, height, aspect = 0.68, scrollable = false, className = '', children }) {
  const ref = useRef(null);
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
          // transform wala div "fixed" elements (WhatsApp button) ka containing block banta hai
          <div style={{ width, height: frameH / scale, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <div className={`h-full ${scrollable ? 'overflow-y-auto' : 'overflow-hidden pointer-events-none select-none'}`}>
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
