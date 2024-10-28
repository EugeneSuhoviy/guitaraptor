'use client';

import { closestCorners, DndContext, DragEndEvent, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { createClient } from "@/app/lib/supabase/client";

const Exercise = dynamic(() => import('./exercise'), { ssr: false });
const supabase = createClient();
interface ExercisesProps {
    id: number,
    created_at: string,
    bpm: number,
    name: string,
    duration: number,
    comment: string,
    order: number,
    user_id?: string
}

interface ExercisesContainerProps {
    exercises: ExercisesProps[];
}

export default function ExercisesContainer({ exercises }: ExercisesContainerProps) {
    const [copyExercises, setCopyExercises] = useState<ExercisesProps[]>([...exercises]);
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

    async function handleDelete(id: number) {
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting exercise:', error);
            return
        } else {
            setCopyExercises((prevExercises) => {
                return prevExercises.filter(exercise => exercise.id !== id)
            });
        }
    };

    async function handleDuplicate(id: number) {
        const duplicatedExercise = copyExercises.find(exercise => exercise.id === id)

        if (!duplicatedExercise) {
            console.error('Duplicated exercise not found!');
            return;
        }

        const { data, error } = await supabase
            .from('exercises')
            .insert({
                bpm: duplicatedExercise?.bpm,
                name: duplicatedExercise?.name,
                duration: duplicatedExercise?.duration,
                comment: duplicatedExercise?.comment,
                user_id: duplicatedExercise?.user_id

            })
            .select();

        if (error) {
            console.error('Error duplicating exercise:', error);
            return
        } else {
            if (data && data.length > 0) {
                setCopyExercises((prevExercises) => {
                    return [...prevExercises, data[0]]
                });
            }
        }
    }

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    const pointerSensor = useSensor(PointerSensor);

    const sensors = useSensors(
        pointerSensor,
        touchSensor
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
                                    handleDelete={handleDelete}
                                    handleDuplicate={handleDuplicate}
                                />
                            </div>
                        </li>
                    })}
                </SortableContext>
            </DndContext>
        </ul>
    </>
}
