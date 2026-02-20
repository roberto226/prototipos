export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function generateInviteUrl(code: string): string {
  return `https://mexaswallet.app/join/${code}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getWhatsAppShareUrl(url: string, message?: string): string {
  const text = message ? `${message} ${url}` : url
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function getSmsShareUrl(url: string, message?: string): string {
  const text = message ? `${message} ${url}` : url
  return `sms:?body=${encodeURIComponent(text)}`
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
