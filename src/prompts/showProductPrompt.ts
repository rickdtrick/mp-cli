import chalk from 'chalk';
import { rawlist } from '@inquirer/prompts';
import initialPrompt from './initialPrompt';
import Product, { ProductType } from '../models/product';
import Table from 'cli-table';

const showProductPrompt = async () => {
  const products: ProductType[] = Product.all();

  let choices: { name: string; value: string }[] = products.map((product) => ({
    name: product.name,
    value: product.uuid.toString(),
  }));
  choices.push({ name: 'I changed my mind (Go Back)', value: 'back' });

  const promptAnswer: string = await rawlist({
    message: chalk.green('Which product details do you want to view?'),
    choices,
  });

  if (promptAnswer === 'back') initialPrompt();
  else {
    const product = Product.find(+promptAnswer);

    if (!product) {
      console.error(chalk.red('Product not found.'));
      initialPrompt();
    } else {
      const table = new Table();
      table.push(
        [chalk.bold.blue('Product'), chalk.bold.blue('Price')],
        [product.name, product.price]
      );

      console.log(table.toString());
      initialPrompt();
    }
  }
};

export default showProductPrompt;
