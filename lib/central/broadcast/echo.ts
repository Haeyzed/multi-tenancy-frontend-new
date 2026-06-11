import Echo from "laravel-echo"
import Pusher from "pusher-js"

import type { BroadcastConfig } from "@/types/central/broadcast"

type EchoInstance = Echo<"reverb">

let echoInstance: EchoInstance | null = null

export function getEchoInstance(): EchoInstance | null {
  return echoInstance
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}

export function connectEcho(config: BroadcastConfig, token: string): EchoInstance {
  disconnectEcho()

  window.Pusher = Pusher

  const useTls = config.scheme === "https"

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: config.key,
    wsHost: config.host,
    wsPort: config.port,
    wssPort: config.port,
    forceTLS: useTls,
    enabledTransports: ["ws", "wss"],
    authEndpoint: config.auth_endpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  })

  return echoInstance
}

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo?: EchoInstance
  }
}
