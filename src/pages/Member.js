import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { createUserWithEmailAndPassword, firebaseAuth } from './../firebase';
import { doc, setDoc, getFirestore, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '../store';

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

const Password = styled.div`
    position: relative;
    width: 100%;
    svg {
        position: absolute;
        right: 10px;
        top: 12.5px;
        cursor: pointer;
    } // svg
`;



function Member() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [nickname, setNickname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [eye, setEye] = useState([0, 0]);
    const [isModal, setIsModal] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch(); // useDispatch

    const [userUid, setUserUid] = useState("");
    const initialMode = window.location.pathname.includes("member"); // 로그인 상태일 때 정보수정을 누르면 false, 로그아웃 상태일 때 회원가입을 누르면 true
    useEffect(() => {
        if (!initialMode) {
            firebaseAuth.onAuthStateChanged((user) => { // 인증을 초기화해서 다시 가져온다
                if (user) { // 만약 user가 있다면
                    setUserUid(user.uid); // setUserUid에 user의 uid를 저장한다
                }
            });
        }
    }, [initialMode]);

    useEffect(() => {
        if (!initialMode && userUid) { // 만약 initialMode가 없고, userUid는 있다면
            const fetchUserData = async() => {
                const userRef = doc(getFirestore(), "users", userUid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setName(data.name);
                    setNickname(data.nickname);
                    setPhoneNumber(data.phoneNumber);
                    setEmail(data.email);
                }
            }
            fetchUserData();
        }
    }, [initialMode, userUid]);

    const toggleEye = (index) => {
        const newEye = [...eye];
        // 원래 있던 eye의 배열값을 복사해 배열을 벗긴다.([...eye])
        // [[0, 0]]에서 [] 하나를 없앤게 ... 표현 : 같은 값이 복사됨
        newEye[index] = !newEye[index];
        // eye의 첫번째를 클릭했다면 newEye[0]는 부정 즉, false에서 true로 변경됨. [1, 0]으로 바귐
        setEye(newEye);
        // 그리고 그 값을 쓰기 전용인 setEye에 새로운 배열값으로 저장
    }

    const PhoneNumber = (e) => {
        const value = e.target.value;

        e.target.value = e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/-{1,2}$/g, "");
        // 숫자를 제외한 모든 문자 제거

        setPhoneNumber(value);
    }

    const errorMsg = (errorCode) => {
        const firebaseError = {
            'auth/admin-restricted-operation' : "빈 데이터가 있습니다.",
            'auth/email-already-in-use' : "이미 사용 중인 이메일입니다.",
            'auth/invalid-email' : "유효하지 않는 이메일입니다.",
            'auth/operation-not-allowed' : "계정이 비활성화되어 있습니다.",
            'auth/weak-password' : "너무 짧은 비밀번호입니다.(6자리 이상)"
        }
        return firebaseError[errorCode] || '알 수 없는 에러가 발생했습니다.'
    }

    const isValidPhone = (phoneNumber) => {
        const regex = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/;
        return regex.test(phoneNumber); // test는 정규식코드에 일치하는 값이 있는지 없는지 확인하는 코드, true / false 값이 나옴
    }

    const isValidEmail = (email) => {
        const regex = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
        return regex.test(email); // 이메일 유효성 검사 정규식 코드
    }

    const signUp = async(e) => {
        e.preventDefault();

        let errorMessage = "";

        if (name.length === 0) {
            errorMessage = "이름";
        } else if (nickname.length === 0) {
            errorMessage = "닉네임";
        } else if (!isValidPhone(phoneNumber)) {
            setError("유효한 전화번호를 입력해주세요.");
            setIsModal(!isModal);
            return;
        } else if (!isValidEmail(email)) {
            setError("유효한 이메일 주소를 입력해주세요.");
            setIsModal(!isModal);
            return;
        } else if (password.length === 0 && initialMode) {
            errorMessage = "비밀번호";
        } else if (passwordConfirm.length === 0 && initialMode) {
            errorMessage = "비밀번호 확인";
        } else if (password !== passwordConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            setIsModal(!isModal);
            return;
        }

        if (errorMessage) {
            setError(errorMessage + "이(가) 비어있습니다.");
            setIsModal(!isModal);
            return;
        }

        try {
            const userProfile = {
                name,
                nickname,
                phoneNumber,
                email // 이메일 찾기 기능
            }

            if (initialMode) { // 만약 initialMode(회원가입)라면
                const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);
                await setDoc(doc(getFirestore(), "users", user.uid), userProfile);

                sessionStorage.setItem("users", user.uid); // user값이 session에 저장됨
                dispatch(logIn(user.uid)); // dispatch에 login user 넣음

                alert("회원가입이 완료되었습니다.");
            } else { // 회원가입이 아니라면
                if (userUid) { // userUid가 있다면
                    const userRef = doc(getFirestore(), "users", userUid);
                    await updateDoc(userRef, userProfile);
                    alert("정보수정이 완료되었습니다.");
                } else { // userUid가 없다면
                    setError("회원정보가 없습니다.");
                    setIsModal(!isModal);
                    return;
                }
            }
            navigate('/');

        } catch(error) {
            setError(errorMsg(error.code));
            setIsModal(!isModal);
        }
    }
    // 로그인이 되어있는지 store.js에서 loggedIn:true인지 확인, select로 가져오기
    const userState = useSelector(state => state.user.loggedIn);
    // console.log(userState);

    return (
        <>
            {
                isModal &&
                <Modal error={error}
                // isModal={isModal} setIsModal={setIsModal}
                onClose={() => setIsModal(false)} />
            }            
            { // === true 생략가능
                userState.loggedIn && initialMode ? <Modal error="이미 로그인되어 있습니다." onClose={() => {navigate("/");}} /> :
                    <Container>
                        <SignUp>
                        <Title>{initialMode ? "회원가입" : "정보수정"}</Title>
                        <Input defaultValue={name} onChange={(e) => {setName(e.target.value)}} type='text' className='name' placeholder='이름' />
                        <Input defaultValue={nickname} onChange={(e) => {setNickname(e.target.value)}} type='text' className='nickname' placeholder='닉네임' />
                        <Input defaultValue={phoneNumber} onInput={PhoneNumber} maxLength={13} type='text' className='phone' placeholder='전화번호' />
                        <Input defaultValue={email} type='email' className='email' onChange={(e) => {setEmail(e.target.value)}} placeholder='이메일' />

                        {
                            initialMode &&
                            <>
                                <Password>
                                    <Input type={eye[0] ? 'text' : 'password'} className='password' onChange={(e) => {setPassword(e.target.value)}} placeholder='비밀번호' />
                                    <FontAwesomeIcon icon={eye[0] ? faEye : faEyeSlash} onClick={() => {toggleEye(0)}} />
                                </Password>
                                <Password>
                                    <Input type={eye[1] ? 'text' : 'password'} className='confirm_password' onChange={(e) => {setPasswordConfirm(e.target.value)}} placeholder='비밀번호 확인' />
                                    <FontAwesomeIcon icon={eye[1] ? faEye : faEyeSlash} onClick={() => {toggleEye(1)}} />
                                </Password>
                            </>
                        }

                        <Button onClick={signUp}>{initialMode ? "가입" : "수정"}</Button>
                    </SignUp>
                </Container>
            }
            {/* <Container>
                <SignUp>
                    <Title>회원가입</Title>
                    <Input value={name} onChange={(e) => {setName(e.target.value)}} type='text' className='name' placeholder='이름' />
                    <Input value={nickname} onChange={(e) => {setNickname(e.target.value)}} type='text' className='nickname' placeholder='닉네임' />
                    <Input onInput={PhoneNumber} maxLength={13} type='text' className='phone' placeholder='전화번호' />
                    <Input type='email' className='email' onChange={(e) => {setEmail(e.target.value)}} placeholder='이메일' />

                    <Password>
                        <Input type={eye[0] ? 'text' : 'password'} className='password' onChange={(e) => {setPassword(e.target.value)}} placeholder='비밀번호' />
                        <FontAwesomeIcon icon={eye[0] ? faEye : faEyeSlash} onClick={() => {toggleEye(0)}} />
                    </Password>
                    <Password>
                        <Input type={eye[1] ? 'text' : 'password'} className='confirm_password' onChange={(e) => {setPasswordConfirm(e.target.value)}} placeholder='비밀번호 확인' />
                        <FontAwesomeIcon icon={eye[1] ? faEye : faEyeSlash} onClick={() => {toggleEye(1)}} />
                    </Password>

                    <Button onClick={signUp}>가입</Button>
                </SignUp>
            </Container> */}
        </>
    )
}

export default Member