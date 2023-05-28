import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { useTransition } from "react";0

export async function loader() {
  
}

export async function action({request}) {


}

export default function Index() {
  const users = useLoaderData();
  console.log('users', users)
  const {state} = useTransition();
  const data = useActionData<typeof action>();

  let [searchParms] = useSearchParams();


  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
    <div>Create a new user</div>
    <Form method="post">
      <label htmlFor="username">Username: </label>
        <input type="text" name="username"  />
        <label htmlFor="password">Password: </label>
        <input type="text" name="password" />
        <button type="submit">Login</button>
    </Form>
    <p>{data ? data : 'No data'}</p>
    </div>
  );
}
