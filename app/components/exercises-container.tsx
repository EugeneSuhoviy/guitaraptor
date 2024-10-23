'use client';

import { closestCorners, DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from 'next/navigation';

const Exercise = dynamic(() => import('./exercise'), { ssr: false });

interface ExerciseProps {
    id: number,
    created_at: string,
    bpm: number,
    name: string,
    duration: number,
    comment: string,
    order: number
}

interface ExercisesContainerProps {
    exercises: ExerciseProps[];
}

export default function ExercisesContainer({ exercises }: ExercisesContainerProps) {
    const router = useRouter();

    const [copyExercises, setCopyExercises] = useState<ExerciseProps[]>([...exercises]);

    const [swappedItem, setSwappedItem] = useState([]);

    const getExercisesPos = (id: UniqueIdentifier | undefined) => copyExercises.findIndex((exercise) => exercise.id === id);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;


        if (active.id === over?.id) return

        setCopyExercises((items) => {
            const originalPos = getExercisesPos(active.id);
            const newPos = getExercisesPos(over?.id);

            const updatedItems = arrayMove(items, originalPos, newPos);


            const swappedExercise1 = items[originalPos]
            const swappedExercise2 = items[newPos]


            const updateDatabase = async () => {
                try {
                    const { error: oldIndexError } = await supabase
                        .from('exercises')
                        .update({ order: swappedExercise1.order })
                        .eq('id', swappedExercise2.id);

                    // if (oldIndexError) {
                    //     console.error(`Error updating order for exerciseId ${updatedItems[oldIndex].id}:`, oldIndexError);
                    // }

                    const { error: newIndexError } = await supabase
                        .from('exercises')
                        .update({ order: swappedExercise2.order })
                        .eq('id', swappedExercise1.id);

                    // if (newIndexError) {
                    //     console.error(`Error updating order for exerciseId ${updatedItems[newIndex].id}:`, newIndexError);
                    // }
                } catch (err) {
                    console.error('Error updating order in database:', err);
                }
            };


            // updateDatabase();
            // router.refresh();
            return updatedItems;
        });
    };

    return <>
        <ul className="exercises">
            <DndContext collisionDetection={closestCorners} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                <SortableContext items={copyExercises} strategy={verticalListSortingStrategy}>
                    {copyExercises?.map((item, index) => {
                        return <li key={index} className="bg-base-300 rounded-xl mb-2">
                            <div className="bg-base-200 rounded-xl">
                                <Exercise
                                    name={item.name}
                                    bpm={item.bpm}
                                    duration={item.duration}
                                    id={item.id}
                                />
                            </div>
                        </li>
                    })}
                </SortableContext>
            </DndContext>
        </ul>
    </>
}
