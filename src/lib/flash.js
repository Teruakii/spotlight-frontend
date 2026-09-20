let message = null;

export function setFlash(next) {
  message = next;
}

export function takeFlash() {
  const current = message;
  message = null;
  return current;
}
