import { comms } from ".";

export interface OptionProps {
    code: string;
    content: string;
}

export interface PointProps {
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface DragPramsProps {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
}

export interface DragMoveProps extends DragPramsProps {
    name?: string;
}

export interface PublicTempProps {
    /**
     * 拖拽move的回调
     */
    handleDragMove: (res: { data: OptionProps; to?: string; from?: string }) => void;
    /**
     * 拖拽结束
     */
    handleDragEnd: () => void;
}

/**
 * @file 深克隆一下数据
 * @date 2022-06-14
 * @author xuejie.he
 * @lastModify xuejie.he 2022-06-14
 */

export const deepCloneData = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data)) as T;
};

export interface AutoScrollProps {
    /**
     * 滚动的方向
     * 0是没有
     * 1是向下
     * -1是向上
     *
     * -2是向左
     * 2是向有
     */
    direction: 0 | 1 | -1 | 2 | -2;
    /**
     * 计时器
     */
    timer: number | null;
}

export const autoScroll = (
    clientX: number,
    clientY: number,
    scrollData: AutoScrollProps,
    delay = 500,
): void => {
    const el = document.getElementsByClassName("wrapperBody")[0];
    /**
     * 手机版的横向滚动容器
     */
    const hEl = document.getElementsByClassName("mobile_scrollBody")[0];

    if (
        el instanceof HTMLElement &&
        clientY > document.documentElement.offsetHeight - 20 &&
        el.scrollHeight > el.scrollTop + el.offsetHeight
    ) {
        //向下
        if (scrollData.direction === 1 && scrollData.timer) {
            return;
        }
        scrollData.direction = 1;
        scrollData.timer && window.clearTimeout(scrollData.timer);
        scrollData.timer = window.setTimeout(() => {
            scrollData.timer = null;
            if (el.scrollHeight > el.scrollTop + el.offsetHeight) {
                el.scrollTop = el.scrollTop + 1;
                autoScroll(clientX, clientY, scrollData, 0);
            }
        }, delay);
        return;
    }

    if (el instanceof HTMLElement && clientY < 20) {
        //向上
        if (scrollData.direction === -1 && scrollData.timer) {
            return;
        }
        scrollData.direction = -1;
        scrollData.timer && window.clearTimeout(scrollData.timer);
        scrollData.timer = window.setTimeout(() => {
            scrollData.timer = null;
            if (el.scrollTop > 0) {
                el.scrollTop = el.scrollTop - 1;
                autoScroll(clientX, clientY, scrollData, 0);
            }
        }, delay);
        return;
    }

    if (hEl instanceof HTMLElement && clientX < 50) {
        const els = document.elementsFromPoint(clientX, clientY);
        if (els.includes(hEl)) {
            //向左
            if (scrollData.direction === -2 && scrollData.timer) {
                return;
            }

            scrollData.direction = -2;
            scrollData.timer && window.clearTimeout(scrollData.timer);
            scrollData.timer = window.setTimeout(() => {
                scrollData.timer = null;
                if (hEl.scrollLeft > 0) {
                    hEl.scrollLeft = hEl.scrollLeft - 1;
                    autoScroll(clientX, clientY, scrollData, 0);
                }
            }, delay);
            return;
        }
    }
    if (
        hEl instanceof HTMLElement &&
        clientX + 50 > document.documentElement.offsetWidth &&
        hEl.scrollWidth > hEl.scrollLeft + hEl.offsetWidth
    ) {
        const els = document.elementsFromPoint(clientX, clientY);

        //向右
        if (els.includes(hEl)) {
            if (scrollData.direction === 2 && scrollData.timer) {
                return;
            }

            scrollData.direction = 2;
            scrollData.timer && window.clearTimeout(scrollData.timer);
            scrollData.timer = window.setTimeout(() => {
                scrollData.timer = null;
                if (hEl.scrollWidth > hEl.scrollLeft + hEl.offsetWidth) {
                    hEl.scrollLeft = hEl.scrollLeft + 1;
                    autoScroll(clientX, clientY, scrollData, 0);
                }
            }, delay);
            return;
        }
    }

    scrollData.direction = 0;
    scrollData.timer && window.clearTimeout(scrollData.timer);
};

export const isIpad = (): boolean => window.matchMedia("(min-width: 501px)").matches;

/**
 * 答案回溯
 */
export const getState = (): Record<string, OptionProps | null> => {
    const state = comms.state as Record<string, string>;
    const stateData: Record<string, string> = {};
    for (const key in state) {
        stateData[key.split("#")[1]] = state[key];
    }

    const rows = comms.config.options?.[0] ?? [];

    const cols = comms.config.options?.[1] ?? [];

    const data: Record<string, OptionProps | null> = {};

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const col = cols.find((item) => item.code === stateData[row.code]);

        data[row.code] = col ? deepCloneData(col) : null;
    }
    return data;
};
