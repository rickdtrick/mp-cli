import chalk from 'chalk';
import { rawlist } from '@inquirer/prompts';
import initialPrompt from './initialPrompt';
import Product from '../models/product';
import Table from 'cli-table';
import showProductPrompt from './showProductPrompt';

jest.mock('@inquirer/prompts');
jest.mock('cli-table');
jest.mock('./initialPrompt');

describe('showProductPrompt', () => {
  const mockProducts = [
    { uuid: 1, name: 'Product 1', price: '10.00' },
    { uuid: 2, name: 'Product 2', price: '20.00' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the product list and call initialPrompt when "back" is selected', async () => {
    jest.spyOn(Product, 'all').mockReturnValue(mockProducts);
    (rawlist as jest.Mock).mockResolvedValue('back');

    await showProductPrompt();

    expect(rawlist).toHaveBeenCalledWith({
      message: expect.any(String),
      choices: expect.arrayContaining([
        { name: 'Product 1', value: '1' },
        { name: 'Product 2', value: '2' },
        { name: 'I changed my mind (Go Back)', value: 'back' },
      ]),
    });
    expect(initialPrompt).toHaveBeenCalled();
  });

  it('should display product details and call initialPrompt when a valid product is selected', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(Product, 'all').mockReturnValue(mockProducts);
    jest.spyOn(Product, 'find').mockReturnValue(mockProducts[0]);
    (rawlist as jest.Mock).mockResolvedValue('1');
    const mockTablePush = jest.fn();
    const mockTableToString = jest.fn().mockReturnValue('Mocked Table');
    (Table as unknown as jest.Mock).mockImplementation(() => ({
      push: mockTablePush,
      toString: mockTableToString,
    }));

    await showProductPrompt();

    expect(Product.find).toHaveBeenCalledWith(1);
    expect(mockTablePush).toHaveBeenCalledWith(
      [chalk.bold.blue('Product'), chalk.bold.blue('Price')],
      ['Product 1', '10.00']
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('Mocked Table');
    expect(initialPrompt).toHaveBeenCalled();
  });

  it('should display an error message when the product is not found', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(Product, 'all').mockReturnValue(mockProducts);
    jest.spyOn(Product, 'find').mockReturnValue(undefined);
    (rawlist as jest.Mock).mockResolvedValue('3');

    await showProductPrompt();

    expect(Product.find).toHaveBeenCalledWith(3);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      chalk.red('Product not found.')
    );
    expect(initialPrompt).toHaveBeenCalled();
  });
});
