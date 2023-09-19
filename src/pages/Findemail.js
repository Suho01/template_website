import React from 'react'
import { collection, query, where, getDoc, getFirestore, getDocs } from 'firebase/firestore';
import { firebaseAuth, sendPasswordResetEmail } from '../firebase';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { useState } from 'react';

const Container = styled.div`
    display: flex;
    background-color: #f5f5f5;
    justify-content: center;
    height: calc(100vh - 86px);
    align-items: center;
`;
const FindMail = styled.div`
    width: 35vw;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 10px;
    @media screen and (max-width: 1024px) {
        width: 60vw;
    }
    @media screen and (max-width: 640px) {
        width: 70vw;
    }
`;
const Title = styled.h1`
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
`;
const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    padding-left: 45px;
    transition: border-color 0.4s;
    &:focus {
        border-color: #007bff;
        outline: none;
    } // &:focus
    &::placeholder {
        opacity: 0;
    } // &::placeholder
`;
const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        column-gap: 20px;
        a {
            background-color: #40e0d0;
            font-size: 14px;
            text-align: center;
            padding: 5px 20px;
            border-radius: 5px;
            color: #fff;
            &:last-child {
                background-color: #036;
            } // &:last-child
        } // a
    } // &:last-child
    input:focus + label,
    input:not(:placeholder-shown) + label {
        top: 4px;
        left: 4px;
        font-size: 8px;
        color: #007bff;
    } // input:focus + label
`;
const Label = styled.label`
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 14px;
    color: #999;
    transition: all 0.3s;
    pointer-events: none;
`;
const Button = styled.button`
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    background-color: #007bff;
    border: none;
    color: #fff;
    cursor: pointer;
    &:hover {
        background-color: steelblue;
    }
`;

function Findemail() {

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [resultEmail, setResultEmail] = useState("");
    const [isModalOpen, setModalOpen] = useState(false); // 읽기전용(수정불가) : isModalOpen, 쓰기전용(수정가능) : setModalOpen - 기본값을 false로 정함

    const PhoneNumber = (e) => {
        const value = e.target.value;

        e.target.value = e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/-{1,2}$/g, "");
        // 숫자를 제외한 모든 문자 제거

        setPhoneNumber(value);
    }
    const isValidPhone = (phoneNumber) => {
        const regex = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/;
        return regex.test(phoneNumber); // test는 정규식코드에 일치하는 값이 있는지 없는지 확인하는 코드, true / false 값이 나옴
    }

    const findID = async() => {
        if (name.length === 0) {
            setModalOpen(!isModalOpen); // setModalOpen === true ? isModalOpen
            setMessage("이름이 비어있습니다.");
        } else if (!isValidPhone(phoneNumber)) {
            setMessage("유효한 전화번호를 입력해주세요.");
            setModalOpen(!isModalOpen);
            return;
        }

        try {
            const userQuery = query(
                collection(getFirestore(), 'users'),
                where("phoneNumber", '==', phoneNumber),
                where("name", "==", name)
            );
            const querySnapShot = await getDocs(userQuery);
            console.log(querySnapShot);

            if (querySnapShot.empty) {
                setMessage("가입한 계정이 없습니다.");
                setModalOpen(!isModalOpen);
                return;
            }

            const userDoc = querySnapShot.docs[0];
            const userData = userDoc.data();
            console.log(userData);

            const email = userData.email;
            setResultEmail(email); // setResultEmail에 userData 안에 있는 email 저장

            if (!resultEmail) {
                setMessage("이메일 정보를 찾을 수 없습니다.");
                setModalOpen(!isModalOpen);
                return;
            }

            const maskEmail = email.replace(/(.{3}).+(@.+)/, "$1*****$2"); // 정규식 코드 외울 필요 없음

            setModalOpen(!isModalOpen);
            setMessage(`귀하의 이메일 주소는 ${maskEmail} 입니다.`);

        } catch(error) {
            console.log(error);

            setMessage(error);
            setModalOpen(!isModalOpen);
            return; // 모달창으로 에러메시지 띄우기
        }
    }
    const passwordEdit = () => { // async가 아니라서 then, catch
        sendPasswordResetEmail(firebaseAuth, resultEmail)
        .then(function() {
            setMessage(`귀하의 ${resultEmail.replace(/(.{3}).+(@.+)/, "$1*****$2")}로 메일을 발송했습니다.`);
            setModalOpen(!isModalOpen);
            return;
        })
        .catch(error => {
            setMessage(error);
            setModalOpen(!isModalOpen);
            return; // 모달창으로 에러메시지 띄우기
        });
    }

    return (
        <>
            <Container>
                <FindMail>
                    <Title>이메일 및 비밀번호 재설정</Title>
                    <InputWrapper>
                        <Input type='text' placeholder='이름을 입력해주세요.' value={name} onChange={(e) => setName(e.target.value)} />
                        <Label htmlFor='name'>이름</Label>
                    </InputWrapper>
                    <InputWrapper>
                        <Input type='text' placeholder='전화번호를 입력해주세요.' value={phoneNumber} onInput={PhoneNumber} maxLength={13} onChange={(e) => setPhoneNumber(e.target.value)} />
                        <Label htmlFor='phoneNumber'>전화번호</Label>
                    </InputWrapper>
                    <p>{message}</p>
                    <InputWrapper>
                        <Button onClick={findID}>이메일 찾기</Button>
                    </InputWrapper>
                    {resultEmail && <Button onClick={passwordEdit}>패스워드 재설정</Button>}
                </FindMail>
            </Container>
            {isModalOpen && <Modal error={message} onClose={() => {setModalOpen(false)}} />}
        </>
    )
}

export default Findemail