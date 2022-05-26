export const movementConfig = {
  mass: 1,
  tension: 600,
  friction: 30
}

export const toastAnimation = {
  from: { opacity: 0, transform: 'scale(0.95)' },
  enter: { opacity: 1, transform: 'scale(1)' },
  leave: { opacity: 0, transform: 'scale(0.95)' },
  config: movementConfig
}