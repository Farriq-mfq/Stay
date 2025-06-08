export const qrActions = {
    TRANSFER: 'TRANSFER',
    PRESENCE: 'PRESENCE',
    WITHDRAW: 'WITHDRAW',
    PAYMENT: 'PAYMENT'
}

export type QrAction = keyof typeof qrActions;