import { useEffect, useRef } from "react";

export default function Home() {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const daysOnMonth = new Date(currentYear, currentMonth, 0).getDate();
  const daysOnMonthArray = new Array(daysOnMonth)
    .fill(0)
    .map((_, index) => index + 1);
  const bgEffectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const daysOnWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    const mousePositions: { x: number; y: number }[] = [];

    function setMousePositions(event: MouseEvent) {
      bgEffectRefs.current.forEach((el, index) => {
        if (el === null) return;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        mousePositions[index] = { x, y };
      });
    }
    window.addEventListener("mousemove", (event) => setMousePositions(event));

    function updateCSSVariable() {
      bgEffectRefs.current.forEach((el, index) => {
        if (el === null || mousePositions.length === 0) return;
        const { x, y } = mousePositions[index];
        el.style.setProperty("--mouse-x", `${x}px`);
        el.style.setProperty("--mouse-y", `${y}px`);
      });
      requestAnimationFrame(updateCSSVariable);
    }
    updateCSSVariable();

    return () =>
      window.removeEventListener("mousemove", (event) =>
        setMousePositions(event)
      );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-7 gap-2 w-auto mx-auto">
        {daysOnWeek.map((weekDay, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-14 h-10 font-semibold"
          >
            {weekDay}
          </div>
        ))}
        {daysOnMonthArray.map((day, index) => (
          <div
            key={index}
            ref={(el) => (bgEffectRefs.current[index] = el ?? null)}
            className="relative w-14 h-12 hover:bg-[rgba(255,255,255,0.18)] overflow-hidden"
          >
            {/* Gradient size is available in globals.css */}
            <div className="absolute inset-0 z-[1] w-full h-full bg-calendar-gradient transition-opacity duration-500"></div>
            {/* Content */}
            <div className="absolute inset-[3px] z-[2] bg-[#111] flex items-center justify-center">
              {day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
