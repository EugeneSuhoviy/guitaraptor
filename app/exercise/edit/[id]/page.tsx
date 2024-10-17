import EditForm from "@/app/components/edit-form";
import { getById } from "@/app/lib/actions";


export default async function Edit({ params }: { params: { id: string } }) {
  const data = await getById(Number(params.id));

  return (
    <>
      <main className="p-3">
        <EditForm data={data} />
      </main>
    </>
  );
}
