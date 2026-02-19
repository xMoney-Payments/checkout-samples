import type { PizzaItem } from "./types";
import type { SavedCardData } from "./types";

export const DELIVERY_THRESHOLD = 30;
export const DELIVERY_FEE = 3.99;

export const PIZZA_MENU: PizzaItem[] = [
  {
    id: 1,
    name: "Margherita",
    description: "Tomato sauce, fresh mozzarella, basil",
    price: 12.99,
    image: "🍕",
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Tomato sauce, mozzarella, pepperoni",
    price: 14.99,
    image: "🍕",
  },
  {
    id: 3,
    name: "Quattro Formaggi",
    description: "Mozzarella, gorgonzola, parmesan, fontina",
    price: 16.99,
    image: "🧀",
  },
];
