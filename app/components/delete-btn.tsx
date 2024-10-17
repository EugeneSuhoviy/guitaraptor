import { deleteExercise } from '@/app/lib/actions'

export default function DeleteBtn({ id }: { id: number }) {
    const deleteExerciseWithId = deleteExercise.bind(null, id);

    return (
        <form action={deleteExerciseWithId}>
            <button type="submit" className="btn btn-secondary">
                <span>Delete</span>
            </button>
        </form>
    );
}
