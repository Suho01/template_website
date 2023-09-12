import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeName } from '../store';

function Main() {

    const a = useSelector(state => state.user);
    const dispatch = useDispatch();

    return (
        <>
            <p>{a[0]}</p>
            <p>{a[1]}</p>
            <button onClick={() => {dispatch(changeName())}}>변경</button>
        </>
    )
}

export default Main