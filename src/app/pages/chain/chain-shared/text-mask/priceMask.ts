import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const priceMask = createNumberMask({
    allowDecimal: true,
    decimalLimit: 1,
    integerLimit: 10,
    includeThousandsSeparator: false,
    prefix: '',
    suffix: ''
})