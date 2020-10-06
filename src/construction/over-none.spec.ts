import { pushIterated } from '../base';
import { overNone } from './over-none';

describe('overNone', () => {
  it('does not push elements', () => {

    let iterated = false;

    expect(pushIterated(overNone(), () => {
      iterated = true;
    })).toBe(false);
    expect(iterated).toBe(false);
  });
  it('does not iterate', () => {
    expect([...overNone()]).toHaveLength(0);
  });
});
