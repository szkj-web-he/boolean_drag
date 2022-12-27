import "./font.scss";
import "./style.scss";

import React, { useEffect, useRef, useState } from "react";
import { deepCloneData, OptionProps } from "./unit";

import { ConfigYML, PluginComms } from "@possie-engine/dr-plugin-sdk";
import { BoxItem, DragContext } from "./dragContext";
import Parking from "./Parking";
import { ScrollComponent } from "./Scroll";
import { Warehouse } from "./warehouse";
import Header from "./header";
import Hr from "./hr";

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        question?: string;
        instruction?: string;
        options?: Array<OptionProps>;
        optionsInstruction?: string;
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};
const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    /**
     * 可供选择的选项
     * 菜单
     */
    const [list, setList] = useState(() => {
        return deepCloneData(comms.config.options) ?? [];
    });

    /**
     * 已被选择的选项
     */
    const [selectList, setSelectList] = useState<Array<OptionProps>>();

    const boxesRef = useRef<Array<BoxItem>>([]);

    const selectDataRef = useRef<{
        to?: string;
        from?: string;
        value: OptionProps;
    }>();

    const [activeId, setActiveId] = useState<string>();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const state: Record<string, "0" | "1"> = {};

        const options = comms.config.options ?? [];
        for (let i = 0; i < options.length; i++) {
            const option = options[i];

            const data = selectList?.find((item) => item.code === option.code);

            state[option.code] = data ? "1" : "0";
        }

        /**
         * 一维多选
         *
         * 传给plugin loader的数据
         */
        comms.state = state;
    }, [selectList]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const handleDragMove = (res: { data: OptionProps; to?: string; from?: string }) => {
        selectDataRef.current = {
            from: res.from,
            to: res.to,
            value: {
                code: res.data.code,
                content: res.data.content,
            },
        };
        setActiveId(res.to);
    };

    const handleDragEnd = () => {
        const data = selectDataRef.current ? deepCloneData(selectDataRef.current) : undefined;

        setActiveId(undefined);
        selectDataRef.current = undefined;

        if (data?.to == data?.from) {
            return;
        }
        //这里是添加
        if (data?.to) {
            setList((pre) => {
                const arr: typeof pre = [];
                for (let i = 0; i < pre.length; i++) {
                    const item = pre[i];
                    const usedData = selectList?.find(
                        (selectItem) => selectItem.code === item.code,
                    );
                    if (item.code !== data.value.code && !usedData) {
                        arr.push({ ...item });
                    }
                }
                return arr;
            });

            setSelectList((pre) => {
                const arr = pre ? [...pre] : [];
                arr.push({ ...data.value });
                return [...arr];
            });
        } else if (data?.value) {
            setSelectList((pre) => {
                const preArr = pre ?? [];
                const arr: OptionProps[] = [];
                for (let i = 0; i < preArr.length; i++) {
                    const item = preArr[i];

                    if (item.code !== data.value.code) {
                        arr.push({ ...item });
                    }
                }
                return arr;
            });
            setList((pre) => {
                const arr = pre ? [...pre] : [];
                arr.push({ ...data.value });
                return [...arr];
            });
        }
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className={`wrapper`}>
            <ScrollComponent
                hidden={{
                    x: true,
                }}
                bodyClassName="wrapperBody"
                className="wrapperScroll"
            >
                <Header />
                <DragContext.Provider value={{ boxes: boxesRef.current }}>
                    <Warehouse
                        list={list}
                        handleDragMove={handleDragMove}
                        handleDragEnd={handleDragEnd}
                    />
                    <Hr />

                    <Parking
                        handleDragMove={handleDragMove}
                        handleDragEnd={handleDragEnd}
                        activeId={activeId}
                        values={selectList}
                    />
                </DragContext.Provider>
            </ScrollComponent>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
