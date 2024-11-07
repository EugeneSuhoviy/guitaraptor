/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'
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
    const supabase = await createClient();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (!session) {
        console.error("User not logged in", sessionError);
        return [];
    }

    const { data: exercises, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', session.user.id)
        .order('order', { ascending: true });

    if (error) {
        console.error("Error fetching exercises:", error);
        return [];
    }

    return exercises as Exercise[];
}


export async function getById(id: number) {
    const supabase = await createClient();

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
    const supabase = await createClient();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (!session) {
        console.error("User not logged in", sessionError);
        return;
    }

    const { name, duration, bpm, comment } = {
        name: formData.get('name') as string | null,
        duration: formData.get('duration') as string | null,
        bpm: formData.get('bpm') as string | null,
        comment: formData.get('comment') as string | null,
    };

    const bpmNumber = bpm ? Number(bpm) : null;
    const durationNumber = duration ? Number(duration) : null;

    const { data, error } = await supabase
        .from('exercises')
        .insert({
            bpm: bpmNumber,
            name: name,
            duration: durationNumber,
            comment: comment,
            user_id: session.user.id
        });

    if (error) {
        console.error("Error creating exercise:", error);
        return;
    }

    revalidatePath('/');
    redirect('/');
}

export async function deleteExercise(id: number) {
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (!session) {
        console.error("User not logged in", sessionError);
        return;
    }

    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

    revalidatePath('/');
    redirect('/');
}

export async function updateExercise(id: number, formData: FormData) {
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (!session) {
        console.error("User not logged in", sessionError);
        return;
    }

    const { name, duration, bpm, comment } = {
        name: formData.get('name'),
        duration: formData.get('duration'),
        bpm: formData.get('bpm'),
        comment: formData.get('comment'),
    };

    const bpmNumber = bpm !== null ? Number(bpm) : null;
    const durationNumber = duration !== null ? Number(duration) : null;
    const nameString = typeof name === 'string' ? name : null;
    const commentString = typeof comment === 'string' ? comment : null;

    const { data, error } = await supabase
        .from('exercises')
        .update({
            bpm: bpmNumber,
            name: nameString,
            duration: durationNumber,
            comment: commentString,
        })
        .eq('id', id)
        .eq('user_id', session.user.id);

    if (error) {
        console.error("Error updating exercise:", error);
        return;
    }

    revalidatePath('/');
    redirect('/');
}
