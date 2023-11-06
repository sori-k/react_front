import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Table, Alert } from 'react-bootstrap'

const OrderModal = ({purchase, sum}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [list, setList] = useState([]);

    //주문상품 가져오는 함수
    const getOrder = async() => {
        const res = await axios.get('/orders/list/order.json?pid=' + purchase.pid);
        //console.log(res.data);
        setList(res.data);
    }

    useEffect(()=> {
        getOrder();
    }, []);

    return (
        <>
        <Button variant="primary" onClick={handleShow}>
            주문상품
        </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size='lg'>
                    
                <Modal.Header closeButton>
                    <Modal.Title>주문상품</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='my-2'>
                        <div>받는이: {purchase.rname} <span>({purchase.str_status})</span></div>
                        <div>배송지 주소: {purchase.raddress1} {purchase.raddress2}</div>
                        <div>전화: {purchase.rphone}</div>
                    </div>
                    <Table bordered striped hover>
                        <thead>
                            <tr className='text-center'>
                                <th>상품번호</th>
                                <th>제목</th>
                                <th>수량</th>
                                <th>가격</th>
                                <th>합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(book=>
                                <tr key={book.bid} className='text-center'>
                                    <td>{book.bid}</td>
                                    <td>{book.title}</td>
                                    <td>{book.qnt}</td>
                                    <td>{book.fmtprice}원</td>
                                    <td>{book.fmtsum}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Alert className='text-end'>총 합계 : {sum}원</Alert>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrderModal