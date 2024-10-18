
import Exercise from "./components/exercise";
import Link from 'next/link'
import { getAllExercises } from "@/app/lib/actions";

export default async function Home() {
  const exercises = await getAllExercises()

  return (
    <>
      <main className="p-5">
        {exercises?.map((item, index) => {
          return <div key={index}>
            <Exercise name={item.name} bpm={item.bpm} duration={item.duration} id={item.id} />
          </div>
        })}

        <Link role="button" className="btn" href="/exercise/create">Add exercise</Link>
      </main>
    </>
  );
}
