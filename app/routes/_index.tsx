import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { useTransition } from "react";0

export async function loader() {
  const prisma = new PrismaClient()
  const allUsers = prisma.user.findMany();

  await prisma.$disconnect();
  return allUsers
}

export async function action({request}) {
  console.log('req', request)
  const form = await request.formData(); 
  const prisma = await new PrismaClient();

  const allUsers = await prisma.user.create({
    data: {email: form.get("email"), username: form.get("username"), name: form.get("name")}
  })

  console.log('all users', allUsers)
  await prisma.$disconnect();
  return true


}

export default function Index() {
  const users = useLoaderData();
  console.log('users', users)
  const {state} = useTransition();
  const data = useActionData<typeof action>();


  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
    <div>Create a new user</div>
    <Form method="post">
      <label htmlFor="username">Username: </label>
        <input type="text" name="username"  />
        <label htmlFor="email">Email: </label>
        <input type="text" name="email" />
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" />
        <button type="submit">Create user</button>
    </Form>
    <p>{data ? data : 'No data'}</p>
    </div>
  );
}
