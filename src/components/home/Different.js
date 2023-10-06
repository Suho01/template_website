import React from 'react'
import styled from 'styled-components'
import AnimateNumber from 'animated-number-react';
import { useState } from 'react';
import { useEffect } from 'react';

const Container = styled.div`
    width: 100%;
    padding-bottom: 48px;
    text-align: center;
    color: #fff;
    background: url("https://via.placeholder.com/1920x450/37f") fixed center center;
`;
const ContainerWrap = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    padding: 0 2%;
`;
const ContentTitle = styled.div`
    width: 100%;
    margin-top: 3rem;
    text-align: center;
    margin-bottom: 1.5rem;
    position: relative;
    &::after {
        content: "";
        position: absolute;
        width: 2%;
        height: 3px;
        background-color: #999;
        left: 41.5%;
        top: 3px;
    }
`;
const Title = styled.h3`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;
const Desc = styled.p`
    font-size: 0.875rem;
    color: #a0a0a0;
`;
const ContentGrid = styled.div`
    flex-basis: 100%;
    padding: 48px 0;
    ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
            flex-basis: 100%;
            text-align: center;
            @media screen and (min-width: 640px) {
                flex-basis: 50%;
            }
            @media screen and (min-width: 1024px) {
                flex-basis: 25%;
            }
            p:first-child {
                font-size: 1.25rem;
            } // first-child
            p:last-child {
                font-size: 1rem;
                padding-bottom: 2rem;
            } // p:last-child
            span {
                font-size: 60px;
                padding-top: 20px;
                display: block;
            } // span
        } // li
    } // ul
`;

function Different() {

    const [isView, setIsView] = useState(false); // 보여지는지 체크하는 useState

    useEffect(() => {
        const scrollEvent = () => {

            const rect = document.querySelector("#content").getBoundingClientRect(); // 컨텐츠가 어느 위치에 있는지(top, left..) 정보가 뜸
            console.log(rect);

            if (rect.top-200 <= window.innerHeight && rect.bottom >= 0) { // content ul의 top값이 윈도우의 길이보다 작거나 같고, content ul의 bottom값이 0보다 크거나 같을 때
                setIsView(true);
            }
        }
        window.addEventListener("scroll", scrollEvent);
        scrollEvent();

        return() => {
            window.removeEventListener("scroll", scrollEvent);
        } // unmount했을 때 계속해서 이벤트가 실행됨을 방지
    }, []); // 한 번만 실행

    const data = [
        {
            "title" : "설립일",
            "number" : "2017",
            "desc" : "Date of Foundation"
        },
        {
            "title" : "직원수",
            "number" : "91522",
            "desc" : "Number of Employees"
        },
        {
            "title" : "계약체결",
            "number" : "2431",
            "desc" : "Contract Conclusion"
        },
        {
            "title" : "견적문의",
            "number" : "5461",
            "desc" : "Request for a Quote"
        }
    ];

    return (
        <>
            <Container>
                <ContainerWrap>
                    <ContentTitle>
                        <Title>Diffrent</Title>
                        <Desc>제목에 대한 부가설명 ...</Desc>
                    </ContentTitle>
                    <ContentGrid>
                        <ul id="content">
                            {
                                data.map((e, i) => {
                                    return (
                                        <li key={i}>
                                            <p>{e.title}</p>
                                                {
                                                    isView &&
                                                    <AnimateNumber
                                                    value={e.number}
                                                    duration={5000}
                                                    formatValue={(value) => `${value.toFixed(0)}`}
                                                    />
                                                }
                                            <p>{e.desc}</p>
                                        </li>
                                    )
                                })
                            }                            
                        </ul>
                    </ContentGrid>
                </ContainerWrap>
            </Container>            
        </>
    )
}

export default Different