'use client';

import { createSwapy } from "swapy";
import Exercise from "./exercise";
import { useEffect } from "react";

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
    useEffect(() => {
        const container = document.querySelector('.exercises')!
        const swapy = createSwapy(container, {
            swapMode: 'hover',
            animation: 'dynamic',
            autoScrollOnDrag: true
        })

        swapy.onSwap(({ data }) => {
            console.log('swap', data);
            // localStorage.setItem('slotItem', JSON.stringify(data.object))
        })

        swapy.onSwapEnd(({ data, hasChanged }) => {
            console.log(hasChanged);
            console.log('end', data);
        })

        swapy.onSwapStart(() => {
            console.log('start')
        })


        // temporary disabled
        swapy.enable(false)

        return () => {
            swapy.destroy()
        }
    }, [])

    return <>
        <ul className="exercises">
            {exercises?.map((item, index) => {
                return <li key={index} data-swapy-slot={item.id} className="bg-base-300 rounded-xl mb-2">
                    <div data-swapy-item={item.name} className="bg-base-200 rounded-xl">
                        <Exercise
                            name={item.name}
                            bpm={item.bpm}
                            duration={item.duration}
                            id={item.id}
                        />
                    </div>
                </li>
            })}
        </ul>
    </>
}
