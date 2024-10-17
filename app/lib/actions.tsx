/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/app/lib/supabase'
import { redirect } from 'next/navigation';

// export async function getAll(id: number) {

//     revalidatePath('/');
// }

export async function getById(id: number) {
    const { data: exercise, error } = await supabase
        .from('exercises')
        .select("*")
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }

    return exercise
}

export async function createExercise(formData: FormData) {
    const { name, duration, bpm } = {
        name: formData.get('name'),
        duration: formData.get('duration'),
        bpm: formData.get('bpm'),
    };

    const { data: exercises, error } = await supabase
        .from('exercises')
        .insert({ bpm: bpm, name: name, duration: duration })

    revalidatePath('/');
    redirect('/')
}

export async function deleteExercise(id: number) {


    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

    revalidatePath('/');
    redirect('/')
}

export async function updateExercise(id: number, formData: FormData) {

    const { name, duration, bpm } = {
        name: formData.get('name'),
        duration: formData.get('duration'),
        bpm: formData.get('bpm'),
    };

    const { data, error } = await supabase
        .from('exercises')
        .update({ bpm: bpm, name: name, duration: duration })
        .eq('id', id)
        .select()

    revalidatePath('/');
    redirect('/')
}

