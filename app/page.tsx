import { getAllExercises } from "@/app/lib/actions";
import ExercisesContainer from "./components/exercises-container";
import LogoutBtn from './components/login/logout-btn';

export default async function Home() {
  const exercises = await getAllExercises()

  return (
    <>
      <main className="p-5">
        <ExercisesContainer exercises={exercises} />
        <LogoutBtn />
      </main>
    </>
  );
}
