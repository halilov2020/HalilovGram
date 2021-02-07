import { SortType } from "../constants/sort-type.enum";

export class Filters{
    constructor(
        public page:number,
        public size:number,
        public sortType:SortType
    ){}
}