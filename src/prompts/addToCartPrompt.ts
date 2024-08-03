import { number, rawlist } from '@inquirer/prompts';
import chalk from 'chalk';
import CartItem, { CartItemCreateType } from '../models/cart';
import Product, { ProductType } from '../models/product';
import initialPrompt from './initialPrompt';

const addToCartPrompt = async () => {
  const products: ProductType[] = Product.all();

  let choices: { name: string; value: string }[] = products.map((product) => ({
    name: product.name,
    value: product.uuid.toString(),
  }));
  choices.push({ name: 'I changed my mind (Go Back)', value: 'back' });

  const promptAnswer: string = await rawlist({
    message: chalk.green('Which product do you want to add?'),
    choices,
  });

  if (promptAnswer === 'back') initialPrompt();
  else {
    const product = Product.find(+promptAnswer);

    if (!product) {
      console.error(chalk.red('Product not found.'));
    } else {
      const quantity: number | undefined = await number({
        message: `How many ${product.name} do you want?`,
      });
      if (quantity) {
        const data: CartItemCreateType = {
          productUuid: product.uuid,
          quantity,
        };
        const cartItem = CartItem.create(data);
        if (cartItem) {
          console.log(chalk.green('Product added to cart!'));
        } else {
          console.log(chalk.red('Failed to add product'));
        }
        initialPrompt();
      }
    }
  }
};

export default addToCartPrompt;
