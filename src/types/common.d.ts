interface ITime {
    forenoon: number;
    afternoon: number;
}

interface IPosition {
    x: number;
    y: number;
}

interface IRange {
    lt: IPosition;
    lb: IPosition;
    rt: IPosition;
    rb: IPosition;
}

interface ITdItem{
    width: number;
    height: number;
    maxHIndex: number;
}

interface ISelectedItem {
    dIndex: number;
    hIndex: number;
}