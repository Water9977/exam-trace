"use client";

import { useEffect, useState, useRef } from "react";

export function CursorProbe() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const rafRef = useRef<number>();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.premium-card, button, .nav-item')) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.premium-card, button, .nav-item')) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter, true);
        document.addEventListener('mouseleave', handleMouseLeave, true);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter, true);
            document.removeEventListener('mouseleave', handleMouseLeave, true);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // Smooth cursor tracking using lerp (linear interpolation)
    useEffect(() => {
        const animate = () => {
            setSmoothPos(prev => {
                const dx = mousePos.x - prev.x;
                const dy = mousePos.y - prev.y;

                // Lerp factor - 0.25 = smooth and responsive
                const lerp = 0.25;

                return {
                    x: prev.x + dx * lerp,
                    y: prev.y + dy * lerp
                };
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [mousePos]);

    return (
        <>
            {/* Ambient probe glow - smoothly follows cursor */}
            <div
                className="fixed pointer-events-none z-50 transition-all duration-300"
                style={{
                    left: smoothPos.x,
                    top: smoothPos.y,
                    transform: 'translate(-50%, -50%)',
                    width: isHovering ? '600px' : '400px',
                    height: isHovering ? '600px' : '400px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
                }}
            />

            {/* Cursor dot - follows instantly */}
            <div
                className="fixed pointer-events-none z-[60] w-1 h-1 rounded-full bg-purple-500 transition-transform duration-100"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.8)',
                }}
            />
        </>
    );
}
