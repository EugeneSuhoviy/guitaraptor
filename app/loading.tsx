export default function Loading() {
  const SKELETON_LINE_NUMBER = 4;

  return <main className="p-3 max-w-3xl mx-auto">
    {[...Array(SKELETON_LINE_NUMBER)].map((_, index) => (
      <div key={index} className="flex w-full flex-col gap-4 mb-4">
        <div className="flex items-center gap-4 p-5">
          <div className="skeleton h-10 w-20 shrink-0 rounded mr-5"></div>
          <div className="flex flex-col gap-2 mr-auto">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-4 w-16"></div>
            <div className="skeleton h-4 w-16"></div>
          </div>
          <div className="skeleton h-10 w-20 rounded"></div>
        </div>
        <div className="skeleton h-1 w-full rounded"></div>
      </div>
    ))}
    <div className="skeleton h-10 w-32 rounded mt-5"></div>
  </main>
}