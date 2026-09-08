import "@testing-library/jest-dom/vitest"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList,
})

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = "0px"
  readonly scrollMargin = "0px"
  readonly thresholds = [0]

  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

class TestResizeObserver implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: TestIntersectionObserver,
})

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: TestResizeObserver,
})
