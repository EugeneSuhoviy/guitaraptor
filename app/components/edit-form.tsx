import { updateExercise } from "@/app/lib/actions";
import BpmRange from "./ui/bpm-range";
import DeleteBtn from "@/app/components/delete-btn";

interface Exercise {
    id: number,
    created_at: string,
    bpm: number,
    name: string,
    duration: number
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
                        <input type="text" placeholder="Name" name="name" className="input input-bordered w-full mb-5" defaultValue={data.name} />

                        <input type="number" placeholder="Minutes" name="duration" className="input input-bordered w-full mb-5" defaultValue={data.duration} />

                        <BpmRange defaultBpm={data.bpm} />

                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </form>
        <DeleteBtn id={data.id} />
    </>
}
