import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Spinner, Row, Col, Card, Button, Tab, Tabs } from 'react-bootstrap';
import { BsFillSuitHeartFill, BsSuitHeart } from 'react-icons/bs'
import { BiMessageDetail } from 'react-icons/bi'
import ReviewPage from './ReviewPage';
import { BoxContext } from '../BoxContext';

const BookInfo = () => {
    const {setBox} = useContext(BoxContext);
    const navi = useNavigate();
    const location = useLocation();
    //console.log('.............', location.pathname);

    const {bid} = useParams();
    const [book, setBook] = useState(''); //데이터 저장할 변수
    const [loading, setLoading] = useState(false);

    const getBook = async() => {
        setLoading(true);
        const res = await axios.get(`/books/read/${bid}?uid=${sessionStorage.getItem("uid")}`);
        console.log(res.data);
        setBook(res.data);
        setLoading(false);
    }

    useEffect(()=> {
        getBook();
    }, []);

    const onClickHeart = async(bid) => {
        if(sessionStorage.getItem("uid")){
            await axios.post('/books/insert/favorite', {uid:sessionStorage.getItem("uid"), bid});
            getBook();
        }else{
            sessionStorage.setItem("target", location.pathname);
            navi('/users/login');
        }
    }

    const onClickFillHeart = async(bid) => {
        await axios.post('/books/delete/favorite', {uid:sessionStorage.getItem("uid"), bid});
        getBook();
    }

    //장바구니 눌렀을 때
    const onClickCart = async() => {
        const res = await axios.post('/cart/insert', {bid, uid:sessionStorage.getItem("uid")});
        setBox({
            show: true,
            message: res.data === 0 ? 
                    `장바구니에 등록되었습니다.\n 쇼핑을 계속 할까요?`
                    : 
                    `이미 장바구니에 존재합니다. \n 장바구니로 이동할까요?`,
            action: () => {
                window.location.href='/';
            }
        });
    
    }

    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서정보</h1>
            <Card className='p-3'>
                <Row>
                    <Col xs={6} lg={3} md={4} className='align-self-center'>
                        <img src={book.IMAGE} width="90%"/>
                    </Col>
                    <Col className='ms-3'>
                        <h5>{book.TITLE}</h5>
                        <br/>
                        <div className='mb-2'>가격: {book.fmtprice}원</div>
                        <div className='ellipsis mb-2'>저자: {book.AUTHORS}</div>
                        <div className='mb-2'>출판사: {book.PUBLISHER}</div>
                        <div className='mb-2'>등록일: {book.fmtdate}</div>
                        <div className='mb-2'>ISBN: {book.ISBN}</div>
                        
                        <span className='ms-3'>
                            <span className='heart'>{book.ucnt === 0 ? 
                                <BsSuitHeart onClick={()=> onClickHeart(book.BID)}/> 
                                : 
                                <BsFillSuitHeartFill onClick={()=> onClickFillHeart(book.BID)}/>}
                            </span>
                            <span className='ms-1 fcnt'>{book.fcnt}</span>
                        </span>
                        {book.rcnt === 0 ||
                            <span className='ms-3'>
                                <span className='message'><BiMessageDetail/></span>
                                <span className='ms-1 rcnt'>{book.rcnt}</span>
                            </span>
                        }
                        <br/>
                        {sessionStorage.getItem("uid") &&
                            <div className='mt-3'>
                                <Button onClick={onClickCart}
                                    className='me-2' variant='outline-secondary' size="sm">장바구니</Button>
                                <Button variant='danger' size="sm">바로구매</Button>
                            </div>
                        }
                    </Col>
                </Row>
            </Card>
            {/* 상세설명/ 리뷰 탭 */}
            <div className='my-5'>
                <Tabs
                    defaultActiveKey="review"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3">
                    <Tab eventKey="home" title="상세설명">
                        <div className='px-5'>{book.CONTENTS}</div>
                    </Tab>
                    <Tab eventKey="review" title="리뷰">
                        <ReviewPage location={location} setBook={setBook} book={book}/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default BookInfo