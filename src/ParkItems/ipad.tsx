/**
 * @file
 * @date 2022-12-20
 * @author xuejie.he
 * @lastModify xuejie.he 2022-12-20
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useMemo, useRef } from "react";
import { comms } from "../";
import ParkContainer from "../parkContainer";
import { OptionProps } from "./../unit";
import { useEffect } from "react";
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

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

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
         * 偏移值
         */
        let translateX = 0;

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
                typeof pointParams.y === "number" &&
                Math.abs(pageY - pointParams.y) > Math.abs(pageX - pointParams.x)
            ) {
                console.log("111");
                handleTouchCancel();
                return;
            }
            pointParams.y = pageY;
            /**
             * 存速度 start
             */

            const move = pageX - pointParams.startX;

            const nowTime = Date.now();
            const time = nowTime - pointParams.startTime;
            const speed = move / time;

            pointParams.startX = pageX;
            pointParams.startTime = nowTime;

            tracks.push(speed);

            /**
             * 存速度 end
             */

            const moveVal = pageX - pointParams.x;
            pointParams.x = pageX;
            if (moveVal > 0) {
                console.log("向左");
                //向左
                if (run === "toRight") {
                    tracks = [];
                }
                run = "toLeft";
            } else if (moveVal < 0) {
                console.log("向右");
                //向右
                if (run === "toLeft") {
                    tracks = [];
                }
                run = "toRight";
            } else {
                console.log("没动");
                tracks = [];
                run = undefined;
            }

            if (!el) {
                return;
            }
            translateX += moveVal;
            el.style.transform = `translateX(${translateX}px)`;
        };
        /**
         * end事件
         */
        const handleTouchEnd = (e: TouchEvent) => {
            rest();
        };
        /**
         * 取消事件
         */
        const handleTouchCancel = () => {
            rest();
        };

        /**
         * touch start事件
         */
        const handleTouchStart = (e: TouchEvent) => {
            if (!e.cancelable) {
                return;
            }

            const touchData = e.changedTouches[0];

            pointParams = {
                x: touchData.pageX,
                y: touchData.pageY,
                startTime: Date.now(),
                startX: touchData.pageX,
            };

            tracks = [];

            document.addEventListener("touchmove", handleTouchMove, options);
            document.addEventListener("touchend", handleTouchEnd, options);
            document.addEventListener("touchcancel", handleTouchCancel, options);
        };

        el?.addEventListener("touchstart", handleTouchStart, options);
        return () => {
            el?.removeEventListener("touchstart", handleTouchStart, options);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="ipadWrap">
            <div className="ipad_view">
                <div className="ipad_gallery" ref={ref}>
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
            <div className="ipad_dianWrap">
                {groups.map((_, index) => {
                    return <div key={index} className="ipad_dian" />;
                })}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
