import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { Row, Col, Spinner, Card, Button, InputGroup, Form } from 'react-bootstrap'

const BookUpdate = () => {
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const {bid} = useParams();
    const [book, setBook] = useState({
        bid:'',
        title:'',
        price:'',
        fmtprice:'',
        authors:'',
        contents:'',
        publisher:'',
        image:'',
        isbn:'',
        regdate:'',
        fmtdate:''
    });

    const {TITLE, PRICE, fmtprice, AUTHORS, CONTENTS, PUBLISHER, IMAGE, ISBN, REGDATE, fmtdate} = book;

    const getBook = async () => {
        setLoading(true);
        const res = await axios.get('/books/read/' + bid);
        //console.log(res.data);
        setBook(res.data);
        setLoading(false);
    }

    useEffect(()=>{
        getBook();
    },[]);

    const onChange = (e) => {
        setBook({
            ...book,
            [e.target.name]:e.target.value
        });
    }


    const onSubmit = async(e) => {
        e.preventDefault();
        if(window.confirm("수정된 내용을 저장할까요?")){
            //수정하기 작업
            const res = await axios.post('/books/update', book);
            if(res.data == 0){
                alert("수정 실패!");
            }else{
                alert("수정 완료!");
                navi(`/books/read/${bid}`);
            }
        }
    }


    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서정보 수정</h1>
            <Row className='justify-content-center'>
                <Col md={8}>
                    <Card className='p-3'>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서코드</InputGroup.Text>
                                <Form.Control value={bid} name="bid" readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서제목</InputGroup.Text>
                                <Form.Control onChange={onChange}
                                    value={TITLE} name="TITLE"/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서가격</InputGroup.Text>
                                <Form.Control onChange={onChange}
                                    value={PRICE} name="PRICE"/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서저자</InputGroup.Text>
                                <Form.Control onChange={onChange}
                                    value={AUTHORS} name="AUTHORS"/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>출판사</InputGroup.Text>
                                <Form.Control onChange={onChange}
                                    value={PUBLISHER} name="PUBLISHER"/>
                            </InputGroup>
                            <Form.Control onChange={onChange}
                                as="textarea" rows={10} name="CONTENTS">{CONTENTS}</Form.Control>
                            <div className='text-center my-3'>
                                <Button type="submit" className='my-2' variant='danger'>정보수정</Button>
                                <Button variant='secondary' onClick={()=> getBook()}>수정취소</Button>
                            </div>
                        </form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default BookUpdate