'use client';

import Exercise from "./exercise";

interface Exercise {
    id: number,
    created_at: string,
    bpm: number,
    name: string,
    duration: number,
    comment: string
}

export default function ExercisesContainer({ exercises }: { exercises: [Exercise] }) {
    return <>
        {exercises?.map((item, index) => {
            return <div key={index}>
                <Exercise
                    name={item.name}
                    bpm={item.bpm}
                    duration={item.duration}
                    id={item.id}
                />
            </div>
        })}
    </>
}
