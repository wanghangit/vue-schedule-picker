

function generateArray<T>(length: number, strategy: (i: number) => T) {
    return Array.from({ length }, (_, i) => strategy(i));
}

export function generateIncrementalArray(length: number) {
    return generateArray<number>(length, (i) => i);
}

export function generateSelectedTime() {
    return generateArray<ITime>(7, () => ({ forenoon: 0, afternoon: 0 }))
}

export function isValidateClick(range: IRange, position: IPosition) {
    const { x, y } = position;
    const { lt, rb } = range;
    const { x: minX, y: minY } = lt;
    const { x: maxX, y: maxY } = rb;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

export function getStartIndexFromPosition(range: IRange, position: IPosition, item: ITdItem): ISelectedItem | null {
    console.log(position);
    // 非法点击直接返回null
    if (!isValidateClick(range, position)) {
        return null;
    }
    const { width, height } = item;
    const { x, y } = position;
    const { lt } = range;
    const { x: minX, y: minY } = lt;
    const spaceX = x - minX;
    const spaceY = y - minY;
    console.log('space:', spaceX, spaceY, 'position', x, y);
    return {
        dIndex: normalizeIndex(spaceY / height),
        hIndex: normalizeIndex(spaceX / width)
    }
}

export function getEndIndexFromPosition(range: IRange, position: IPosition, item: ITdItem): ISelectedItem {
    const { width, height } = item;
    const { x, y } = position;
    const { lt, rb } = range;
    const { x: minX, y: minY } = lt;
    const { x: maxX, y: maxY } = rb;
    const spaceX = x - minX;
    const spaceY = y - minY;
    let dIndex = normalizeIndex(spaceY / height);
    let hIndex = normalizeIndex(spaceX / width);
    if (!isValidateClick(range, position)) {
        if (x > maxX) {
            hIndex = 47;
        } else if (x < minX) {
            hIndex = 0;
        }
        if (y > maxY) {
            dIndex = 6;
        } else if (y < minY) {
            dIndex = 0;
        }
    }
    return {
        dIndex,
        hIndex
    }
}

export function normalizeIndex(num: number) {
    return Math.ceil(num) - 1;
}