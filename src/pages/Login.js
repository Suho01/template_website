import React, { useState } from 'react'
import styled from 'styled-components'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, firebaseAuth, signInWithEmailAndPassword } from './../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, loggedIn } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';

// 스타일 컴포넌트 기본 양식 const 작명 = styled.태그요소(div, p, h1...)``; 벡틱
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
const SnsButton = styled.button`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: ${props => props.$bgColor || 'gray'};
    color: ${props => props.$color || 'white'};
    font-size: 16px;
    width: 50%;
    transition: 0.3s;
    &:hover {
        background-color: ${(props) => props.$hoverBgColor || '#666'};
    } // &:hover
    svg {
        margin-right: 8px;
    } // svg
`;

function Login() {

    const [email, setEmail] = useState(); // 읽기전용 email : 바뀌지 않음, 쓰기전용 setEmail : 바뀔 수 있음을 useState의 빈 상태로 선언
    const [password, setPassword] = useState(); // 읽기전용 password : 바뀌지 않음, 쓰기전용 setPassword : 바뀔 수 있음을 useState의 빈 상태로 선언
    const [error, setError] = useState(); // 읽기전용 error : 바뀌지 않음, 쓰기전용 setError : 바뀔 수 있음을 useState의 빈 상태로 선언
    // const history = useHistory(); 이 버전에서 이제는 안 쓴대 useNavigate로 쓰자

    const navigate = useNavigate(); // useNavigate : 링크에서 쓰는 것
    const dispatch = useDispatch(); // useDispatch : 리덕스에서 쓰는 거라고 함
    const userState = useSelector(state => state.user);
    console.log(userState);

    const errorMsg = (errorCode) => { // errorMsg(작명) errorCode(정해진 것) 사용
        const firebaseError = {
            'auth/user-not-found' : "사용자를 찾을 수 없습니다.",
            'auth/wrong-password' : "이메일 혹은 비밀번호가 잘못되었습니다.",
            'auth/invalid-email' : "유효하지 않는 이메일입니다."
        } // 정해진 에러메시지를 바꿔줌
        return firebaseError[errorCode] || '알 수 없는 에러가 발생했습니다.'
    } // 작명해주지 않은 나머지 에러메시지 바꿔줌

    const LoginForm = async(e) => { // function 앞에 붙어야하는 async : 무언가 시도한다는 뜻, 성공과 실패를 try, catch로 함, 오류가 있을 수도 있지만 그래도 실행 try하고 오류가 있다면 catch를 실행한다.
        e.preventDefault(); // 새로고침 되지 않게 선언
        try {
            const userLogin = await signInWithEmailAndPassword(firebaseAuth, email, password); // async 안에서만 쓸수 있는 await, 단독으로 사용 못하고 function 내에서만 씀, 변수 선언 후 await가 붙음, await로 선언한 함수를 userLogin이 실행되기 전까지 기다림
            
            // alert("로그인되었습니다.");
            // navigate('/');

            const user = userLogin.user;
            console.log(user);
            sessionStorage.setItem("users", user.uid);
            dispatch(logIn(user.uid));

            const userDoc = doc(collection(getFirestore(), "users"), user.uid);
            
            const userDocSnapshot = await getDoc(userDoc);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                dispatch(loggedIn(userData));
                navigate('/'); // '-1' : 이전 페이지로 감(=게시판에 있다가 로그인하면 게시판으로 가고, 메인에 있다가 로그인하면 메인에 간다는 뜻)
            }

        } catch(error) {
            setError(errorMsg(error.code));
            console.log(error.code);
        }
    }

    const snsLogin = async (data) => {
        let provider;

        switch(data) {
            case 'google':
                provider = new GoogleAuthProvider();
            break;
            case 'github':
                provider = new GithubAuthProvider();
            break;

            default:
                return;
        }
        try {
            const result = await signInWithPopup(firebaseAuth, provider);
            const user = result.user;
            console.log(user);
            sessionStorage.setItem("users", user.uid);
            dispatch(logIn(user.uid));
            navigate('/member', {
                state: {
                    nickname: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }
            });


        } catch(error) {
            setError(errorMsg(error));
            console.log(error);
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
                    <InputWrapper>
                        <NavLink to="/findemail">이메일/비밀번호 재설정</NavLink>
                        <NavLink to="/member">회원가입</NavLink>
                    </InputWrapper>
                    <InputWrapper>
                        <SnsButton onClick={() => {snsLogin('google')}} $bgColor="#db4437" $hoverBgColor="#b33225">
                            <FontAwesomeIcon icon={faGoogle} /> Login With Google
                        </SnsButton>
                        <SnsButton onClick={() => {snsLogin('github')}} $bgColor="#333" $hoverBgColor="#111">
                            <FontAwesomeIcon icon={faGithub} /> Login With Github
                        </SnsButton>
                    </InputWrapper>
                </SignUp>
            </Container>
        </>
    )
}

export default Login