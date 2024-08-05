import calculateDiscount, { DiscountValue } from './calculateDiscount';

describe('calculateDiscount', () => {
  it('should return a discount rate of 0 and amount of 0 when the amount is 20 or less', () => {
    const amount = 20;
    const expected: DiscountValue = { amount: 0, rate: 0 };

    const result = calculateDiscount(amount);

    expect(result).toEqual(expected);
  });

  it('should return a discount rate of 10% and correct amount when the amount is greater than 20 but 50 or less', () => {
    const amount = 30;
    const expected: DiscountValue = { amount: 3, rate: 10 };

    const result = calculateDiscount(amount);

    expect(result).toEqual(expected);
  });

  it('should return a discount rate of 15% and correct amount when the amount is greater than 50 but 100 or less', () => {
    const amount = 75;
    const expected: DiscountValue = { amount: 11.25, rate: 15 };

    const result = calculateDiscount(amount);

    expect(result).toEqual(expected);
  });

  it('should return a discount rate of 20% and correct amount when the amount is greater than 100', () => {
    const amount = 150;
    const expected: DiscountValue = { amount: 30, rate: 20 };

    const result = calculateDiscount(amount);

    expect(result).toEqual(expected);
  });
});
