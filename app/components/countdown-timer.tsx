'use client';

import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer: React.FC<{ initialTime: number }> = ({ initialTime }) => {
    const time = initialTime * 60;
    const [timeRemaining, setTimeRemaining] = useState(time);
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const timerInterval = setInterval(() => {
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
        }, 1000);

        return () => {
            clearInterval(timerInterval)
        };
    }, []);

    // const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return (
        <>
            <div>
                <span className="countdown font-mono text-6xl rounded-xl bg-accent p-1">
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
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default CountdownTimer;