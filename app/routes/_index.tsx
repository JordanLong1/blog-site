import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const prisma = new PrismaClient()
  const allUsers = prisma.user.findMany();

  await prisma.$disconnect();
  return allUsers
}
export default function Index() {
  const users = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
    <div>Hello world</div>
    {users.map((user) => {
      const {name, id} = user;
      return <li key={id}>{name}</li>
    })}
    </div>
  );
}
