import figlet from 'figlet';
import initialPrompt from './initialPrompt';
import { rawlist } from '@inquirer/prompts';
import Table from 'cli-table';
import Product, { ProductType } from '../models/product';
import chalk from 'chalk';

// Mocking dependencies
jest.mock('@inquirer/prompts');
jest.mock('cli-table');
jest.mock('figlet', () => ({
  textSync: jest.fn().mockReturnValue('Mocked Bye!'),
}));

describe('initialPrompt', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list all products when "Show all products" is selected', async () => {
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

    await initialPrompt();

    expect(mockTablePush).toHaveBeenCalledWith([
      chalk.bold.blue('Product'),
      chalk.bold.blue('Price'),
    ]);
    for (const product of mockProducts) {
      expect(mockTablePush).toHaveBeenCalledWith([product.name, product.price]);
    }

    expect(consoleLogSpy).toHaveBeenCalledWith('Mocked Table');
  });

  it('should exit when "Exit" is selected', async () => {
    (rawlist as jest.Mock).mockResolvedValueOnce('exit');

    await initialPrompt();

    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.red('Mocked Bye!'));
  });

  it('should show "Coming Soon" for unimplemented options', async () => {
    (rawlist as jest.Mock)
      .mockResolvedValueOnce('comingSoon') 
      .mockResolvedValueOnce('exit');

    await initialPrompt();

    expect(consoleLogSpy).toHaveBeenCalledWith('Coming Soon');
  });
});
