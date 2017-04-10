export class BasicModel {
    constructor(
        public id?: string,
        public enabled?: boolean,
        public description?: string,
        public displayOrder?: number,
        public updatedOnUtc?: Date,
        public createdOnUtc?: Date,
    ) { }
}