export const WINDOWS = navigator.userAgent.includes('Windows')
export const MAC = navigator.userAgent.includes('Mac')
export const LINUX = navigator.userAgent.includes('Linux')

export const DESKTOP = WINDOWS || MAC || LINUX