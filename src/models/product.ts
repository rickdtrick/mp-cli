import productsData from './products.json';

export type ProductType = (typeof productsData)[0];

class Product {
  static all = (): ProductType[] => productsData;
  static find = (uuid: number): ProductType | undefined =>
    this.all().find((product) => product.uuid === uuid);
}

export default Product;
