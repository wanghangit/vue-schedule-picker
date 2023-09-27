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
    return {
        dIndex: normalizeIndex(spaceY / height),
        hIndex: normalizeIndex(spaceX / width)
    }
}

export function getEndIndexFromPosition(range: IRange, position: IPosition, item: ITdItem): ISelectedItem {
    const { width, height, maxHIndex } = item;
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
            hIndex = maxHIndex;
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

function displayTimeRange(range: Array<number>, unit: number): string {
    const [start, end] = range
    const startTime = start * unit;
    const endTime = (end+1) * unit;
    function format(time: number) {
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        return `${hour === 0 ? '00' : hour < 10 ? `0${hour}` : hour }:${minute===0 ? '00' : minute}`;
    }
    return `${format(startTime)}~${format(endTime)}`

}

export function generatePreviewTime(selectedTime: Array<boolean>, unit: number): Array<string> {
    const result: Array<Array<number>> = [];
    const range: Array<number> = []; // 表示选中的区间
    function collect() {
        result.push([...range]);
        range.length = 0;
    }
    selectedTime.forEach((isSelected, index) => {
        if (isSelected) {
            // 长度为0推入开始和结束一样的时间
            if (range.length === 0) {
                range.push(index, index);
            }
            else {
                range[1] = index;
            }
        }
        // 没有选中并且rang长度为0说明前面存在连续时间段
        else if (range.length > 0) {
            collect();
        }
    });
    if(range.length > 0){
        collect();
    }
    return result.map((item) => displayTimeRange(item, unit));
}