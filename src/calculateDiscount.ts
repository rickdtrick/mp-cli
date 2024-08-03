type DiscountValue = {
  amount: number;
  rate: number;
};

const calculateDiscount = (amount: number): DiscountValue => {
  let discountRate = 0;

  if (amount > 100) {
    discountRate = 20;
  } else if (amount > 50) {
    discountRate = 15;
  } else if (amount > 20) {
    discountRate = 10;
  }

  const discountAmount: number = (amount * discountRate) / 100;

  return {
    amount: discountAmount,
    rate: discountRate,
  };
};

export default calculateDiscount;
