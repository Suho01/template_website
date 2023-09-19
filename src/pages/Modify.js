import React from 'react'
import { useSelector } from 'react-redux';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

function Modify() {
    const userState = useSelector(state => state.user.loggedIn);
    const navigate = useNavigate();

    return (
        <>
            {
                !userState ? <Modal error="로그인 후 이용해주세요." onClose={() => {navigate("/login");}} /> : ""
            }
        </>
    )
}

export default Modify