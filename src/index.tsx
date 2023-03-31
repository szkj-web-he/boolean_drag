import "./font.scss";
import "./style.scss";

import React, { useEffect, useRef, useState } from "react";
import { deepCloneData, getState, OptionProps } from "./unit";

import { ConfigYML, PluginComms } from "@datareachable/dr-plugin-sdk";
import { BoxItem, DragContext } from "./dragContext";
import Parking from "./Parking";
import { ScrollComponent } from "./Scroll";
import { Warehouse } from "./warehouse";
import Header from "./header";

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        question?: string;
        instruction?: string;
        options?: Array<Array<OptionProps>>;
        optionsInstruction?: string;
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};
const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    /**
     * 已被选择的选项
     */
    const [selectList, setSelectList] = useState(() => {
        return getState();
    });

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
         * 二维多选
         *
         * 传给plugin loader的数据
         */
        const rows = comms.config.options?.[0] ?? [];
        const cols = comms.config.options?.[1] ?? [];

        const data: Record<string, Record<string, "0" | "1">> = {};
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowData: Record<string, "0" | "1"> = {};
            for (let j = 0; j < cols.length; j++) {
                const col = cols[j];

                rowData[col.code] = selectList[row.code].find((item) => item.code === col.code)
                    ? "1"
                    : "0";
            }

            data[row.code] = rowData;
        }

        comms.state = data;
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

        setSelectList((pre) => {
            const selectData = { ...pre };

            if (data?.from) {
                const fromArr: Array<OptionProps> = [];
                for (let i = 0; i < selectData[data.from].length; i++) {
                    const item = selectData[data.from][i];
                    if (item.code !== data.value.code) {
                        fromArr.push({ ...item });
                    }
                }
                selectData[data.from] = [...fromArr];
            }

            if (data?.to) {
                const toArr = [...selectData[data.to]];
                if (!toArr.find((item) => item.code === data.value.code)) {
                    selectData[data.to].push({ ...data.value });
                }
            }

            return { ...selectData };
        });
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
                    <Warehouse handleDragMove={handleDragMove} handleDragEnd={handleDragEnd} />
                    <div className="hr" />
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
