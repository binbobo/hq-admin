import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const numberMask = createNumberMask({
    allowDecimal: true,
    decimalLimit: 1,
    integerLimit: 15,
    includeThousandsSeparator: false,
    prefix: '',
    suffix: ''
})