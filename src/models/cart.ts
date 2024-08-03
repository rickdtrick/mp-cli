import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export type CartItemType = {
  uuid: number;
  productUuid: number;
  quantity: number;
};

export type CartItemCreateType = {
  productUuid: number,
  quantity: number
}

const filePath = path.join(__dirname , '../data/cartItems.json');
class CartItem {
  static all = (): CartItemType[] => {
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  };
  static find = (uuid: number): CartItemType | undefined =>
    this.all().find((cartItem) => cartItem.uuid === uuid);
  static create = (data: CartItemCreateType): CartItemType | undefined => {
    const { productUuid, quantity} = data;

    const uuid = this.#generateUniqueId();
    const newCartItem: CartItemType = {
      uuid,
      productUuid,
      quantity
    }

    try {
      const updatedCart = [...this.all(), newCartItem];
      const record: string = JSON.stringify(updatedCart);
      writeFileSync(filePath, record);

      return newCartItem;
    } catch (err) {
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
