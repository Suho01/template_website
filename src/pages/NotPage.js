import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Page = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
    left: 0;
    top: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2%;
    box-sizing: border-box;
`;
const PageContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    line-height: 1.4; // 1.4배
    padding: 40px;
    background-color: #fff;
    border-radius: 10px;
    width: 100%;
    -webkit-box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.1);
    box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.1);
    text-align: center;
    h3 {
        font-size: 165px;
        font-weight: bold;
        margin-bottom: 50px;
        color: #262626;
        span {
            color: #00b7ff;
        } // span
    } // h3
    p {
        margin-bottom: 20px;
        font-size: 40px;
        font-weight: bold;
        span {
            color: red;
        } // span
    } // p
`;
const Button = styled.button`
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px 30px;
    border-radius: 5px;
    cursor: pointer;
`;

function NotPage() {

    const navigate = useNavigate();
    const [countDown, setCountDown] = useState(5);
    useEffect(() => {
        if (countDown > 0) { // 만약 countDown이 0보다 크다면
            const timer = setTimeout(() => {
                setCountDown(countDown - 1); // countDown에 저장되어있는 5에서 1을 계속 뺀 것을 setCountDown에 저장한 후
            }, 1000); // 1초마다 실행
            
            return() => clearTimeout(timer); // 버그 방지를 위해 초기화
        } else { // countDown이 0이라면
            navigate('/');
        }
    }, [countDown, navigate]); // countDown이 바뀔 때마다 재실행

    return (
        <Page>
            <PageContent>
                <h3>4<span>0</span>4</h3>
                <p>페이지를 찾을 수 없습니다.</p>
                <p>주소를 다시 한 번 확인해주세요.</p>
                <p><span>{countDown}</span>초 후에 이동됩니다.</p>
                <Button onClick={() => {navigate('/')}}>메인으로 가기</Button>
            </PageContent>
        </Page>
    )
}

export default NotPage