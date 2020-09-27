import { mapIt } from './map-it';

describe('mapIt', () => {
  it('converts elements', () => {

    const elements = [11, 22, 33];

    expect([...mapIt(elements, element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
  });
});
