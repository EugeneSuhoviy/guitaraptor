'use client';

import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ initialTime }: { initialTime: number }) {
    const time = initialTime * 60;

    const [timeRemaining, setTimeRemaining] = useState(time);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timerInterval);
                    alert('Countdown complete!');
                    return 0;
                } else {
                    return prevTime - 1;
                }
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    // const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return (
        <div>
            <span className="countdown font-mono text-6xl bg-accent p-1">
                <span style={{ ['--value' as string]: minutes }}></span>:
                <span style={{ ['--value' as string]: seconds }}></span>
            </span>
        </div>
    );
};
