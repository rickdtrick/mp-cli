import chalk from 'chalk';
import { rawlist } from '@inquirer/prompts';
import initialPrompt from './initialPrompt';
import Product, { ProductType } from '../models/product';
import Table from 'cli-table';

const addToCartPrompt = async () => {
  const products: ProductType[] = Product.all();

  let choices: { name: string; value: string }[] = products.map(product => ({ name: product.name, value: product.uuid.toString() }))
  choices.push({name: 'I changed my mind (Go Back)', value: 'back' })

  const promptAnswer: string = await rawlist({message: chalk.green('which product do you want to add?'), choices });

  if (promptAnswer === 'back') initialPrompt();
  else {
    const product = Product.find(+promptAnswer);

    if (!product) {
      console.error(chalk.red('Product not found.'));
    } else {
      const table = new Table();
      table.push(
        [
          chalk.bold.blue('Product'),
          chalk.bold.blue('Price')
        ],
        [product.name, product.price]
      );

      console.log(table.toString())
      initialPrompt();
    }
  }
}

export default addToCartPrompt;