import chalk from 'chalk';
import { number, rawlist } from '@inquirer/prompts';
import initialPrompt from './initialPrompt';
import CartItem from '../models/cart';
import Product from '../models/product';
import addToCartPrompt from './addToCartPrompt';

jest.mock('@inquirer/prompts');
jest.mock('../models/cart');
jest.mock('../models/product');
jest.mock('./initialPrompt');

describe('addToCartPrompt', () => {
  const mockCartItem = { uuid: 1, productUuid: 1, quantity: 2 };
  const mockProduct = { uuid: 1, name: 'Product 1', price: '10.00' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call initialPrompt when "back" is selected', async () => {
    jest.spyOn(Product, 'all').mockReturnValue([mockProduct]);
    (rawlist as jest.Mock).mockResolvedValue('back');

    await addToCartPrompt();

    expect(initialPrompt).toHaveBeenCalled();
  });

  it('should display an error when the product is not found', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(Product, 'all').mockReturnValue([mockProduct]);
    jest.spyOn(Product, 'find').mockReturnValue(undefined);
    (rawlist as jest.Mock).mockResolvedValue('1');

    await addToCartPrompt();

    expect(Product.find).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red('Product not found.'));
    expect(initialPrompt).toHaveBeenCalled();
  });

  it('should add product to cart successfully', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(Product, 'all').mockReturnValue([mockProduct]);
    jest.spyOn(Product, 'find').mockReturnValue(mockProduct);
    (rawlist as jest.Mock).mockResolvedValue('1');
    (number as jest.Mock).mockResolvedValue(2); // User inputs quantity of 2
    jest.spyOn(CartItem, 'create').mockReturnValue(mockCartItem);

    await addToCartPrompt();

    expect(Product.find).toHaveBeenCalledWith(1);
    expect(number).toHaveBeenCalledWith({
      message: `How many ${mockProduct.name} do you want?`,
    });
    expect(CartItem.create).toHaveBeenCalledWith({
      productUuid: mockProduct.uuid,
      quantity: 2,
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.green('Product added to cart!'));
    expect(initialPrompt).toHaveBeenCalled();
  });

  it('should display an error message when adding product to cart fails', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(Product, 'all').mockReturnValue([mockProduct]);
    jest.spyOn(Product, 'find').mockReturnValue(mockProduct);
    (rawlist as jest.Mock).mockResolvedValue('1');
    (number as jest.Mock).mockResolvedValue(2); // User inputs quantity of 2
    jest.spyOn(CartItem, 'create').mockReturnValue(undefined);

    await addToCartPrompt();

    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.red('Failed to add product'));
    expect(initialPrompt).toHaveBeenCalled();
  });
});
