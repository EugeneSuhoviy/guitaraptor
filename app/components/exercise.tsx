'use client';

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CountdownTimer from './countdown-timer';
import { useWakeLock } from 'react-screen-wake-lock';
import { useStore } from '@/app/store/exercise';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars2Icon as Bars2IconOutline } from '@heroicons/react/24/outline';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Bars2Icon as Bars2IconSolid, PencilSquareIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/16/solid';
import { PlayIcon } from '@heroicons/react/24/solid'
import { StopIcon } from '@heroicons/react/24/solid'

interface ExerciseProps {
    id: number,
    name: string,
    bpm: number,
    duration: number,
    handleDelete: (id: number) => void,
    handleDuplicate: (id: number) => void
}

export default function Exercise({ id, name, bpm, duration, handleDelete, handleDuplicate }: ExerciseProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id, transition: null });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    const { request, release } = useWakeLock();
    const [isStarted, setIsStarted] = useState(false);

    const ref = useRef<HTMLDetailsElement>(null);

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

    function handleDropdownClick() {
        ref.current?.removeAttribute('open');
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                ref.current?.removeAttribute('open');
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return <>
        <div className="mb-1 w-full flex items-center p-5" ref={setNodeRef} style={style}>
            <button className={`btn ${isStarted ? 'btn-secondary' : 'btn-primary'} mr-5`} onClick={handleClick}>
                {isStarted ? <StopIcon className="size-4" /> : <PlayIcon className="size-4" />}
            </button>
            <div className="flex items-left flex-col mr-auto">
                {!isStarted && (
                    <>
                        <div className="text-lg font-semibold">{name}</div>
                        <div><span className="font-semibold">{bpm}</span> BPM</div>
                        <div><span className="font-semibold">{duration}</span> min</div>
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
                    <details className="dropdown dropdown-bottom dropdown-end" ref={ref}>
                        <summary className="btn m-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-5 w-5 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                        </summary>
                        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow" onClick={handleDropdownClick}>
                            <li>
                                <Link href={`/exercise/edit/${id}`}>
                                    <PencilSquareIcon className="size-4" />
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <a onClick={() => { handleDuplicate(id) }}>
                                    <DocumentDuplicateIcon className="size-4" />
                                    Duplicate
                                </a>
                            </li>
                            <li>
                                <a onClick={() => { handleDelete(id) }}>
                                    <TrashIcon className="size-4" />
                                    Delete
                                </a>
                            </li>
                            {/* <li>
                                <a>
                                    <Bars2IconSolid className="size-4" />
                                    Reorder
                                </a>
                            </li> */}
                        </ul>
                    </details>
                    <button {...attributes} {...listeners} className="cursor-move touch-none" type="button">
                        <Bars2IconOutline className="size-6 ml-2" />
                    </button>
                    {/* {runningExerciseId}
                    <pre>{runningExerciseId! ? '+' : '-'}</pre> */}
                </>
            )}
        </div>
    </>
}
