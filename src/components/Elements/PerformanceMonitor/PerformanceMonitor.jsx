import { useState, useEffect } from 'react';
import './PerformanceMonitor.scss';

/**
 * Performance monitor overlay - shows FPS and render stats
 * Only works in development mode
 * Toggle with Ctrl+Shift+P
 */
const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [fps, setFps] = useState(60);
  const [renderCounts, setRenderCounts] = useState({});
  const [memoryUsage, setMemoryUsage] = useState(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // Toggle with Ctrl+Shift+M (M for Monitor) or Alt+P
    const handleKeyPress = (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key === 'M') || (e.altKey && e.key === 'p')) {
        e.preventDefault(); // Prevent any browser defaults
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (!isVisible || !import.meta.env.DEV) return;

    // FPS counter
    let frameCount = 0;
    let lastTime = performance.now();

    const countFrames = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }

      if (isVisible) {
        requestAnimationFrame(countFrames);
      }
    };

    const frameId = requestAnimationFrame(countFrames);

    // Update render counts every 2 seconds
    const renderInterval = setInterval(() => {
      if (window.__muePerf) {
        setRenderCounts(window.__muePerf.getRenderCounts());
      }
    }, 2000);

    // Memory usage (if available)
    const memoryInterval = setInterval(() => {
      if (performance.memory) {
        setMemoryUsage({
          used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
          total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
          limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2),
        });
      }
    }, 2000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(renderInterval);
      clearInterval(memoryInterval);
    };
  }, [isVisible]);

  if (!import.meta.env.DEV) return null;

  const getFpsColor = () => {
    if (fps >= 55) return '#4CAF50'; // Green
    if (fps >= 30) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  const topComponents = Object.entries(renderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getMemoryColor = () => {
    if (!memoryUsage) return '#4CAF50';
    const usedMB = parseFloat(memoryUsage.used);
    if (usedMB < 50) return '#4CAF50'; // Green - good
    if (usedMB < 100) return '#FFC107'; // Yellow - okay
    return '#F44336'; // Red - high
  };

  return (
    <>
      {/* Floating toggle button */}
      {!isVisible && (
        <button
          className="perf-toggle-btn"
          onClick={() => setIsVisible(true)}
          title="Open Performance Monitor (Ctrl+Shift+M or Alt+P)"
        >
          📊
        </button>
      )}

      {/* Performance monitor panel */}
      {isVisible && (
        <div className="performance-monitor">
          <div className="perf-header">
            <span className="perf-title">⚡ Performance Monitor</span>
            <button
              className="perf-close"
              onClick={() => setIsVisible(false)}
              title="Close (Ctrl+Shift+M or Alt+P)"
            >
              ✕
            </button>
          </div>

      <div className="perf-metric">
        <span className="perf-label">FPS:</span>
        <span className="perf-value" style={{ color: getFpsColor() }}>
          {fps}
        </span>
      </div>

      {memoryUsage && (
        <div className="perf-metric">
          <span className="perf-label">Memory:</span>
          <span className="perf-value" style={{ color: getMemoryColor() }}>
            {memoryUsage.used} / {memoryUsage.total} MB
          </span>
        </div>
      )}

      {memoryUsage && parseFloat(memoryUsage.used) > 80 && (
        <div className="perf-warning">
          ⚠️ High memory usage - try closing other tabs
        </div>
      )}

      {topComponents.length > 0 && (
        <div className="perf-renders">
          <div className="perf-renders-title">Top Renders:</div>
          {topComponents.map(([name, count]) => (
            <div key={name} className="perf-render-item">
              <span className="perf-component-name">{name}</span>
              <span className="perf-render-count">{count}</span>
            </div>
          ))}
        </div>
      )}

      <div className="perf-actions">
        <button
          onClick={() => {
            if (window.__muePerf) {
              window.__muePerf.resetRenderCounts();
              setRenderCounts({});
            }
          }}
          className="perf-button"
        >
          Reset Counters
        </button>
        <button
          onClick={() => {
            if (window.__muePerf) {
              window.__muePerf.showPerformanceReport();
            }
          }}
          className="perf-button"
        >
          Show Report
        </button>
      </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;
