import DeleteForm from "@/app/components/delete-form";
import EditForm from "@/app/components/edit-form";
import { getById } from "@/app/lib/actions";

export default async function Edit({ params }: { params: { id: string } }) {
  const data = await getById(Number(params.id));

  return (
    <>
      <main className="p-5 max-w-3xl mx-auto">
        {data ? <EditForm data={data} /> : <p>No exercise data available.</p>}
        <DeleteForm id={Number(params.id)} />
      </main>
    </>
  );
}
