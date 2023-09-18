import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logOut } from '../store'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { firebaseAuth } from '../firebase'
import Modal from '../components/Modal'

function Logout() {
    
    const [isModal, setIsModal] = useState(true); // 읽기전용 isModal : 바뀌지 않음, 쓰기전용 setIsModal : 바뀔 수 있음을 useState의 true 상태로 선언

    const dispatch = useDispatch(); // useDispatch : 리덕스에서 쓰는 거라고 함
    const navigate = useNavigate(); // useNavigate : 링크에서 쓰는 것

    signOut(firebaseAuth) // firebaseAuth의 signOut
    .then(() => { // promise가 종료되면 resolve에 들어간 값을 받을 수 있습니다.
        dispatch(logOut()); // dispatch를 logout시킨다.
        // navigate("/");
        sessionStorage.removeItem("users"); // 로그아웃을 하면 저장되어있는 user를 지움
    })
    .catch((error) => { // reject 된 경우에는 then으로 받으면 에러가 발생합니다. 이 때 catch를 사용하여 에러를 잡아줄 수 있습니다. catch가 then 뒤에 연결되어있기 때문에 then 이 먼저 실행 후 catch가 실행 된다고 생각할 수 있지만 그렇지 않습니다. 둘은 절대 같이 실행 될 수 없습니다. resolve 시에는 then, reject 시에는 catch 가 실행되는 것이죠.
        console.log(error);
    });

    return (
        <>
            isModal &&
            {<Modal error="로그아웃 되었습니다." onClose={() => {
                // isModal && 안 써주면 비교 대상이 없어서 안 됨 &&란 두 피연산자가 모두 true면 true를 반환하고, 그렇지 않으면 false를 반환합니다, error={}에는 함수를 적을 수도 있고, ""를 이용하면 직접 메시지를 적을 수 있다. onClick={} 함수는 다른 컴포넌트에서 가져온 것을 직접적으로 못 쓰기에 onClose를 써준다.
                setIsModal(false); // 로그아웃을 했을 때 setIsModal의 값은 false로 반환
                navigate("/"); // 이전 페이지로 이동(메인이였으면 메인)
            }} />}
            <div>Logout</div>
        </>
    )
}

export default Logout