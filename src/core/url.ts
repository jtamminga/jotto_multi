// regex for valid lobby code
const isCode = /^\d{4}$/

/**
 * extract the lobby code from the url
 * @returns the lobby code
 */
function getLobbyCodeFromUrl(): string | undefined {
  const segments = window.location.pathname
    .split('/')
    .filter(p => p !== '')

  if (
    segments.length === 2
    && segments[0] === 'join'
    && isCode.test(segments[1])
  ) {
    return segments[1]
  }
}

/**
 * if there is a join url then run action
 * @param action the action to run if there is a join url
 */
export function onLobbyRedirect(action: (code: string) => void): void {
  const code = getLobbyCodeFromUrl()
  if (code) {
    action(code)
    window.history.replaceState(null, '', '/')
  }
}