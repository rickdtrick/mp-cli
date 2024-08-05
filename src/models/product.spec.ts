import { readFileSync } from 'fs';
import path from 'path';
import Product from './product';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

const filePath = path.join(__dirname, '../data/products.json');

describe('Product', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProducts = [
    { uuid: 1, name: 'Product 1', price: '10.00' },
    { uuid: 2, name: 'Product 2', price: '20.00' },
    { uuid: 3, name: 'Product 3', price: '30.00' },
  ];

  describe('all', () => {
    it('should return all products', () => {
      (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));
      
      const result = Product.all();
      
      expect(result).toEqual(mockProducts);
      expect(readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

  });

  describe('find', () => {
    it('should return the product with the given uuid', () => {
      (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));
      
      const result = Product.find(2);
      
      expect(result).toEqual(mockProducts[1]);
    });

    it('should return undefined if the product is not found', () => {
      (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));
      
      const result = Product.find(99);
      
      expect(result).toBeUndefined();
    });

  })
});
