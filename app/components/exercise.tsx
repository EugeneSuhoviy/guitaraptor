'use client';

import Link from 'next/link'
import { useState } from 'react'
import CountdownTimer from './countdown-timer';

export default function Exercise({ id, name, bpm, duration }: { id: number, name: string, bpm: number, duration: number }) {

    const [isStarted, setIsStarted] = useState(false)

    function handleClick() {
        setIsStarted(() => !isStarted)
    }

    return <>
        <div className="mb-1 w-full flex items-center p-5" >
            {isStarted ?
                <button className="btn btn-primary mr-5" onClick={handleClick}>Stop</button> :
                <button className="btn btn-primary mr-5" onClick={handleClick}>Start</button>
            }


            <div className="flex items-left flex-col mr-auto">
                <div>name: {name}</div>
                <div>bpm: {bpm}</div>
                <div>time: {duration}</div>
            </div>

            {isStarted ? <CountdownTimer initialTime={duration}/> : ''}


            <Link role="button" className="btn ml-auto" href={`/exercise/edit/${id}`}>Edit</Link>
        </div>
        <div className="divider"></div>
    </>
}
