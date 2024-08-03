import figlet from 'figlet';
import chalk from 'chalk';
import { rawlist } from '@inquirer/prompts';
import Product, { ProductType } from '../models/product';
import Table from 'cli-table';

enum PromptAnswer {
  ListProducts = 'listProducts',
  ShowProduct = 'showProduct',
  AddToCart = 'addToCart',
  Checkout = 'checkout',
  Exit = 'exit',
}

const initialPrompt = async () => {
  const promptAnswer: PromptAnswer = await rawlist({
    message: chalk.green('How can we help?'),
    choices: [
      { name: 'Show list of products', value: PromptAnswer.ListProducts },
      { name: 'Show product details', value: PromptAnswer.ShowProduct },
      { name: 'Add products to shopping cart', value: PromptAnswer.AddToCart },
      { name: 'Checkout shopping cart', value: PromptAnswer.Checkout },
      { name: 'Exit', value: PromptAnswer.Exit },
    ],
  });

  switch(promptAnswer) {
    case PromptAnswer.ListProducts:
      const table = new Table();
      const products: ProductType[] = Product.all();

      table.push([
        chalk.bold.blue('Product'),
        chalk.bold.blue('Price')
      ]);

      for (const product of products) {
        table.push([product.name, product.price]);
      }
      console.log(table.toString());
      initialPrompt();
      break;

    case PromptAnswer.Exit:
      console.log(chalk.red(figlet.textSync('Bye!')));
      break;

    default:
      console.log('Coming Soon');
      initialPrompt();
      break;
  }
}

export default initialPrompt;