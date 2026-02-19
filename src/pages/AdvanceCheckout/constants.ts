import type { PizzaItem } from "./types";
import type { SavedCardData } from "./types";

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

export const SAVED_CARDS: SavedCardData[] = [
  {
    id: 140478,
    type: "visa",
    cardNumber: "411111******1111",
    expiryMonth: "12",
    expiryYear: "2028",
    nameOnCard: "John Doe",
  },
  {
    id: 140522,
    type: "mastercard",
    cardNumber: "555555******5599",
    expiryMonth: "06",
    expiryYear: "2029",
    nameOnCard: "Jane Smith",
  },
];

export const DEFAULT_SAVED_CARD_ID = 140478;
