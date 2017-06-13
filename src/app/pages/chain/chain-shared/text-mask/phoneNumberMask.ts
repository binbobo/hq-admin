import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const phoneNumberMask = createNumberMask({
    allowDecimal: false,
    integerLimit: 11,
    includeThousandsSeparator: false,
    prefix: '',
    suffix: ''
})