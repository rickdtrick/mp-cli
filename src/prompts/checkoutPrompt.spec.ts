import chalk from 'chalk';
import Table from 'cli-table';
import Product from '../models/product';
import CartItem from '../models/cart';
import calculateDiscount from '../calculateDiscount';
import initialPrompt from './initialPrompt';
import checkoutPrompt from './checkoutPrompt';

jest.mock('../models/product');
jest.mock('../models/cart');
jest.mock('../calculateDiscount');
jest.mock('./initialPrompt');
jest.mock('cli-table');

describe('checkoutPrompt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the correct checkout table with products, quantities, prices, and totals', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockProducts = [
      { uuid: 1, name: 'Product 1', price: '10.00' },
      { uuid: 2, name: 'Product 2', price: '20.00' },
    ];

    const mockCartItems = [
      { uuid: 1, productUuid: 1, quantity: 2 },
      { uuid: 2, productUuid: 2, quantity: 1 },
    ];

    const mockDiscount = { amount: 6, rate: 10 }; // Mock discount
    const expectedTotalAmount = '34.00'; // Total after discount
    const mockTablePush = jest.fn();
    const mockTableToString = jest.fn().mockReturnValue('Mocked Table');
    (Table as unknown as jest.Mock).mockImplementation(() => ({
      push: mockTablePush,
      toString: mockTableToString,
    }));

    jest
      .spyOn(Product, 'find')
      .mockImplementation((uuid) =>
        mockProducts.find((product) => product.uuid === uuid)
      );
    jest.spyOn(CartItem, 'all').mockReturnValue(mockCartItems);
    jest.spyOn(CartItem, 'totalQty').mockImplementation((uuid) => {
      return mockCartItems
        .filter((item) => item.productUuid === uuid)
        .reduce((sum, item) => sum + item.quantity, 0);
    });
    (calculateDiscount as jest.Mock).mockReturnValue(mockDiscount);

    checkoutPrompt();

    const expectedTableRows = [
      [
        chalk.bold.blue('Product'),
        chalk.bold.blue('Quantity'),
        chalk.bold.blue('Price'),
        chalk.bold.blue('Amount'),
      ],
      ['Product 1', '2', '10.00', '20.00'],
      ['Product 2', '1', '20.00', '20.00'],
      ['', 'Discount', `${mockDiscount.rate}%`, mockDiscount.amount.toFixed(2)],
      ['', '', 'Total Amount', expectedTotalAmount],
    ];

    expect(mockTablePush).toHaveBeenCalledTimes(5);
    expect(mockTablePush).toHaveBeenNthCalledWith(1, expectedTableRows[0]);
    expect(mockTablePush).toHaveBeenNthCalledWith(2, expectedTableRows[1]);
    expect(mockTablePush).toHaveBeenNthCalledWith(3, expectedTableRows[2]);
    expect(mockTablePush).toHaveBeenNthCalledWith(4, expectedTableRows[3]);
    expect(mockTablePush).toHaveBeenNthCalledWith(5, expectedTableRows[4]);

    expect(consoleLogSpy).toHaveBeenCalled();
    expect(initialPrompt).toHaveBeenCalled();
  });
});
