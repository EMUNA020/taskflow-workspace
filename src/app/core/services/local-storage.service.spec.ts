import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('returns the fallback when the key is missing', () => {
    expect(service.get('missing-key', 'fallback')).toBe('fallback');
  });

  it('round-trips a stored value', () => {
    const value = { a: 1, b: ['x', 'y'] };
    service.set('key', value);
    expect(service.get('key', {} as typeof value)).toEqual(value);
  });

  it('returns the fallback when stored JSON is corrupted', () => {
    localStorage.setItem('key', '{not-json');
    expect(service.get('key', 'fallback')).toBe('fallback');
  });
});
