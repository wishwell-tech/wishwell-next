export default async function Page({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const wishId = (await params).wishId;
  return (
    <div>
      <h1>Wish {wishId}</h1>
    </div>
  );
}
