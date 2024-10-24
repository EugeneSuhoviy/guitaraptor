'use client';

import { closestCorners, DndContext, DragEndEvent, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { supabase } from "@/app/lib/supabase";

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
    const [copyExercises, setCopyExercises] = useState<ExerciseProps[]>([...exercises]);
    const getExercisesPos = (id: UniqueIdentifier | undefined) => copyExercises.findIndex((exercise) => exercise.id === id);
    
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id === over?.id) return

        setCopyExercises((items) => {
            const originalPos = getExercisesPos(active.id);
            const newPos = getExercisesPos(over?.id);

            const updatedItems = arrayMove(items, originalPos, newPos);

            updatedItems.forEach((item, index) => {
                item.order = index + 1;
            });

            const updateDatabase = async () => {
                try {
                    const promises = updatedItems.map(async (item) => {
                        const { error } = await supabase
                            .from('exercises')
                            .update({ order: item.order })
                            .eq('id', item.id);

                        if (error) {
                            console.error(`Error updating order for exerciseId ${item.id}:`, error);
                        }
                    });

                    await Promise.all(promises);
                } catch (err) {
                    console.error('Error updating order in database:', err);
                }
            };

            updateDatabase();
            return updatedItems;
        });
    };

    const touchSensor = useSensor(TouchSensor);

    const sensors = useSensors(
        touchSensor,
    );

    return <>
        <ul className="exercises">
            <DndContext sensors={sensors} collisionDetection={closestCorners} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
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
