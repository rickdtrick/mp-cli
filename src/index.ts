import figlet from 'figlet';

console.log(figlet.textSync("MarketPlacer Code Challenge!"));
export const showProducts = (): number[] => {
  return [1,2,3];
}
showProducts().map(item => console.log('Product', item));
