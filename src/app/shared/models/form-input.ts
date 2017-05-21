export class SelectOption {
    constructor(
        public text: string,
        public value: string,
        public checked?: boolean
    ) {
    }
}

export class SelectOptionGroup {
    public label: string;
    public options: Array<SelectOption>;

    constructor(label: string, options: Array<SelectOption>) {
        this.label = label;
        this.options = options;
    }
}