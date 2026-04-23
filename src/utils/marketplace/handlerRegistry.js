const handlers = new Map();

export function registerHandler(type, handler) {
  if (!handler.install || typeof handler.install !== 'function') {
    throw new Error(`Handler for type "${type}" must have an install function`);
  }
  if (!handler.uninstall || typeof handler.uninstall !== 'function') {
    throw new Error(`Handler for type "${type}" must have an uninstall function`);
  }
  handlers.set(type, handler);
}

export function getHandler(type) {
  return handlers.get(type) || null;
}

export function hasHandler(type) {
  return handlers.has(type);
}
