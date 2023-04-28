import { ConvertDbDatePipe } from './convert-db-date.pipe';

describe('ConvertDbDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertDbDatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should display date in format of DD MMM YYYY', () => {
    const pipe = new ConvertDbDatePipe();
    expect(pipe.transform('2020-12-31')).toBe('31 Dec 2020');
  });
});
