export const ALL_DAY = 7; // 一周七天
export const ALL_HOURS = 24; // 一小时的时间段
export const HALF_HOURS_SLOT = 48; // 半小时的时间段
export const ONE_HOURS = 60; // 一小时60分钟

export const DISPLAY_DAY_MAP: Record<number, string> = {

}

const CN = {
    DISPLAY_DAY_MAP: {
        0: '星期一',
        1: '星期二',
        2: '星期三',
        3: '星期四',
        4: '星期五',
        5: '星期六',
        6: '星期日',
    },
    forenoon: '上午',
    afternoon: '下午',
    header: '星期/时间'
}

const EN = {
    DISPLAY_DAY_MAP: {
        0: 'Mon',
        1: 'Tues',
        2: 'Wed',
        3: 'Thur',
        4: 'Fri',
        5: 'Sat',
        6: 'Sun',
    },
    forenoon: 'forenoon',
    afternoon: 'afternoon',
    header: 'Week/Time'
}

export const getLanguageConfig = (lang: string) => {
    return lang === 'zh-cn' ? CN : EN;
}