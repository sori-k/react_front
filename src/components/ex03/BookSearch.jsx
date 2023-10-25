import React, { useRef } from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Table, Button, InputGroup, Form, Row, Col } from 'react-bootstrap'
import Book from './Book';

const BookSearch = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [last, setLast] = useState(1);
    const [end, setEnd] = useState(false);
    const [query, setQuery] = useState("노드");
    const ref_txt = useRef(null);

    const getBooks = async() =>{
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=5&page=${page}`;
        const config = {
            headers:{
                "Authorization":"KakaoAK 6256b727c3acb106515114d93a33f668"
            }
        }
        setLoading(true);
        const res = await axios.get(url, config);
        //console.log(res);

        setLast(Math.ceil(res.data.meta.pageable_count/5)); //마지막페이지

        setBooks(res.data.documents);
        setEnd(res.data.meta.is_end); //마지막 페이지면 True
        setLoading(false);
    }

    useEffect(()=> {
        getBooks();
    }, [page]);

    const onChange = (e) =>{
        setQuery(e.target.value);
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        setPage(1);
        getBooks();
        ref_txt.current.focus(); //current : 내가 지금 사용하고 있는 컴포넌트
    }
    
    return (
        <div>
            <h1 className='text-center mb-5'>도서검색</h1>
            <Row className='mb-3'>
                <Col md={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control ref={ref_txt} value={query} onChange={onChange}/>
                            <Button type="submit" variant='success'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <hr/>
            <Table striped>
                <thead>
                    <tr className='text-center'>
                        <th>이미지</th>
                        <th>제목</th>
                        <th>가격</th>
                        <th>저자</th>
                        <th>상세보기</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? //로딩중이면
                        <div>로딩중입니다...</div>
                        :
                        books.map(book=> <Book key={book.isbn} book={book}/>) //아니면 여기
                    }
                </tbody>
            </Table>
            {(last > 1 && !loading) && //last page가 1page만 있으면 이전/다음버튼 안나온다.
                <div className='text-center'>
                    <Button onClick={()=> setPage(page-1)} disabled={page===1} variant='outline-success'>이전</Button>
                    <span className='mx-3'>{page} / {last}</span>
                    <Button onClick={()=> setPage(page+1)} disabled={end} variant='outline-success'>다음</Button>
                </div>
            }
        </div>
    )
}

export default BookSearch