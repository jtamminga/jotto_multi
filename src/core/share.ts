var isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

export function share(lobbyCode: string): void {
  const joinUrl = `${window.location.origin}/join/${lobbyCode}`

  if (isMobile) {
    window.navigator.share({
      text: 'Join Vying Lobby',
      url: joinUrl
    })
  } else {
    window.navigator.clipboard.writeText(joinUrl)
  }
}