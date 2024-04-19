import { faker } from "@faker-js/faker";
import { factory, primaryKey } from "@mswjs/data";

// it is an in memory db so ude it wisely
export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
  },
  categories: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
  },
});
