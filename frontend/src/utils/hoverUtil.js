import { useState } from 'react';

export function useHover() {
    const [hoveredWeek, setHoveredWeek] = useState(null);

    const handleMouseEnter = (weekNumber) => {
        setHoveredWeek(weekNumber);
    };

    const handleMouseLeave = () => {
        setHoveredWeek(null);
    };

    return {
        hoveredWeek,
        handleMouseEnter,
        handleMouseLeave,
    };
}