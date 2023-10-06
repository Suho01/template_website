import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeName } from '../store';
import Product from './Product';
import { useMemo } from 'react';
import Banner from '../components/home/Banner';
import Company from '../components/home/Company';
import Content from '../components/home/Content';
import Different from '../components/home/Different';
import Management from '../components/home/Management';

// const Test = () => {
//     return console.log("계속 실행됨");
// }

function Main() {
    // const result = useMemo(() => {
    //     return Test();
    // }, []);
    
    // useEffect(() => {
    //     console.log("완료");

    //     return () => {
    //         // useEffect에서 return을 쓰면 unmount되었을 때만 실행됨
    //         console.log("완료가 되기 전 실행됨");
    //     } // 컴포넌트를 벗어날 때 먼저 실행됨 
    // }, []);

    

    // let [count, setCount] = useState(0);

    return (
        <>
            <Banner />
            <Company />
            <Content />
            <Different />
            <Management />
        </>
    )
}

export default Main