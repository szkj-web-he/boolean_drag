/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";

import runGirl from "./Image/bg_girl.png";
import bikeGirl from "./Image/bg_girl2.png";
import runBoy from "./Image/bg_boy.png";
import bikeBoy from "./Image/bg_boy2.png";
import bigTree from "./Image/bg_preTree.png";
import smallTree from "./Image/bg_preTree2.png";
import beforeGrass from "./Image/bg_pregrass.png";
import house1 from "./Image/bg_prehouse1.png";
import house2 from "./Image/bg_prehouse2.png";
import house3 from "./Image/bg_prehouse3.png";
import house4 from "./Image/bg_prehouse4.png";
import house5 from "./Image/bg_prehouse5.png";
import house6 from "./Image/bg_prehouse6.png";
import house7 from "./Image/bg_prehouse7.png";
import house8 from "./Image/bg_prehouse8.png";
import bg_preGradientTree from "./Image/bg_pregradientTree.png";

import afterGrass from "./Image/bg_aftergrass.png";

import cloudLeft from "./Image/cloub_left.png";
import cloudRight from "./Image/cloub_right.png";

/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="bg_wrapper">
            <div className="bg_cloud">
                <img src={cloudLeft} className="bg_cloudLeft" alt="" />
                <img src={cloudRight} className="bg_cloudRight" alt="" />
            </div>

            <div className="bg_afterGrass">
                <img src={afterGrass} alt="" className="bg_afterGrassIcon" />

                <img src={bigTree} alt="" className="bg_afterTree1" />
                <img src={bigTree} alt="" className="bg_afterTree2" />
                <img src={bigTree} alt="" className="bg_afterTree3" />
                <img src={bigTree} alt="" className="bg_afterTree4" />
                <img src={bigTree} alt="" className="bg_afterTree5" />

                <img src={house5} alt="" className="bg_afterHouse1" />
                <img src={house7} alt="" className="bg_afterHouse2" />
                <img src={house1} alt="" className="bg_afterHouse3" />

                <img src={bg_preGradientTree} alt="" className="bg_afterGradientTree1" />
                <img src={bg_preGradientTree} alt="" className="bg_afterGradientTree2" />
                <img src={bg_preGradientTree} alt="" className="bg_afterGradientTree3" />
            </div>

            <div className="bg_preGrass">
                <img src={beforeGrass} alt="" className="bg_beforeGrass" />
                <img src={smallTree} alt="" className="bg_smallTree" />
                <img src={bigTree} alt="" className="bg_bigTree1" />
                <img src={bigTree} alt="" className="bg_bigTree2" />
                <img src={bigTree} alt="" className="bg_bigTree3" />

                <img src={house1} alt="" className="bg_house1" />
                <img src={house2} alt="" className="bg_house2" />
                <img src={house3} alt="" className="bg_house3" />
                <img src={house4} alt="" className="bg_house4" />
                <img src={house5} alt="" className="bg_house5" />
                <img src={house6} alt="" className="bg_house6" />
                <img src={house7} alt="" className="bg_house7" />
                <img src={house8} alt="" className="bg_house8" />

                <img src={bg_preGradientTree} alt="" className="bg_gradientTree1" />
                <img src={bg_preGradientTree} alt="" className="bg_gradientTree2" />
                <img src={bg_preGradientTree} alt="" className="bg_gradientTree3" />
            </div>
            <div className="bg_way">
                <img src={bikeBoy} alt="" className="bg_bikeBoy" />
                <img src={bikeGirl} alt="" className="bg_bikeGirl" />
                <img src={runBoy} alt="" className="bg_runBoy" />
                <img src={runGirl} alt="" className="bg_runGirl" />
            </div>
            <div className="bg_sand" />
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
