
import Link from 'next/link'
import { getAllExercises } from "@/app/lib/actions";
import ExercisesContainer from "./components/exercises-container";

export default async function Home() {
  const exercises = await getAllExercises()

  return (
    <>
      <main className="p-5">
        <ExercisesContainer exercises={exercises} />
        <Link role="button" className="btn my-4" href="/exercise/create">Add exercise</Link>
      </main>
    </>
  );
}
