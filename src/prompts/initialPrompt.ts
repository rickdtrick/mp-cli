import { rawlist } from '@inquirer/prompts';
import chalk from 'chalk';
import figlet from 'figlet';
import showProductPrompt from './showProductPrompt';
import showProductsPrompt from './showProductsPrompt';
import addToCartPrompt from './addToCartPrompt';
import checkoutPrompt from './checkoutPrompt';

enum PromptAnswer {
  ShowProducts = 'showProducts',
  ShowProduct = 'showProduct',
  AddToCart = 'addToCart',
  Checkout = 'checkout',
  Exit = 'exit',
}

const initialPrompt = async () => {
  const promptAnswer: PromptAnswer = await rawlist({
    message: chalk.green('How can we help?'),
    choices: [
      { name: 'Show all products', value: PromptAnswer.ShowProducts },
      { name: 'Show product details', value: PromptAnswer.ShowProduct },
      { name: 'Add products to shopping cart', value: PromptAnswer.AddToCart },
      { name: 'Checkout shopping cart', value: PromptAnswer.Checkout },
      { name: 'Exit', value: PromptAnswer.Exit },
    ],
  });

  switch (promptAnswer) {
    case PromptAnswer.ShowProducts:
      showProductsPrompt();
      break;

    case PromptAnswer.ShowProduct:
      showProductPrompt();
      break;

    case PromptAnswer.AddToCart:
      addToCartPrompt();
      break;

    case PromptAnswer.Exit:
      console.log(chalk.red(figlet.textSync('Bye!')));
      break;

    case PromptAnswer.Checkout:
      checkoutPrompt();
      break;

    default:
      console.log('Coming Soon');
      initialPrompt();
      break;
  }
};

export default initialPrompt;
