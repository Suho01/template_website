import { faArrowRightFromBracket, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components'
import Mnav from './Mnav';


const NavContent = styled.div`
    width: 100%;
    position: sticky;
    top: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 40;
    background-color: #fff;
`;
const NavWrap = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 2%;
`;
const NavLogo = styled.div`
    img {width: 100%;}
`;
const NavList = styled.div`
    display: flex;
    justify-content: space-between;
    flex-basis: 66.66667%;
    @media screen and (max-width: 1024px) {
        display: none;
    }
    ul {
        display: flex;
        flex-basis: 100%;
        justify-content: space-between;
        li {
            position: relative;
            flex-basis: 25%;
            text-align: center;
        } // li
    } // ul
`;
const NavSubmenu = styled.ul`
    position: absolute;
    background-color: rgba(30, 41, 59);
    transition: 0.5s;
    flex-wrap: wrap;
    text-align: center;
    height: ${({$isopen, $height}) => ($isopen === "true" ? $height : "0px")};
    overflow: hidden;
    li {
        flex-basis: 100% !important;
        padding: 10px 0;
        width: 9rem;
        a {
            color: #fff;
        } // a
    } // li
    /* &.on {
        height: auto; // height: auto하면 trasition 안먹힘, 길이 값 확실히 줘야함
    } // &.on */
`;
const NavMember = styled.div`
    ul {
        display: flex;
        column-gap: 20px;

        @media screen and (max-width: 768px) {
            display: none;
        }
    } // ul
`;

function Nav() {

    const [isHeight, setIsHeight] = useState();
    const SubMenuHeight = (e) => {
        const list = document.querySelectorAll(".sub_list")[e];
        const listLength = list.querySelectorAll("li").length;
        const value = listLength * 43 + "px";
        
        return setIsHeight(value);
    }

    const [isActive, setIsActive] = useState(-1);
    const SubData = {
        company : [
            {
                title : "인사말",
                link : "/company/greetings"
            },
            {
                title : "연혁",
                link : "/company/history"
            },
            {
                title : "내부전경",
                link : "/company/interior"
            },
            {
                title : "오시는길",
                link : "/company/directions"
            }
        ],
        business : [
            {
                title : "사업소개",
                link : "/business/business-1"
            },
            {
                title : "사업소개2",
                link : "/business/business-2"
            },
            {
                title : "사업소개3",
                link : "/business/business-3"
            }
        ],
        product : [
            {
                title : "제품소개",
                link : "/product/product-1"
            },
            {
                title : "제품소개2",
                link : "/product/product-2"
            },
            {
                title : "제품소개3",
                link : "/product/product-3"
            }
        ],
        service : [
            {
                title : "공지사항",
                link :"/service/notice"
            },
            {
                title : "온라인 상담",
                link : "/service/online"
            },
            {
                title : "질문과답변",
                link : "/service/qna"
            },
            {
                title : "갤러리",
                link : "/service/gallery"
            }
        ]
    }
    // 변수명['company'][0].title

    // const SubData = SubMenu.map((e, i) => {
    //     return (
    //         console.log(e[i])
    //     )
    // })

    const Nav = [
        {
            title : "회사소개",
            link : "company"
        },
        {
            title : "사업소개",
            link : "business"
        },
        {
            title : "제품소개",
            link : "product"
        },
        {
            title : "고객센터",
            link : "service"
        }
    ]
    // SubMenu[i].map((e, index) => {
    //     return (
    //         console.log(e, index)
    //     )
    // })

    return (
        <>
            <NavContent>
                <NavWrap>
                    <NavLogo>
                        <NavLink to="/">
                            <img src="https://via.placeholder.com/120x60" alt="logo" />
                        </NavLink>
                    </NavLogo>
                    <NavList>
                        <ul>
                            {
                                // Nav[0].map((e, i) => {
                                //     return (
                                //         <li><NavLink to={Nav[1][i]}>{e}</NavLink></li>
                                //     )
                                // })
                                Nav.map((e, i) => {
                                    return (
                                        <li onMouseOver={() => {
                                            setIsActive(i);
                                            SubMenuHeight(i);
                                        }} onMouseOut={() => {
                                            setIsActive(-1);
                                        }} key={i}><NavLink to={`/${e.link}`}>{e.title}</NavLink>
                                            <NavSubmenu className={`sub_list`}  $isopen = {isActive === i ? "true" : "false"} $height = {isHeight}> {/* $를 쓰면 속성으로 보이는것을 방지 */}
                                                {
                                                    SubData[e.link].map((el, index) => {
                                                        return (
                                                            <li key={index}><NavLink to={el.link}>{el.title}</NavLink></li>
                                                        )
                                                    })
                                                }
                                            </NavSubmenu>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </NavList>
                    <NavMember>
                        <ul>
                            <li>
                                <NavLink to ="/login">
                                    <FontAwesomeIcon icon={faLock}></FontAwesomeIcon> 로그인
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to ="/member">
                                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> 회원가입
                                </NavLink>
                            </li>
                        </ul>
                    </NavMember>
                </NavWrap>
            </NavContent>
            {/* mobile nav */}
            <Mnav />
            {/* mobile nav */}
        </>
    )
}

export default Nav