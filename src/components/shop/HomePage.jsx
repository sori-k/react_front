import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Spinner, Form, InputGroup, Button} from 'react-bootstrap'
import { BsFillSuitHeartFill, BsSuitHeart } from 'react-icons/bs'
import { BiMessageDetail } from 'react-icons/bi'
import Pagination from 'react-js-pagination';
import './Pagination.css';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const navi = useNavigate();
    const size = 6;

    const location = useLocation();
    const search = new URLSearchParams(location.search); //search에 page정보

    //page값 가져오기
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const path = location.pathname;
    const [query, setQuery] = useState(search.get("query") ? search.get("query") : "");


    const getBooks = async() => {
        const url=`/books/list.json?query=${query}&page=${page}&size=${size}&uid=${sessionStorage.getItem("uid")}`;
        setLoading(true);
        const res= await axios(url);
        //console.log(res.data);
        setBooks(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
    }

    useEffect(()=> {
        getBooks();
    }, [location]); //location이 바뀔때마다 getBooks 호출

    const onChangePage = (page) => {
        navi(`${path}?query=${query}&page=${page}`);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        navi(`${path}?query=${query}&page=${page}`);
    }


    if(loading) return <div className='my-5 text-center'><Spinner/></div>
    return (
        <div className='my-5'>
            <Row className='mb-3'>
                <Col md={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e)=> setQuery(e.target.value)}
                                value={query} placeholder='제목, 내용, 저자'/>
                            <Button type="submit" variant='outline-secondary'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='mt-2'>검색수: {total}권</Col>
            </Row>
            <Row>
                {books.map(book=>
                    <Col xs={6} md={4} lg={2} className='mb-3'>
                        <Card>
                            <Card.Body>
                                <img src={book.IMAGE || "http://via.placeholder.com/150x200"} width="100%"/>
                                <small className='ellipsis mt-2'>{book.TITLE}</small>
                            </Card.Body>
                            <Card.Footer>
                                <span>
                                    <span className='heart'>{book.ucnt === 0 ? <BsSuitHeart/> : <BsFillSuitHeartFill/>}</span>
                                    <small className='ms-1'>{book.fcnt}</small>
                                </span>
                                {book.rcnt === 0 ||
                                    <span className='ms-3'>
                                        <BiMessageDetail/>
                                        <small className='ms-1'>{book.rcnt}</small>
                                    </span>
                                }
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            {total > 6 && 
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={onChangePage}/>
            }    
        </div>
    )
}

export default HomePage