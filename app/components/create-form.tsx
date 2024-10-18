import { createExercise } from "@/app/lib/actions";
import BpmRange from "./ui/bpm-range";
import LoadingBtn from "@/app/components/loading-btn";

export default async function CreateForm() {
    return <form action={createExercise}>
        <div className="mb-4">
            <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <label htmlFor="amount" className="sr-only">
                        Choose an amount
                    </label>
                    <input type="text" placeholder="Name" name="name" className="input input-bordered w-full mb-5" />

                    <input type="number" placeholder="Minutes" name="duration" className="input input-bordered w-full mb-5" />

                    <BpmRange />

                    <textarea className="textarea textarea-bordered w-full mb-5" name="comment" placeholder="Comment"></textarea>

                    <LoadingBtn name={'Save'} loadingPlaceholder={'Saving'} className={'btn btn-primary'}/>
                </div>
            </div>
        </div>
    </form>
}
