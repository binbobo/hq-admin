import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const discountMask = createNumberMask({
    allowDecimal: false,
    integerLimit: 3,
    includeThousandsSeparator: false,
    prefix: '',
    suffix: ''
})