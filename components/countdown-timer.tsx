'use client';

import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer: React.FC<{ initialTime: number, onReset: () => void }> = ({ initialTime, onReset }) => {
    const time = initialTime * 60;
    const [timeRemaining, setTimeRemaining] = useState(time);
    const [isPaused, setIsPaused] = useState(false);
    const ref = useRef<HTMLDialogElement>(null);

    const onPause = () => setIsPaused((prevState) => !prevState)

    useEffect(() => {
        const timerInterval = setInterval(() => {
            if (!isPaused) {
                setTimeRemaining((prevTime) => {
                    if (prevTime === 0) {
                        clearInterval(timerInterval);

                        if (ref.current) {
                            ref.current.showModal();
                        }

                        return 0;
                    } else {
                        return prevTime - 1;
                    }
                });
            }
        }, 1000);

        return () => {
            clearInterval(timerInterval)
        };
    }, [isPaused]);

    // const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return (
        <>
            <div>
                <span className={`countdown font-mono text-6xl rounded-xl p-1 hover:cursor-pointer md:hover:opacity-60 ${isPaused ? 'bg-secondary' : 'bg-accent'}`} onClick={onPause}>
                    <span style={{ ['--value' as string]: minutes }}></span>:
                    <span style={{ ['--value' as string]: seconds }}></span>
                </span>
            </div>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" ref={ref}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Done!</h3>
                    <p className="py-4">Press ESC key or click the button below to close</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn" onClick={onReset}>Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default CountdownTimer;
