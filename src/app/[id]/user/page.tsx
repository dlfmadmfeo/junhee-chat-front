export async function generateStaticParams() {
    return [{ id: '1' }, { id: '2' }];
  }
  

export default async function User({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <>유저의 ID: {id}</>;
}
