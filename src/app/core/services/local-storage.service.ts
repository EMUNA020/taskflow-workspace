import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly isBrowser = typeof window !== 'undefined' && !!window.localStorage;

  get<T>(key: string, fallback: T): T {
    if (!this.isBrowser) {
      return fallback;
    }

    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
