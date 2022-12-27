/**
 * @file
 * @date 2022-12-20
 * @author xuejie.he
 * @lastModify xuejie.he 2022-12-20
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { comms } from "../";
import ParkContainer from "../parkContainer";
import { OptionProps } from "./../unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const groups = useMemo(() => {
        const rows = comms.config.options?.[0] ?? [];

        const arr: Array<Array<OptionProps>> = [];

        let index = -1;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (i % 6) {
                arr[index].push({ ...row });
            } else {
                ++index;
                arr[index] = [{ ...row }];
            }
        }
        return arr;
    }, []);

    const ref = useRef<HTMLDivElement | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const activeIndexRef = useRef(activeIndex);

    const timer = useRef<null | number>(null);
    /**
     * 偏移值
     */
    const translateX = useRef(0);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        /**
         * 定时触发
         */
        /**
         * 第三个参数
         * 起点大于终点  => -1
         * 终点大于起点  => 1
         */
        const runTime = (v: number, end: number, moveStatus: 1 | -1) => {
            timer.current = window.setTimeout(() => {
                const el = ref.current;
                if (!el) {
                    return;
                }

                translateX.current += v;

                if (translateX.current * moveStatus > end * moveStatus) {
                    translateX.current = end;
                    el.style.transform = `translateX(${translateX.current}px)`;
                    timer.current = null;
                } else {
                    el.style.transform = `translateX(${translateX.current}px)`;
                    runTime(v, end, moveStatus);
                }
            });
        };

        /**
         *
         *
         */
        const jumpTo = (n: number) => {
            const el = ref.current;
            const parentEl = el?.parentElement;
            if (!parentEl) {
                return;
            }

            const width = parentEl.offsetWidth;
            //要到的像素值
            const val = -width * n;

            if (translateX.current === val) {
                return;
            }

            //距离
            const d = val - translateX.current;
            //总时长 ms
            const t = 60;
            const ms = Math.abs((t * d) / width);

            //速度
            const v = d / ms;

            runTime(v, val, translateX.current > val ? -1 : 1);
        };

        const fn = () => {
            if (timer.current) {
                window.clearTimeout(timer.current);
                timer.current = null;
                jumpTo(activeIndexRef.current);
            } else {
                const el = ref.current;
                if (!el) {
                    return;
                }
                const parentEl = el.parentElement;
                if (!parentEl) {
                    return;
                }

                const width = parentEl.offsetWidth;
                //要到的像素值
                const val = -width * activeIndexRef.current;
                translateX.current = val;
                el.style.transform = `translateX(${translateX.current}px)`;
            }
        };

        window.addEventListener("resize", fn);

        return () => {
            window.removeEventListener("resize", fn);
            timer.current && window.clearTimeout(timer.current);
        };
    }, []);

    useEffect(() => {
        const el = ref.current;

        /**
         * 点位信息
         */
        let pointParams: {
            x: number;
            y: number | null;
            startTime: number;
            startX: number;
        } = {
            x: 0,
            y: null,
            startTime: 0,
            startX: 0,
        };

        /**
         * 轨迹信息
         */
        let tracks: number[] = [];

        /**
         * 运动的方向
         */
        let run: "toRight" | "toLeft" | undefined = undefined;

        /**
         * 是不是第一次移动
         * 如果是第一次 要判断方向
         * 一旦有了方向 就不再做判断
         */
        let isFirstMove = false;

        let isMove = false;

        /**
         * event listen 参数
         */
        const options: AddEventListenerOptions = {
            passive: false,
            capture: true,
        };

        const rest = () => {
            tracks = [];
            run = undefined;
            pointParams = {
                x: 0,
                y: null,
                startTime: 0,
                startX: 0,
            };
            document.removeEventListener("touchmove", handleTouchMove, options);
            document.removeEventListener("touchend", handleTouchEnd, options);
            document.removeEventListener("touchcancel", handleTouchCancel, options);
        };

        /**
         * move事件
         */
        const handleTouchMove = (e: TouchEvent) => {
            const touchData = e.changedTouches[0];
            const { pageX, pageY } = touchData;

            //如果不是横行滑动
            if (
                isFirstMove &&
                typeof pointParams.y === "number" &&
                Math.abs(pageY - pointParams.y) > Math.abs(pageX - pointParams.x)
            ) {
                handleTouchCancel();
                return;
            }
            e.preventDefault();
            isFirstMove = false;
            pointParams.y = pageY;
            isMove = true;
            const moveVal = pageX - pointParams.x;
            /**
             * 存速度 start
             */

            const nowTime = Date.now();
            const time = nowTime - pointParams.startTime;
            const speed = moveVal / time;

            pointParams.startTime = nowTime;
            tracks.push(speed);

            /**
             * 存速度 end
             */

            pointParams.x = pageX;
            if (moveVal > 0) {
                //向右
                if (run === "toLeft") {
                    tracks = [];
                }
                run = "toRight";
            } else if (moveVal < 0) {
                //向左
                if (run === "toRight") {
                    tracks = [];
                }
                run = "toLeft";
            } else {
                tracks = [];
                run = undefined;
            }

            if (!el) {
                return;
            }
            translateX.current += moveVal;
            el.style.transform = `translateX(${translateX.current}px)`;
        };

        /**
         * 定时触发
         */
        /**
         * 第三个参数
         * 起点大于终点  => -1
         * 终点大于起点  => 1
         */
        const runTime = (v: number, end: number, moveStatus: 1 | -1) => {
            timer.current = window.setTimeout(() => {
                if (!el) {
                    return;
                }

                translateX.current += v;

                if (translateX.current * moveStatus > end * moveStatus) {
                    translateX.current = end;
                    el.style.transform = `translateX(${translateX.current}px)`;
                    timer.current = null;
                } else {
                    el.style.transform = `translateX(${translateX.current}px)`;
                    runTime(v, end, moveStatus);
                }
            });
        };

        /**
         *
         *
         */
        const jumpTo = (n: number) => {
            const parentEl = el?.parentElement;
            if (!parentEl) {
                return;
            }

            const width = parentEl.offsetWidth;
            //要到的像素值
            const val = -width * n;

            if (translateX.current === val) {
                return;
            }

            //距离
            const d = val - translateX.current;
            //总时长 ms
            const t = 60;
            const ms = Math.abs((t * d) / width);

            //速度
            const v = d / ms;

            runTime(v, val, translateX.current > val ? -1 : 1);
        };

        /**
         * 下一张
         */
        const toNext = (pageX: number, speedList: Array<number>) => {
            const parentEl = el?.parentElement;

            const speed = speedList.reduce((pre, next) => pre + next) / speedList.length;

            if (!parentEl) {
                return;
            }
            if (activeIndexRef.current < groups.length - 1) {
                if (pointParams.startX - pageX >= parentEl.offsetWidth / 2) {
                    /**
                     * 距离够了
                     * 去下一张
                     */
                    ++activeIndexRef.current;
                    setActiveIndex(activeIndexRef.current);
                } else if (speed < -1.1) {
                    /**
                     * 速度够了
                     */
                    ++activeIndexRef.current;
                    setActiveIndex(activeIndexRef.current);
                }
            }
            //还原到上一张
            jumpTo(activeIndexRef.current);
        };

        /**
         * 上一张
         */
        const toPre = (pageX: number, speedList: Array<number>) => {
            const parentEl = el?.parentElement;

            const speed = speedList.reduce((pre, next) => pre + next) / speedList.length;
            if (!parentEl) {
                return;
            }

            if (activeIndexRef.current > 0) {
                if (pageX - pointParams.startX >= parentEl.offsetWidth / 2) {
                    /**
                     * 距离够了
                     * 去上一张
                     */
                    --activeIndexRef.current;
                    setActiveIndex(activeIndexRef.current);
                } else if (speed > 1.1) {
                    /**
                     * 速度够了
                     */
                    --activeIndexRef.current;
                    setActiveIndex(activeIndexRef.current);
                }
            }
            //还原到上一张
            jumpTo(activeIndexRef.current);
        };

        /**
         * end事件
         */
        const handleTouchEnd = (e: TouchEvent) => {
            if (!isMove) {
                return;
            }
            const touchData = e.changedTouches[0];
            const { pageX } = touchData;

            const speedList = tracks.slice(tracks.length - 5, tracks.length);
            switch (run) {
                case "toLeft":
                    //向左滑
                    //+1
                    toNext(pageX, speedList);

                    break;
                case "toRight":
                    //向右滑
                    // -1
                    toPre(pageX, speedList);
                    break;
                default:
                    jumpTo(activeIndexRef.current);
                    break;
            }

            rest();
        };
        /**
         * 取消事件
         */
        const handleTouchCancel = () => {
            //还原到上一张
            jumpTo(activeIndexRef.current);
            rest();
        };

        /**
         * touch start事件
         */
        const handleTouchStart = (e: TouchEvent) => {
            const parentEl = el?.parentElement;
            if (!parentEl) {
                return;
            }
            if (!e.cancelable) {
                return;
            }

            isFirstMove = true;
            const touchData = e.changedTouches[0];

            pointParams = {
                x: touchData.pageX,
                y: touchData.pageY,
                startTime: Date.now(),
                startX: touchData.pageX,
            };

            tracks = [];
            if (timer.current) {
                window.clearTimeout(timer.current);
                timer.current = null;
            }

            document.addEventListener("touchmove", handleTouchMove, options);
            document.addEventListener("touchend", handleTouchEnd, options);
            document.addEventListener("touchcancel", handleTouchCancel, options);
        };

        const config: AddEventListenerOptions = { passive: false };
        el?.addEventListener("touchstart", handleTouchStart, config);
        return () => {
            el?.removeEventListener("touchstart", handleTouchStart, config);
        };
    }, [groups]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    /**
     * 定时触发
     */
    /**
     * 第三个参数
     * 起点大于终点  => -1
     * 终点大于起点  => 1
     */
    const runTime = (v: number, end: number, moveStatus: 1 | -1) => {
        timer.current = window.setTimeout(() => {
            const el = ref.current;
            if (!el) {
                return;
            }

            translateX.current += v;

            if (translateX.current * moveStatus > end * moveStatus) {
                translateX.current = end;
                el.style.transform = `translateX(${translateX.current}px)`;
                timer.current = null;
            } else {
                el.style.transform = `translateX(${translateX.current}px)`;
                runTime(v, end, moveStatus);
            }
        });
    };

    /**
     *
     *
     */
    const jumpTo = (n: number) => {
        const el = ref.current;
        const parentEl = el?.parentElement;
        if (!parentEl) {
            return;
        }

        const width = parentEl.offsetWidth;
        //要到的像素值
        const val = -width * n;

        if (translateX.current === val) {
            return;
        }

        //距离
        const d = val - translateX.current;
        //总时长 ms
        const t = 60;
        const ms = Math.abs((t * d) / width);

        //速度
        const v = d / ms;

        runTime(v, val, translateX.current > val ? -1 : 1);
    };

    /**
     * 当点被点击时
     */
    const handleClick = (index: number) => {
        timer.current && window.clearTimeout(timer.current);
        timer.current = null;

        const el = ref.current;
        const parentEl = el?.parentElement;
        if (!parentEl) {
            return;
        }

        const width = parentEl.offsetWidth;
        //要到的像素值
        const val = -width * index;

        //是否点的是当前活跃的下标
        if (index === activeIndexRef.current) {
            if (translateX.current !== val) {
                jumpTo(index);
            }
            return;
        }
        activeIndexRef.current = index;
        setActiveIndex(index);
        jumpTo(index);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="ipadWrap">
            <div className="ipad_border">
                <div className="ipad_view">
                    <div
                        className="ipad_gallery"
                        ref={ref}
                        style={{
                            transform: `translateX(${translateX.current}px)`,
                        }}
                    >
                        {groups.map((group, n) => {
                            return (
                                <div key={n} className="ipadGroup_wrap">
                                    {group.map((item) => {
                                        return (
                                            <ParkContainer
                                                key={item.code}
                                                rowData={item}
                                                className={"ipadGroup_item"}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="ipad_dianWrap">
                {groups.map((_, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                handleClick(index);
                            }}
                            className={`ipad_dian${activeIndex === index ? " active" : ""}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
