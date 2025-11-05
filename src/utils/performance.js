/**
 * Performance monitoring utilities for development
 * Shows render counts and performance metrics in the console
 */

// Track component render counts
const renderCounts = {};

/**
 * Hook to track component renders
 * Usage: useRenderCounter('ComponentName')
 */
export const useRenderCounter = (componentName) => {
  if (import.meta.env.DEV) {
    if (!renderCounts[componentName]) {
      renderCounts[componentName] = 0;
    }
    renderCounts[componentName]++;

    // Log every 10 renders to avoid spam
    if (renderCounts[componentName] % 10 === 0) {
      console.log(`🔄 [${componentName}] rendered ${renderCounts[componentName]} times`);
    }
  }
};

/**
 * Get current render counts
 */
export const getRenderCounts = () => {
  return { ...renderCounts };
};

/**
 * Reset all render counters
 */
export const resetRenderCounts = () => {
  Object.keys(renderCounts).forEach((key) => {
    renderCounts[key] = 0;
  });
  console.log('📊 Render counters reset');
};

/**
 * Display performance report
 */
export const showPerformanceReport = () => {
  console.group('📊 Performance Report');
  console.table(renderCounts);
  console.groupEnd();
};

/**
 * Measure execution time of a function
 * Usage: measureTime('operation name', () => yourFunction())
 */
export const measureTime = (label, fn) => {
  if (import.meta.env.DEV) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const time = (end - start).toFixed(2);

    console.log(`⏱️ [${label}] took ${time}ms`);

    return result;
  }
  return fn();
};

/**
 * Hook to measure component mount and update times
 */
export const usePerformanceMonitor = (componentName) => {
  if (import.meta.env.DEV) {
    const mountTime = performance.now();

    // Log mount time
    console.log(`🚀 [${componentName}] mounted at ${mountTime.toFixed(2)}ms`);

    // Track renders
    useRenderCounter(componentName);

    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime;
      console.log(`💀 [${componentName}] unmounted after ${lifetime.toFixed(2)}ms`);
    };
  }
  return () => {};
};

// Expose utilities to window for easy access in console
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.__muePerf = {
    getRenderCounts,
    resetRenderCounts,
    showPerformanceReport,
  };

  console.log(
    '%c🚀 Mue Performance Tools Available!',
    'color: #4CAF50; font-size: 14px; font-weight: bold;'
  );
  console.log('Use window.__muePerf.showPerformanceReport() to see render counts');
  console.log('Use window.__muePerf.resetRenderCounts() to reset counters');
}
