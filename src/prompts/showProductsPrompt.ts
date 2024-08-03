import chalk from 'chalk';
import initialPrompt from './initialPrompt';
import Product, { ProductType } from '../models/product';
import Table from 'cli-table';

const showProductsPrompt = async () => {
  const table = new Table();
  const products: ProductType[] = Product.all();

  table.push([chalk.bold.blue('Product'), chalk.bold.blue('Price')]);
  for (const product of products) {
    table.push([product.name, product.price]);
  }
  console.log(table.toString());
  initialPrompt();
}

export default showProductsPrompt;
