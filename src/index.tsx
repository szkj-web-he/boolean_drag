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
    const [selectList, setSelectList] = useState<OptionProps>();

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
        /**
         * 一维单选
         *
         * 传给plugin loader的数据
         */
        comms.state = selectList?.code ?? undefined;
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
            const options = deepCloneData(comms.config.options) ?? [];
            setList((pre) => {
                const arr: typeof pre = [];
                for (let i = 0; i < options.length; i++) {
                    const item = options[i];
                    if (item.code !== data.value.code) {
                        arr.push({ ...item });
                    }
                }
                return arr;
            });

            setSelectList({ ...data.value });
        } else {
            setSelectList(undefined);
            setList(deepCloneData(comms.config.options) ?? []);
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
