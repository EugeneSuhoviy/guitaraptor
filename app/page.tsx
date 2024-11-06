import { getAllExercises } from "@/utils/actions";
import ExercisesContainer from "../components/exercises-container";

export default async function Home() {
  const exercises = await getAllExercises()

  return (
    <>
      <main className="p-5">
        <ExercisesContainer exercises={exercises} />
      </main>
    </>
  );
}
