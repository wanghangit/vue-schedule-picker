export interface ITime {
    forenoon: number;
    afternoon: number;
}

export interface IPosition {
    x: number;
    y: number;
}

export interface IRange {
    lt: IPosition;
    lb: IPosition;
    rt: IPosition;
    rb: IPosition;
}

export interface ITdItem{
    width: number;
    height: number;
    maxHIndex: number;
}

export interface ISelectedItem {
    dIndex: number;
    hIndex: number;
}

export interface ITimeDisplay {
    name: string;
    selectedTime: Array<boolean>;
}