// regex for valid lobby code
const isCode = /^\d{4}$/

/**
 * extract the lobby code from the url
 * @returns the lobby code
 */
function getLobbyCodeFromUrl(): string | undefined {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('join')

  if (code && isCode.test(code)) {
    return code
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