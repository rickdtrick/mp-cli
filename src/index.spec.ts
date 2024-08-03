import { showProducts } from './index';

describe("showProducts", () => {
  it("show return a list of products", () => {
    expect(showProducts()).toEqual ([1,2,3])
  })
})