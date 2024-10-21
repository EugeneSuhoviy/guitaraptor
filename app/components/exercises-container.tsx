'use client';

import Exercise from "./exercise";

interface ExerciseProps {
    id: number,
    created_at: string,
    bpm: number,
    name: string,
    duration: number,
    comment: string
}

interface ExercisesContainerProps {
    exercises: ExerciseProps[];
}

export default function ExercisesContainer({ exercises }: ExercisesContainerProps) {
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
