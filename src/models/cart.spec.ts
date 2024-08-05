import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import CartItem from './cart';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

const filePath = path.join(__dirname, '../data/cartItems.json');

describe('CartItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCartItems = [
    { uuid: 1, productUuid: 101, quantity: 2 },
    { uuid: 2, productUuid: 102, quantity: 3 },
    { uuid: 3, productUuid: 101, quantity: 1 },
  ];

  describe('all', () => {
    it('should return all cart items', () => {
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCartItems)
      );

      const result = CartItem.all();

      expect(result).toEqual(mockCartItems);
      expect(readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });
  });

  describe('find', () => {
    it(' should return the cart item with the given uuid', () => {
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCartItems)
      );

      const result = CartItem.find(2);

      expect(result).toEqual(mockCartItems[1]);
    });

    it('should return undefined if the cart item is not found', () => {
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCartItems)
      );

      const result = CartItem.find(99);

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new cart item and return it', () => {
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCartItems)
      );
      (writeFileSync as jest.Mock).mockImplementation(() => {});

      const newCartItemData = { productUuid: 103, quantity: 5 };
      const newCartItem = CartItem.create(newCartItemData);

      expect(newCartItem).toEqual({ uuid: 4, productUuid: 103, quantity: 5 });
      expect(writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify([...mockCartItems, newCartItem])
      );
    });

    it('should handle write errors gracefully', () => {
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCartItems)
      );
      (writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write error');
      });

      const newCartItemData = { productUuid: 103, quantity: 5 };
      const newCartItem = CartItem.create(newCartItemData);

      expect(newCartItem).toBeUndefined();
    });
  });

  describe('totalQty', () => {
    it('should return the total quantity for a given productUuid', () => {
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCartItems)
      );

      const result = CartItem.totalQty(101);

      expect(result).toBe(3);
    });

    it('totalQty() should return 0 if there are no items with the given productUuid', () => {
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCartItems)
      );

      const result = CartItem.totalQty(999);

      expect(result).toBe(0);
    });
  });
});
