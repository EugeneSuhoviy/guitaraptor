import { deleteExercise } from '@/utils/actions'
import LoadingBtn from './loading-btn';

export default function DeleteForm({ id }: { id: number }) {
    const deleteExerciseWithId = deleteExercise.bind(null, id);

    return (
        <form action={deleteExerciseWithId}>
            <LoadingBtn name={'Delete'} loadingPlaceholder={'Deleting'} className='btn btn-secondary'/>
        </form>
    );
}
