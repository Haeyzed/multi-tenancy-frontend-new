import { toast } from "sonner"

export function toastApiMessage(message?: string, fallback?: string) {
  const text = message?.trim() || fallback

  if (!text) {
    return
  }

  toast.success(text)
}
