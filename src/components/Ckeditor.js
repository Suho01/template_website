import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { faList, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './Modal';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, getStream } from 'firebase/storage';

const ButtonWrap = styled.div`
    display: flex;
    justify-content: space-between;
`;
const Button = styled.button`
    border-radius: 0.5rem;
    margin: 20px 0px;
    background-color: salmon;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: bold;
    color: #fff;
    display: flex;
    align-items: center;
    outline: none;
    border: none;
    cursor: pointer;
    &:nth-child(1) {
        background-color: rgb(29, 78, 216);
    } // &:nth-child(1)
    a {
        color: #fff;
    } // a
    svg {
        margin-right: 12px;
    } // svg
`;

function Ckeditor({title, postData}) {
    const memberProfile = useSelector(state => state.user);
    const [isModal, setIsModal] = useState(false);
    const navigate = useNavigate();
    const {board, view} = useParams();
    
    const [writeData, setWriteData] = useState("");
    const [message, setMessage] = useState("");

    const [editorInstance, setEditorInstance] = useState(null);
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        if (postData) { // 만약 postData가 있다면
            setWriteData(postData.contetnt); // setWriteData의 값을 content로 변경
        }
    }, [postData]); // postData가 있다면 실행

    const dataSubmit = async() => {
        if (title.length === 0) {
            setIsModal(!isModal);
            setMessage("제목을 입력해주세요.");
            return;
        } else if (writeData.length === 0) {
            setIsModal(!isModal);
            setMessage("내용을 입력해주세요.");
            return;
        }

        try {
            if (board && view) {
                const postRef = doc(getFirestore(), board, view);
                await updateDoc(postRef, {
                    title : title,
                    contetnt : writeData
                });
                alert("게시물이 성공적으로 게시되었습니다.");

            } else {
                const fileInput = document.querySelector("#file").files[0];
                // console.log(fileInput);
                if (fileInput) {
                    uploadToFirebase(fileInput);
                }
                // await addDoc(collection(getFirestore(), board), {
                //     title : title,
                //     contetnt : writeData, 
                //     view : 1,
                //     uid : memberProfile.uid,
                //     email : memberProfile.data.email,
                //     nickname : memberProfile.data.nickname,
                //     file : fileURL,
                //     timestamp : serverTimestamp()
                // })
                // alert("게시물이 성공적으로 등록되었습니다.");
            }
            // navigate(`/service/${board}`);
        } catch(error) {
            setIsModal(!isModal);
            setMessage(error);
        }
    }

    const uploadToFirebase = async (file) => {
        const storageRef = ref(getStorage(), 'images/' + file.name);
        const upload = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            upload.on('state_changed',
            (snapshot) => {

            },

            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(upload.snapshot.ref)
                .then((result) => {
                    resolve(result);
                    console.log(resolve);
                    setFileUrl(result);
                });
            });
        });
    }

    function UploadAdapter(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return {
                upload: async () => {
                    const file = await loader.file;
                    const downURL = await uploadToFirebase(file);
                    return {
                        default: downURL
                    }
                }
            }
        }
    }
    
    return (
    <>
        {isModal && <Modal error={message} onClose={() => {setIsModal(false);}} />}
        <CKEditor
            editor={ClassicEditor}
            data = {writeData}
            config={{
                placeholder: "내용을 입력하세요.",
                extraPlugins: [UploadAdapter]
            }}
            onReady={ editor => {
                setEditorInstance(editor);
                // You can store the "editor" and use when it is needed.
                console.log( 'Editor is ready to use!', editor );
            }}
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                setWriteData(data);
                console.log( { event, editor, data } );
            } }
            onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
            } }
            onFocus={ ( event, editor ) => {
                console.log( 'Focus.', editor );
            } }
        />

        <input type='file' id='file' />
        <ButtonWrap>
            <Button><Link to="/service/notice"><FontAwesomeIcon icon={faList} />목록</Link></Button>
            <Button onClick={dataSubmit}><FontAwesomeIcon icon={faPen} />완료</Button>
        </ButtonWrap>
    </>
  )
}

export default Ckeditor