/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/app/lib/supabase'
import { redirect } from 'next/navigation';
interface Exercise {
    id: number,
    created_at: string,
    bpm: number,
    name: string,
    duration: number,
    comment: string,
    order: number
}

export async function getAllExercises() {    
    const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*')
    .order('order', { ascending: true });

    return exercises as Exercise[];
}

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

    return exercise;
}

export async function createExercise(formData: FormData) {
    const { name, duration, bpm, comment } = {
        name: formData.get('name'),
        duration: formData.get('duration'),
        bpm: formData.get('bpm'),
        comment: formData.get('comment'),
    };

    const { data: exercises, error } = await supabase
        .from('exercises')
        .insert({ bpm: bpm, name: name, duration: duration, comment: comment })

    revalidatePath('/');
    redirect('/');
}

export async function deleteExercise(id: number) {
    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

    revalidatePath('/');
    redirect('/');
}

export async function updateExercise(id: number, formData: FormData) {
    const { name, duration, bpm, comment } = {
        name: formData.get('name'),
        duration: formData.get('duration'),
        bpm: formData.get('bpm'),
        comment: formData.get('comment'),
    };

    const { data, error } = await supabase
        .from('exercises')
        .update({ bpm: bpm, name: name, duration: duration, comment: comment })
        .eq('id', id)
        .select();

    revalidatePath('/');
    redirect('/');
}
