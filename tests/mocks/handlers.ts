import { HttpResponse, http } from "msw";
import { products } from "./data";
import { db } from "./db";

export const handler = [
  ...db.product.toHandlers("rest"),
  ...db.categories.toHandlers("rest"),

  // http.get("/products", () => {
  //   return HttpResponse.json([
  //     {
  //       id: 1,
  //       name: "Electronics",
  //     },
  //     {
  //       id: 2,
  //       name: "Beauty",
  //     },
  //     {
  //       id: 3,
  //       name: "Gardening",
  //     },
  //   ]);
  // }),
  // http.get("/products/:id", ({ params }) => {
  //   // All request path params are provided in the "params"
  //   // argument of the response resolver.
  //   const { id } = params;
  //   const product = products.find((p) => p.id === Number(id));
  //   if (!product) return HttpResponse.json(null, { status: 404 });
  //   return HttpResponse.json(product);
  // }),
];
