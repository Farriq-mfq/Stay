export const qrActions = {
    TRANSFER: 'TRANSFER',
    PRESENCE: 'PRESENCE',
    WITHDRAW: 'WITHDRAW'
}

export type QrAction = keyof typeof qrActions;