import { readFileSync } from 'fs';
import path from 'path';


const filePath = path.join(__dirname , '../data/products.json');
export type ProductType = {
  uuid: number;
  name: string; 
  price: string; 
};
class Product {
  static all = (): ProductType[] => {
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  static find = (uuid: number): ProductType | undefined =>
    this.all().find((product) => product.uuid === uuid);
}

export default Product;
