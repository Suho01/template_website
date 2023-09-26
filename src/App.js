import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import GlobalStyle from "./components/GlobalStyle";
import Main from "./pages/Main";
import Aside from "./components/Aside";
import { ThemeProvider } from "styled-components";
import Nav from "./components/Nav";
import store, { logIn, loggedIn } from "./store";
import { Provider, useDispatch, useSelector } from "react-redux";
import Member from "./pages/Member";
import Login from "./pages/Login";
import Example from "./example/Example.js/Example";
import Logout from "./pages/Logout";
import { useEffect } from "react";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import Modify from "./pages/Modify";
import Findemail from "./pages/Findemail";
import Write from "./pages/Write";
import Service from "./pages/Service";
import Notice from "./pages/service/Notice";
import Gallery from "./pages/service/Gallery";
import Online from "./pages/service/Online";
import Qna from "./pages/service/Qna";
import View from "./pages/View";
import { useState } from "react";
import Modal from "./components/Modal";
import NotPage from "./pages/NotPage";

function App() {
    return (
        <>
            <Provider store={store}>
                <Inner />
            </Provider>
        </>
    );
}

function Inner() {

    const light = {
        colors: {
            Primary : "salmon",
            Secondary : "white",
            BgColor : "#e9f1f6",
            Color : "#000",
            ContentBg : "#fff"
        }
    }
    const dark = {
        colors: {
            Primary : "#272929",
            Secondary : "#e9e9e9",
            BgColor : "#333",
            Color : "#e9e9e9",
            ContentBg : "#272929"
        }
    }

    const theme = useSelector(state => state.dark);
    const DarkMode = theme === 'light' ? light : dark;
    const userState = useSelector(state => state.user);

    const dispatch = useDispatch(); // 스토리지값받아오기
    const uid = sessionStorage.getItem("users"); // uid(작명)에 스토리지의 user값 가져오기(get)
    
    // useEffect(() => {
    //     if (uid) {
    //         dispatch(logIn(uid));
    //     }
    // }, [uid, dispatch]);
    
    useEffect(() => {

        if (uid) {
            dispatch(logIn(uid));
        }

        dispatch(logIn(uid));
        const fetchUser = async() => {
            if (!uid) return; // uid가 없다면 return

            const userDoc = doc(collection(getFirestore(), "users"), uid); // 쿼리 만듦
            console.log(userDoc);

            try {
                const docSnapshot = await getDoc(userDoc); //문서를 가져온다.
                console.log(docSnapshot);

                if (docSnapshot.exists()) { // 만약 docSnapshot의 정보가 있다면 실행한다
                    const userData = docSnapshot.data();
                    dispatch(loggedIn(userData)); // 데이터 불러와서 로그아웃 상태로 바꿀거임
                }
            } catch(error) {
                console.log(error);
            } // async 쓰면 try, catch 국룰
        }
        fetchUser();
    }, [dispatch, uid]); // []가 빈 괄호면 한 번만 실행, 값이 있으면 그 값이 바뀔 때마다 실행됨 - dispatch, uid값이 바뀔 때마다 실행한다는 뜻

    const [isModal, setIsModal] = useState(true);
    const navigate = useNavigate();

    return (
        <ThemeProvider theme={DarkMode}>
            <GlobalStyle />
            <Aside />
            <Nav userState={userState} />
            <Routes>
                <Route path="/" element={<Main/>}></Route>
                {/* <Route path="/" element={<Example/>}></Route> */}
                <Route path="/member" element={<Member/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/logout" element={<Logout/>}></Route>
                <Route path="/modify" element={<Member/>}></Route>
                <Route path="/findemail" element={<Findemail/>}></Route>
                <Route path="/write/:board" element={<Write />}></Route>
                
                <Route path="/view/:board/:view" element={<View />}></Route>
                <Route path="/view/:board" element={isModal && <Modal error="유효하지 않은 경로입니다." onClose={() => {navigate('/');}} />}></Route>
                
                <Route path="/edit/:board/:view" element={<Write />}></Route>

                <Route path="/service" element={<Service />}>
                    <Route path="notice" element={<Notice />}></Route>
                    <Route path="online" element={<Online />}></Route>
                    <Route path="qna" element={<Qna />}></Route>
                    <Route path="gallery" element={<Gallery />}></Route>
                </Route>
                <Route path="/*" element={<NotPage />}></Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
