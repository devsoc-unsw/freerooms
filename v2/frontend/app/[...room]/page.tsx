export default async function Page({ params }: {
  params: { slug: string }[];
}) {
  return <h1 style={{marginTop: "6rem"}}>{JSON.stringify(params)}</h1>;
}