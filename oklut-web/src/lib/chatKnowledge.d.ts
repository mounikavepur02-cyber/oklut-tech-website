export const WELCOME_MESSAGE: string

export type QuickAction = {
  label: string
  value: string
}

export const QUICK_ACTIONS: QuickAction[]

export function getOpenRolesSummary(): Promise<string>

export function getChatResponse(text: string): Promise<string>
