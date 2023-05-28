import type {
    ActionArgs,
    LinksFunction,
  } from "@remix-run/node";
  import {
    Link,
    useActionData,
    useSearchParams,
  } from "@remix-run/react";
  
  import stylesUrl from "~/styles/login.css";
  import { db } from "~/utils/db.server";
  
  export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl },
  ];
  
  function validateUsername(username: string) {
    if (username.length < 6) {
      return "Usernames must be at least 3 characters long";
    }
  }
  
  function validatePassword(password: string) {
    if (password.length < 6) {
      return "Passwords must be at least 6 characters long";
    }
  }
  
  function validateUrl(url: string) {
    const urls = ["/jokes", "/", "https://remix.run"];
    if (urls.includes(url)) {
      return url;
    }
    return "/jokes";
  }
  
  export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const loginType = form.get("loginType");
    const password = form.get("password");
    const username = form.get("username");
    const redirectTo = validateUrl(
      (form.get("redirectTo") as string) || "/jokes"
    );
    if (
      typeof loginType !== "string" ||
      typeof password !== "string" ||
      typeof username !== "string"
    ) {
        return { formError: `Form not submitted correctly.` };
    }
  
    const fields = { loginType, password, username };
    const fieldErrors = {
      password: validatePassword(password),
      username: validateUsername(username),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
        return { formError: `Form not submitted correctly.` };
    }
  
    switch (loginType) {
      case "login": {
        let user = await Login({username, password})
        if (!user) return {
            return: { formError: `Form not submitted correctly.` };
        }
        // login to get the user
        // if there's no user, return the fields and a formError
        // if there is a user, create their session and redirect to /jokes
      }
      case "register": {
        const userExists = await db.user.findFirst({
          where: { username },
        });
        if (userExists) {
            return { formError: `Form not submitted correctly.` };
        }
        // create the user
        // create their session and redirect to /jokes
        return { formError: `Form not submitted correctly.` };
      }
      default: {
        return { formError: `Form not submitted correctly.` };
      }
    }
  };
  
  export default function Login() {
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();
    return (
      <div className="container">
        <div className="content" data-light="">
          <h1>Login</h1>
          <form method="post">
            <input
              type="hidden"
              name="redirectTo"
              value={
                searchParams.get("redirectTo") ?? undefined
              }
            />
            <fieldset>
              <legend className="sr-only">
                Login or Register?
              </legend>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="login"
                  defaultChecked={
                    !actionData?.fields?.loginType ||
                    actionData?.fields?.loginType === "login"
                  }
                />{" "}
                Login
              </label>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="register"
                  defaultChecked={
                    actionData?.fields?.loginType ===
                    "register"
                  }
                />{" "}
                Register
              </label>
            </fieldset>
            <div>
              <label htmlFor="username-input">Username</label>
              <input
                type="text"
                id="username-input"
                name="username"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(
                  actionData?.fieldErrors?.username
                )}
                aria-errormessage={
                  actionData?.fieldErrors?.username
                    ? "username-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.username ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="username-error"
                >
                  {actionData.fieldErrors.username}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                defaultValue={actionData?.fields?.password}
                aria-invalid={Boolean(
                  actionData?.fieldErrors?.password
                )}
                aria-errormessage={
                  actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p
                  className="form-validation-error"
                  role="alert"
                >
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
        <div className="links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jokes">Jokes</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  