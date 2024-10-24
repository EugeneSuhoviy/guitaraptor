'use client';

import Link from 'next/link'
import { useState } from 'react'
import CountdownTimer from './countdown-timer';
import { useWakeLock } from 'react-screen-wake-lock';
import { useStore } from '@/app/store/exercise';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars2Icon } from '@heroicons/react/24/outline'

export default function Exercise({ id, name, bpm, duration }: { id: number, name: string, bpm: number, duration: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id, transition: null, });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

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
        <div className="mb-1 w-full flex items-center p-5" ref={setNodeRef} style={style}>
            <button className={`btn ${isStarted ? 'btn-secondary' : 'btn-primary'} mr-5`} onClick={handleClick}>
                {isStarted ? 'Stop' : 'Start'}
            </button>
            <div className="flex items-left flex-col mr-auto">
                {!isStarted && (
                    <>
                        <div>name: {name}</div>
                        <div>bpm: {bpm}</div>
                        <div>time: {duration}</div>
                    </>
                )}
                {isStarted && (
                    <div className='flex flex-col'>
                        <span className='text-xl font-bold'>{bpm}</span>
                        <span>BPM</span>
                    </div>
                )}
            </div>
            {isStarted && <CountdownTimer initialTime={duration} />}
            {!isStarted && (
                <>
                    <Link role="button" className="btn btn-secondary ml-auto" href={`/exercise/edit/${id}`}>
                        Edit
                    </Link>
                    <button {...attributes} {...listeners} className="cursor-move" type="button">
                        <Bars2Icon className="size-6 ml-2" />
                    </button>
                </>
            )}
        </div>
    </>
}
