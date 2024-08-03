import { writeFileSync } from 'fs';
import cartItems from './cartItems.json';

export type CartItemType = {
  uuid: number;
  productId: number;
  quantity: number;
};

export type CartItemCreateType = {
  productId: number,
  quantity: number
}

class CartItem {
  static all = (): CartItemType[] => cartItems;
  static find = (uuid: number): CartItemType | undefined =>
    this.all().find((cartItem) => cartItem.uuid === uuid);
  static create = (data: CartItemCreateType): CartItemType | undefined => {
    const { productId, quantity} = data;

    const uuid = this.#generateUniqueId();
    const newCartItem: CartItemType = {
      uuid,
      productId,
      quantity
    }
    const updatedCart = [...this.all(), newCartItem]  

    try {
      writeFileSync('cartItems.json', JSON.stringify(updatedCart));

      return newCartItem;
    } catch (err) {
      console.error(err)
      return;
    }
  }

  /** Simple iterator for a unique uuid */
  static #generateUniqueId = (increment: number = 1): number => {
    const cartItems = this.all();
    let uuid = cartItems.length + increment;

    if (cartItems.find(cartItem => cartItem.uuid === uuid)) {
      return this.#generateUniqueId(increment + 1)
    }

    return uuid;
  }
}

export default CartItem;
