export class BasicModel {
    constructor(
        public displayOrder?: number,
        public id?: string,
        public enabled?: boolean,
        public description?: string,
        public updatedOnUtc?: Date,
        public createdOnUtc?: Date,
    ) { }
}