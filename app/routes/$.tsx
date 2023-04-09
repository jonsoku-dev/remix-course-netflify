import { redirect } from "@remix-run/node";

export function loader({ params }: any) {
  if (params["*"] === "exp") {
    return redirect("/expenses");
  }

  throw new Response("Not found", { status: 404 });
}
