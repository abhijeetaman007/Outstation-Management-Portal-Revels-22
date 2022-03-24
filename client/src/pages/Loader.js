import React from "react";

import Lottie from 'lottie-react';
import loader from "../assets/loader.json";

const Loader = () => {
    return (
        <div style={{width : "100px" , height: "100px" , margin : "0 auto" }}>
            
                <Lottie animationData={loader} autoPlay={true} loop={true} />
            
        </div>
    );
}

export default Loader;