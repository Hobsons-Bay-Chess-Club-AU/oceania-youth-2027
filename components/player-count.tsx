"use client";
import { useEffect, useRef, useState } from "react";

export function PlayerCount({ value }: { value: number | null }) {
    const element = useRef<HTMLSpanElement>(null);
    const [displayed, setDisplayed] = useState(0);
    useEffect(() => {
        if (value === null) return;
        const target = value;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0;
        let observer: IntersectionObserver | undefined;
        function finish() {
            cancelAnimationFrame(frame);
            observer?.disconnect();
            setDisplayed(target);
        }
        function onMotionChange() {
            if (motion.matches) finish();
        }
        if (motion.matches || !("IntersectionObserver" in window)) {
            finish();
            return;
        }
        setDisplayed(0);
        observer = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            observer?.disconnect();
            const start = performance.now();
            function tick(now: number) {
                const progress = Math.min((now - start) / 1200, 1);
                setDisplayed(Math.round(target * (1 - Math.pow(1 - progress, 3))));
                if (progress < 1) frame = requestAnimationFrame(tick);
            }
            frame = requestAnimationFrame(tick);
        }, { threshold: 0.3 });
        if (element.current) observer.observe(element.current);
        motion.addEventListener("change", onMotionChange);
        return () => {
            cancelAnimationFrame(frame);
            observer?.disconnect();
            motion.removeEventListener("change", onMotionChange);
        };
    }, [value]);
    return <span ref={element}>{value === null ? "—" : displayed}</span>;
}
