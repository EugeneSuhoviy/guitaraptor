'use client';

import Link from 'next/link'
import { useState } from 'react'
import CountdownTimer from './countdown-timer';
import { useWakeLock } from 'react-screen-wake-lock';
import { useStore } from '@/app/store/exercise';

export default function Exercise({ id, name, bpm, duration }: { id: number, name: string, bpm: number, duration: number }) {
    const { request, release } = useWakeLock();
    const [isStarted, setIsStarted] = useState(false)

    const runningExerciseId = useStore((state) => state.runningExerciseId)

    if (isStarted && runningExerciseId !== id) {
        setIsStarted(false)
    }

    function handleClick() {
        useStore.setState({ runningExerciseId: id });

        setIsStarted((prevState) => {
            if (prevState) {
                release();
            } else {
                request();
            }

            return !prevState
        });
    }

    return <>
        <div className="mb-1 w-full flex items-center p-5" >
            {isStarted ?
                <button className="btn btn-primary mr-5" onClick={handleClick}>Stop</button> :
                <button className="btn btn-primary mr-5" onClick={handleClick}>Start</button>
            }
            <div className="flex items-left flex-col mr-auto">
                {!isStarted ? <div>name: {name}</div> : ''}
                {!isStarted ? <div>bpm: {bpm}</div> : <div className='flex flex-col'><span className='text-xl font-bold'>{bpm}</span><span>BPM</span></div>}
                {!isStarted ? <div>time: {duration}</div> : ''}
            </div>
            {isStarted ? <CountdownTimer initialTime={duration} /> : ''}
            {!isStarted ? <Link role="button" className="btn btn-secondary ml-auto" href={`/exercise/edit/${id}`}>Edit</Link> : ''}
        </div>
        {/* <div className="divider"></div> */}
    </>
}
