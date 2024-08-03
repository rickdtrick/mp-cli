import productsData from "./products.json";

export type ProductType = typeof productsData[0];

class Product {
  static all = (): ProductType[] => productsData;
}

export default Product;
