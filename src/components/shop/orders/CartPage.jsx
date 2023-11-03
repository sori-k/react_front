import React, { useContext, useEffect, useState } from 'react'
import OrderPage from './OrderPage'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Spinner, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { RiDeleteBinLine } from 'react-icons/ri'
import { BoxContext } from '../BoxContext'

const CartPage = () => {
    const {setBox} = useContext(BoxContext);
    const location = useLocation();  //주소를 읽어오기위한 훅
    const pathname = location.pathname;
    const search = new URLSearchParams(location.search);
    const show = search.get("show") ? search.get("show") : "cart";
    const navi = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sum, setSum] = useState(0);
    const [total, setTotal] = useState(0); //장바구니 전체 총 주문 권수 구하는
    const [count, setCount] = useState(0); //체크된 checkbox 갯수


    const onClickOrder = () => {
        if(count === 0){
            setBox({
                show: true,
                message: "주문할 상품을 선택하세요."
            })
        }else{
            navi(`${pathname}?show=order`);
        }
    }

    //장바구니 목록 가져오기
    const getCart = async() => {
        setLoading(true);
        const res = await axios.get(`/cart/list.json?uid=${sessionStorage.getItem("uid")}`);

        let list = res.data.list;
        list = list.map(book => book && {...book, checked:false});
        setBooks(list);
        let sum = 0;
        let total= 0;
        list.forEach(book => {
            sum += book.sum;
            total += book.qnt;
        });
        setSum(sum);
        setTotal(total);
        setLoading(false);
    }

    useEffect(()=> {
        getCart();
    }, []);

    const onDelete = (cid) => {
        setBox({
            show: true,
            message: `${cid}번 장바구니를 삭제할까요?`,
            action: async() => {// action을 적어야 confirm창이 나옴.
                await axios.post('/cart/delete', {cid});
                getCart();
            }
        })
    }

    //수량 변경
    const onChange = (e, cid) => {
        const list = books.map(book => book.cid === cid ? {...book, qnt:e.target.value} : book);
        setBooks(list);
    }

    //수량 변경 함수
    const onUpdate = (cid, qnt) => {
        setBox({
            show: true,
            message: `${cid}번 수량을 ${qnt}권으로 변경할까요?`,
            action: async() => {
                await axios.post('/cart/update', {cid, qnt});
                getCart();
            }
        })
    }

    //전체선택 체크박스
    const onChangeAll = (e) => { //함수만 넘길때는 밑에 적을때 (e)생략가능
        const list = books.map(book => book && {...book, checked:e.target.checked});
        setBooks(list);
    }

    const onChangeSingle = (e, cid) => {
        const list = books.map(book=> book.cid === cid ? {...book, checked:e.target.checked} : book);
        setBooks(list);
    }

    useEffect(()=> {
        let count = 0;
        books.forEach(book => book.checked && count++);
        setCount(count);
    }, [books]);

    //check된 상품 삭제
    const onDeleteChecked = () => {
        if(count === 0){
            setBox({show: true, message: "삭제할 상품을 선택하세요."});
        }else{
            setBox({
                show: true,
                message: `${count}개의 물품을 삭제할까요?`,
                action: async() => {
                    for(const book of books){
                        if(book.checked){
                            await axios.post('/cart/delete', {cid: book.cid});
                        }
                    }
                    getCart();
                }
            })
        }
    }

    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <>
            {show === "cart" ?
                <div className='my-5'>
                    <h1 className='text-center mb-5'>장바구니</h1>
                    <div className='mb-2'>
                        <Button onClick={onDeleteChecked}
                            size="sm" variant='outline-danger'>선택상품삭제</Button>
                    </div>
                    <Table bordered striped hover>
                        <thead>
                            <tr className='text-center'>
                                <th>
                                    <input type="checkbox" onChange={onChangeAll} 
                                        checked={books.length === count}/>
                                </th>
                                <th>제목</th>
                                <th>가격</th>
                                <th>수량</th>
                                <th>합계</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book=>
                                <tr key={book.cid}>
                                    <td className='text-center'>
                                        <input type="checkbox" checked={book.checked} onChange={(e)=> onChangeSingle(e, book.cid)}/>
                                    </td>
                                    <td><div className='ellipsis'>[{book.bid}] {book.title}</div></td>
                                    <td className='text-end'>{book.fmtprice}원</td>
                                    <td className='text-end'>
                                        <input  onChange={(e)=> onChange(e, book.cid)}
                                            value={book.qnt} size={2} className='text-end me-2 mt-1'/>
                                        <Button onClick={()=> onUpdate(book.cid, book.qnt)}
                                            variant='outline-secondary' size="sm">변경</Button>
                                    </td>
                                    <td className='text-end'>{book.fmtsum}원</td>
                                    <td className='text-center'>
                                        <RiDeleteBinLine onClick={()=> onDelete(book.cid)}
                                            className='delete'/></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Alert variant='dark'>
                        <Row>
                            <Col className='text-center'>총 주문수량 : {total}권</Col>
                            <Col className='text-end me-5'>
                                합계 : {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                            </Col>
                        </Row>
                    </Alert>
                    <div className='text-center'>
                        {books.length > 0 &&
                            <Button onClick={onClickOrder} variant='outline-danger'>주문하기</Button>
                        }
                        <Button className='ms-2' variant='outline-secondary'>쇼핑계속</Button>
                    </div>
                </div>
                :
                <OrderPage books={books}/>
            }
        </>
    )
}

export default CartPage