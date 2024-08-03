import initialPrompt from './initialPrompt';
import chalk from 'chalk';
import Table from 'cli-table';
import Product, { ProductType } from '../models/product';
import CartItem, { CartItemType } from '../models/cart';
import calculateDiscount from '../calculateDiscount';

type CheckoutItems = {
  [key: number]: {
    quantity: number;
  };
};

const checkoutPrompt = () => {
  const table = new Table();
  const cartItems: CartItemType[] = CartItem.all();
  table.push([
    chalk.bold.blue('Product'),
    chalk.bold.blue('Quantity'),
    chalk.bold.blue('Price'),
    chalk.bold.blue('Amount'),
  ]);

  const checkoutItems = cartItems.reduce((acc, cartItem) => {
    const { productUuid, quantity } = cartItem;
    if (acc[productUuid]) {
      acc[productUuid].quantity += quantity;
    } else {
      acc[productUuid] = { quantity };
    }
    return acc;
  }, {} as CheckoutItems);

  let checkoutAmount: number = 0;
  Object.keys(checkoutItems).map((productUuid) => {
    const product: ProductType | undefined = Product.find(+productUuid);

    if (product) {
      const totalQty: number = CartItem.totalQty(product.uuid);
      const subTotalAmount: number = totalQty * parseFloat(product.price);
      checkoutAmount = checkoutAmount + subTotalAmount;

      table.push([
        product.name,
        totalQty.toString(),
        product.price,
        subTotalAmount.toFixed(2).toString(),
      ]);
    }
  });

  const discount = calculateDiscount(checkoutAmount);
  const totalAmount = (checkoutAmount - discount.amount).toFixed(2);
  table.push(['', 'Discount', `${discount.rate}%`, discount.amount.toFixed(2)]);
  table.push(['', '', 'Total Amount', totalAmount.toString()]);
  console.log(table.toString());
  initialPrompt();
};

export default checkoutPrompt;
