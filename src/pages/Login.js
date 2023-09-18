import React, { useState } from 'react'
import styled from 'styled-components'
import { firebaseAuth, signInWithEmailAndPassword } from './../firebase';
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
    display: flex;
    background-color: #f5f5f5;
    justify-content: center;
    height: calc(100vh - 86px);
    align-items: center;
`;
const SignUp = styled.div`
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

function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    // const history = useHistory();
    const navigate = useNavigate();

    const errorMsg = (errorCode) => {
        const firebaseError = {
            'auth/user-not-found' : "사용자를 찾을 수 없습니다.",
            'auth/wrong-password' : "이메일 혹은 비밀번호가 잘못되었습니다.",
            'auth/invalid-email' : "유효하지 않는 이메일입니다."
        }
        return firebaseError[errorCode] || '알 수 없는 에러가 발생했습니다.'
    }

    const LoginForm = async(e) => { // function 앞에 붙어야하는 async : 무언가 시도한다는 뜻, 성공과 실패를 try, catch로 함, 오류가 있을 수도 있지만 그래도 실행 try하고 오류가 있다면 catch를 실행한다.
        e.preventDefault();
        try {
            const userLogin = await signInWithEmailAndPassword(firebaseAuth, email, password); // async 안에서만 쓸수 있는 await, 단독으로 사용 못하고 function 내에서만 씀, 변수 선언 후 await가 붙음, await로 선언한 함수를 userLogin이 실행되기 전까지 기다림
            const user = userLogin.user;
            console.log(user);
        } catch(error) {
            setError(errorMsg(error.code));
        }
    }

    return (
        <>
            <Container>
                <SignUp>
                    <Title>로그인</Title>
                    <form onSubmit={LoginForm}>
                        <InputWrapper>
                            <Input type='email' className='email' placeholder='이메일' onChange={(e) => {setEmail(e.target.value)}} required /> {/* input에서 반드시 있는지 check하는 코드 : required */}
                            <Label>이메일</Label>
                        </InputWrapper>
                        <InputWrapper>                    
                            <Input type='password' className='password' placeholder='비밀번호' onChange={(e) => {setPassword(e.target.value)}} required />
                            <Label>비밀번호</Label>
                        </InputWrapper>
                        <Button>로그인</Button>
                    </form>
                    <p>{error}</p>
                </SignUp>
            </Container>
        </>
    )
}

export default Login