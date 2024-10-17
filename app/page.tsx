
import { supabase } from '@/app/lib/supabase'
import Exercise from "./components/exercise";
import Link from 'next/link'

export default async function Home() {
  // TODO move to actions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*')

  return (
    <>
      <main className="p-3">
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
