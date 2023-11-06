import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Table, Alert, Row, Col, InputGroup, Card, Form, Button, Spinner } from 'react-bootstrap'
import ModalPostCode from '../users/ModalPostCode';
import {BoxContext} from '../BoxContext'

const OrderPage = ({books}) => {
    const [loading, setLoading] = useState(false);
    const {setBox} = useContext(BoxContext);
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0); //주문할 전체 상품 갯수
    const [sum, setSum] = useState(0); //주문할 상품 합계
    const [form, setForm] = useState({ //user정보 가져와서 주문자 정보에 넣는..
        uid: '',
        uname: '',
        phone: '',
        address1: '',
        address2: ''
    });

    const {uid, uname, phone, address1, address2} = form; //비구조 할당 (원래 사용할때 form.uid 쓰는 걸 value값에 uid 로 사용하기위해)

    //user 정보가져오는 함수
    const getUser = async() => {
        const res = await axios.get(`/users/read/${sessionStorage.getItem("uid")}`);
        //console.log(res.data);
        setForm(res.data); //user에 데이터값 넣기
    }
    
    useEffect(() => {
        const list = books.filter(book => book.checked);
        setOrders(list);
        //console.log(list);
        let sum = 0;
        let total = 0;
        list.forEach(book => {
            sum += book.sum;
            total += book.qnt;
        });
        setSum(sum);
        setTotal(total);

        getUser();
    }, []);

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    //주문하기 버튼 눌렀을때
    const onOrder = () => {
        setBox({
            show: true,
            message: "주문을 진행할까요?",
            action: async() => {
                setLoading(true);
                const data = {...form, sum, uid};
                //console.log(data);
                const res = await axios.post('/orders/insert/purchase', data);
                const pid = res.data;
                //주문상품 저장
                for(const order of orders){
                    const data = {...order, pid};
                    //console.log(data);
                    await axios.post('/orders/insert', data);
                }
                setLoading(false);
                window.location.href='/';
            }
        });
    }

    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문하기</h1>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <th>제목</th>
                        <th>가격</th>
                        <th>수량</th>
                        <th>합계</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(book=>
                        <tr key={book.cid}>
                            <td><div className='ellipsis'>[{book.bid}] {book.title}</div></td>
                            <td className='text-end'>{book.fmtprice}원</td>
                            <td className='text-end'>{book.qnt}권</td>
                            <td className='text-end'>{book.fmtsum}원</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Alert variant='dark'>
                <Row className='text-center'>
                    <Col>총 주문 수량 : {total}권</Col>
                    <Col>주문 합계 : {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Col>
                </Row>
            </Alert>
            <div className='my-5'>
                <h1 className='text-center mb-5'>주문자 정보</h1>
                <Card className='p-3'>
                    <form>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>받는이</InputGroup.Text>
                            <Form.Control value={uname} name="uname" onChange={onChange}/>
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>전화번호</InputGroup.Text>
                            <Form.Control value={phone} name="phone" onChange={onChange}/>
                        </InputGroup>
                        <InputGroup className='mb-1'>
                            <InputGroup.Text>받을 주소</InputGroup.Text>
                            <Form.Control value={address1} name="address1" onChange={onChange}/>
                            <ModalPostCode user={form} setUser={setForm}/>
                        </InputGroup>
                        <Form.Control placeholder='상세주소' value={address2} name="address2" onChange={onChange}/>
                    </form>
                </Card>
                <div className='text-center my-3'>
                    <Button onClick={onOrder}
                        className='px-5' variant='dark'>주문하기</Button>
                </div>
            </div>
        </div>
    )
}

export default OrderPage