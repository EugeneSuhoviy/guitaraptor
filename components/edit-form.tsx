import { updateExercise } from "@/utils/actions";
import BpmRange from "./ui/bpm-range";
import LoadingBtn from "./loading-btn";

interface Exercise {
    bpm: number | null;
    comment: string | null;
    created_at: string;
    duration: number | null;
    id: number;
    name: string | null;
    order: number;
    user_id: string;
}

export default async function EditForm({ data }: { data: Exercise }) {
    const updateExerciseWithId = updateExercise.bind(null, data.id);

    return <>
        <form action={updateExerciseWithId}>
            <div className="mb-4">
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <label htmlFor="amount" className="sr-only">
                            Choose an amount
                        </label>
                        <input type="text" placeholder="Name" name="name" className="input input-bordered w-full mb-5" defaultValue={data.name ?? ''} />

                        <input type="number" placeholder="Minutes" name="duration" className="input input-bordered w-full mb-5" defaultValue={data.duration ?? ''} />

                        <BpmRange defaultBpm={data.bpm ?? 0} />

                        <textarea className="textarea textarea-bordered w-full mb-5" name="comment" placeholder="Comment" defaultValue={data.comment ?? ''}></textarea>

                        <LoadingBtn name={'Save'} loadingPlaceholder={'Saving'} className="btn btn-secondary" />
                    </div>
                </div>
            </div>
        </form>
    </>
}
