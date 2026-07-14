'use client';

import { useEffect, useMemo, useState } from 'react';

type CountdownProps = {
  target: string;
  label?: string;
};

function getRemaining(target: string) {
  const end = new Date(target).getTime();
  const delta = Math.max(0, end - Date.now());
  const days = Math.floor(delta / 86_400_000);
  const hours = Math.floor((delta % 86_400_000) / 3_600_000);
  const minutes = Math.floor((delta % 3_600_000) / 60_000);
  const seconds = Math.floor((delta % 60_000) / 1000);

  return { days, hours, minutes, seconds };
}

export function Countdown({ target, label = 'Thời gian còn lại để gửi bài' }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => getRemaining(target));
  const cells = useMemo(
    () => [
      ['Ngày', remaining.days],
      ['Giờ', remaining.hours],
      ['Phút', remaining.minutes],
    ],
    [remaining],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <section className="countdown-panel" aria-label={label}>
      <p className="field-helper">{label}</p>
      <div className="countdown-grid">
        {cells.map(([cellLabel, value]) => (
          <div className="countdown-cell" key={cellLabel}>
            <span className="countdown-number">{String(value).padStart(2, '0')}</span>
            <span className="countdown-label">{cellLabel}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
