import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Row, Col, Spinner, Card, Button } from 'react-bootstrap'

const BookRead = () => {
    const ref_file = useRef(null);
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
        fmtdate:'',
        file:null
    });

    const {TITLE, PRICE, fmtprice, AUTHORS, CONTENTS, PUBLISHER, IMAGE, ISBN, REGDATE, fmtdate, file} = book;

    const getBook = async() => {
        setLoading(true);
        const res = await axios.get('/books/read/' + bid);
        //console.log(res.data);
        setBook(res.data);
        setLoading(false);
    }


    useEffect(()=> {
        getBook();
    }, []);

    const onChangeFile = (e) => {
        setBook({
            ...book,
            image: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        })
    }

    //업데이트 이미지 함수
    const onUpdateImage = async() => {
        if(!file){
            alert("변경할 이미지를 선택하세요.");
        }else{
            if(window.confirm("이미지를 변경할까요?")){
                //이미지 변경
                const formData = new FormData();
                formData.append("file", file);
                formData.append("bid", bid);
                const res = await axios.post('/books/update/image', formData);

                if(res.data == 0){
                    alert("이미지 변경 실패!");
                }else{
                    alert("이미지 변경 성공!");
                }
            }
        }
    }


    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서정보</h1>
            <Row className='justify-content-center'>
                <Col md={8}>
                    <Card className='p-3'>
                        <Row>
                            <Col md={3}>
                                <div className='mt-1'>
                                    <img onClick={()=> ref_file.current.click()}
                                        src={IMAGE || "http://via.placeholder.com/150x200"}
                                        width="100%" className='bookPhoto' />
                                    <input ref={ref_file}
                                        type="file" onChange={onChangeFile} style={{display:'none'}}/>
                                </div>
                                <Button onClick={onUpdateImage}
                                    size="sm mt-2 w-100" variant='outline-success'>이미지 수정</Button>
                            </Col>
                            <Col className='px-3 align-self-center'>
                                <h3>{TITLE}</h3>
                                <hr/>
                                <div>저자: {AUTHORS}</div>
                                <div>가격: {fmtprice}</div>
                                <div>출판사: {PUBLISHER}</div>
                                <div>ISBN: {ISBN}</div>
                                <div>등록일: {fmtdate}</div>
                                <NavLink to={`/books/update/${bid}`}>
                                    <Button className='bt-3 px-5' size="sm" variant='outline-success'>정보수정</Button>
                                </NavLink>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='mt-2'>
                                <div>{CONTENTS}</div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default BookRead