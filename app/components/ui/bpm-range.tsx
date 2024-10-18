'use client'

import { useState } from "react"

export default function BpmRange({ defaultBpm }: {defaultBpm?: number}) {
    const currentBpm = defaultBpm ? defaultBpm : 100;

    const [bpm, setBpm] = useState(currentBpm)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setBpm(Number(e.currentTarget.value))
    }

    return <>
        <span>BPM:</span>
        <span>{bpm}</span>
        <input type="range" name="bpm" min="0" max="200" value={bpm} className="range range-lg range-primary  mb-5" onChange={handleChange} />
    </>
}
