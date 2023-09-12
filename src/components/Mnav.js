import React, { useState } from 'react'
import styled from 'styled-components'

const Hamburger = styled.div`
    position: fixed;
    right: 16px;
    top: 24px;
    transition: all 1s;
    z-index: 50;
    cursor: pointer;
    > div {
        width: 30px;
        height: 2px;
        background-color: #000;
        border-radius: 4px;
        margin: 6px;
        transition: all 1s;
    } // > div
    &.on div:nth-child(1) {
        transform: rotate(45deg) translateY(12px);
    }
    &.on div:nth-child(2) {
        opacity: 0; transform: translateX(-30px) rotate(720deg);
    }
    &.on div:nth-child(3) {
        transform: rotate(45deg) translateY(-12px);
    }
    @media screen and (min-width: 1024px) {
        display: none;
    }
    @media screen and (max-width: 768px) {
        right: 24px;
    }
`;

function Mnav() {
    const [isActive, setIsActive] = useState(false);
    return (
        <>
            <Hamburger className={() => isActive === true ? setIsActive = "on" : ""}>
                {
                    Array(3).fill().map((_, i) => { // 실제 데이터가 필요하지 않을 때 e 대신 _를 쓸 수 있다. react에서는 선언하면 써야하기 때문에 안 쓰는 e를 대신해서 _를 쓴다.
                        return (
                            <div key={i}></div>
                        )
                    })
                }
            </Hamburger>
        </>
    )
}

export default Mnav