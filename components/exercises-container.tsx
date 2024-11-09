'use client';

import { closestCorners, DndContext, DragEndEvent, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { useId, useRef, useState } from "react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { createClient } from "@/utils/supabase/client";
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/solid'
import Exercise from "./exercise";
import Confetti from 'react-confetti-boom';

interface ExercisesProps {
    id: number,
    created_at: string,
    bpm: number,
    name: string,
    duration: number,
    comment: string,
    order: number,
    user_id?: string,
    finish_date?: string
}

interface ExercisesContainerProps {
    exercises: ExercisesProps[];
}

export default function ExercisesContainer({ exercises }: ExercisesContainerProps) {
    const supabase = createClient();
    const [copyExercises, setCopyExercises] = useState<ExercisesProps[]>([...exercises]);
    const getExercisesPos = (id: UniqueIdentifier | undefined) => copyExercises.findIndex((exercise) => exercise.id === id);
    const id = useId();
    const [isExploding, setIsExploding] = useState(false);

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

    const refModalDelete = useRef<HTMLDialogElement>(null);

    const [deleteId, setDeleteId] = useState(0);

    function handleDelete(id: number) {
        if (refModalDelete.current) {
            refModalDelete.current.showModal();
        }

        setDeleteId(id);
    };

    async function onDelete() {
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', deleteId);

        if (error) {
            console.error('Error deleting exercise:', error);
            return
        } else {
            setCopyExercises((prevExercises) => {
                return prevExercises.filter(exercise => exercise.id !== deleteId)
            });

            setDeleteId(0);
        }
    }

    async function handleUpdate(id: number) {
        const { error } = await supabase
            .from('exercises')
            .update({ finish_date: new Date().toISOString() })
            .eq('id', id);

            handleExplode();
        if (error) {
            console.error('Error updating exercise:', error);
            return
        }
    }

    function handleExplode() {
        setIsExploding(true);

        setTimeout(function () {
            setIsExploding(false);
        }, 3000);
    }

    async function handleDuplicate(id: number) {
        const duplicatedExercise = copyExercises.find(exercise => exercise.id === id)

        if (!duplicatedExercise) {
            console.error('Duplicated exercise not found!');
            return;
        }

        if (!duplicatedExercise.user_id) {
            console.error('User ID is required for duplication.');
            return;
        }

        const { data, error } = await supabase
            .from('exercises')
            .insert({
                bpm: duplicatedExercise.bpm as number,
                name: duplicatedExercise.name + ' copy' as string,
                duration: duplicatedExercise.duration as number,
                comment: duplicatedExercise.comment as string,
                user_id: duplicatedExercise.user_id
            })
            .select();

        if (error) {
            console.error('Error duplicating exercise:', error);
            return
        } else {
            if (data && data.length > 0) {
                setCopyExercises((prevExercises) => {
                    return [...prevExercises, data[0] as ExercisesProps]
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
        <div className="max-w-3xl mx-auto">
        {isExploding && <Confetti mode="boom" particleCount={50} colors={['#ff577f', '#ff884b']}  />}
            {copyExercises.length ? <div>
                <DndContext id={id} sensors={sensors} collisionDetection={closestCorners} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                    <SortableContext items={copyExercises} strategy={verticalListSortingStrategy}>
                        <ul className="exercises">
                            {copyExercises?.map((item) => {
                                return <Exercise
                                    key={item.id}
                                    name={item.name}
                                    bpm={item.bpm}
                                    duration={item.duration}
                                    id={item.id}
                                    finishDate={item.finish_date || null}
                                    handleDelete={handleDelete}
                                    handleDuplicate={handleDuplicate}
                                    handleUpdate={handleUpdate}
                                />
                            })}
                        </ul>
                    </SortableContext>
                </DndContext>
                <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle" ref={refModalDelete}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete exercise?</h3>
                        {/* <p className="py-4">Press ESC key or click the button below to close</p> */}
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn btn-secondary mr-4" onClick={onDelete}>YES</button>
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div> : <h2 className="text-center w-full text-xl">Hit plus button and add your first exercise 👇</h2>}
            <div className="flex justify-end mt-5">
                <Link role="button" className="btn btn-secondary" href="/exercise/create"><PlusIcon className="size-4" /></Link>
            </div>
        </div>
    </>
}
