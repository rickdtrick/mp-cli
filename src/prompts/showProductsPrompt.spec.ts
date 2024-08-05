import { rawlist } from '@inquirer/prompts';
import chalk from 'chalk';
import Table from 'cli-table';
import Product, { ProductType } from '../models/product';
import showProductsPrompt from './showProductsPrompt';

jest.mock('@inquirer/prompts');
jest.mock('cli-table');
jest.mock('figlet', () => ({
  textSync: jest.fn().mockReturnValue('Mocked Bye!'),
}));

describe('showProductsPrompt', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list all products', async () => {
    (rawlist as jest.Mock)
      .mockResolvedValueOnce('showProducts')
      .mockResolvedValueOnce('exit');

    const mockProducts: ProductType[] = [
      { uuid: 1, name: 'Product 1', price: '100' },
      { uuid: 2, name: 'Product 2', price: '200' },
    ];
    jest.spyOn(Product, 'all').mockReturnValue(mockProducts);

    const mockTablePush = jest.fn();
    const mockTableToString = jest.fn().mockReturnValue('Mocked Table');
    (Table as unknown as jest.Mock).mockImplementation(() => ({
      push: mockTablePush,
      toString: mockTableToString,
    }));

    await showProductsPrompt();

    expect(mockTablePush).toHaveBeenCalledWith([
      chalk.bold.blue('Product'),
      chalk.bold.blue('Price'),
    ]);
    for (const product of mockProducts) {
      expect(mockTablePush).toHaveBeenCalledWith([product.name, product.price]);
    }

    expect(consoleLogSpy).toHaveBeenCalledWith('Mocked Table');
  });
});
