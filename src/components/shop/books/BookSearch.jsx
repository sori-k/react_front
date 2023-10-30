import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button, Form, Row, Col, Spinner, InputGroup } from 'react-bootstrap'

const BookSearch = () => {
    const location = useLocation(); //현재 path와 query를 받아온다.
    const path = location.pathname;
    const navi = useNavigate();

    const search = new URLSearchParams(location.search);
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const [query, setQuery] = useState(search.get("query") ? search.get("query") : "리액트");

    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [total, setTotal] = useState(0);
    const [end, setEnd] = useState(false); //값은 true or false

    //checked 갯수
    const [chcnt, setChcnt] = useState(0);

    const getBooks = async() => {
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=5&page=${page}`;
        const config = {
            headers:{"Authorization":"KakaoAK 6256b727c3acb106515114d93a33f668"}
        }
        setLoading(true);
        const res = await axios(url, config);
        //console.log(res.data);

        let docs = res.data.documents;
        docs = docs.map(doc=> doc && {...doc, checked:false});
        setBooks(docs);
        setTotal(res.data.meta.pageable_count);
        setEnd(res.data.meta.is_end);
        setLoading(false);
    }


    useEffect(()=> {
        getBooks();
    }, [location]);

    useEffect(()=> {
        let cnt = 0;
        books.forEach(book=> book.checked && cnt++); //하나씩 가져와서 checked 된 갯수 구하는것
        //console.log('...............', cnt);
        setChcnt(cnt);
    }, [books]); //books가 바뀔때마다


    const onSearch = (e) => {
        e.preventDefault();
        if(query == ""){
            alert("검색어를 입력하세요.");
        }else{
            navi(`${path}?query=${query}&page=1`);
        }
    }

    const onInsert = async(book) => {
        if(window.confirm("새로운 도서를 등록할까요?")) {
            //console.log(book);
            const url = "/books/insert"
            const res = await axios.post(url, {...book, authors:book.authors.join()});
            console.log(res.data);
            if(res.data === 0) {
                alert("도서가 등록되었습니다.");
            }else{
                alert("이미 등록된 도서입니다.");
            }
        }
    }

    const onChangeAll = (e) => {
        const docs = books.map(book => book && {...book, checked:e.target.checked});
                                              //기본 book은 복사하고, checkbox의 상태만 
        setBooks(docs);
    }

    const onChangeSingle = (e, isbn) => {
        const docs = books.map(book => book.isbn === isbn ? {...book, checked:e.target.checked} : book);
        setBooks(docs);
    }

    const onClickSave = async() => {
        if(chcnt === 0) {
            alert("저장할 도서들을 선택하세요!");
        }else {
            if(window.confirm(`${chcnt}권 도서를 저장할까요?`)){
                let count = 0;
                for(const book of books){
                    if(book.checked){
                        //도서저장
                        const url = "/books/insert"
                        const res = await axios.post(url, {...book, authors:book.authors.join()});
                        if(res.data === 0) count++;
                    }
                };
                
                alert(`${count}권 저장되었습니다.`);
                setBooks(books.map(book => book && {...book, checked:false}));
            }
        }
    }


    if(loading) return <div className='text-center my-5'><Spinner variant='success'/></div>

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서검색</h1>
            <Row>
                <Col md={3}>
                    <form onSubmit={onSearch}>
                        <InputGroup>
                            <Form.Control value={query} onChange={(e)=> setQuery(e.target.value)}/>
                            <Button type="submit" variant='outline-secondary'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='mt-1'>검색수: {total}권</Col>
                <Col className='text-end'><Button size="sm" variant='secondary' onClick={onClickSave}>선택저장</Button></Col>
            </Row>
            <hr/>
            <Table>
                <thead>
                    <tr>
                        <th>이미지</th>
                        <th>제목</th>
                        <th>가격</th>
                        <th>저자</th>
                        <th>저장</th>
                        <th><input type="checkbox" checked={books.length === chcnt} onChange={onChangeAll}/></th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book=>
                        <tr key={book.isbn}>
                            <td><img src={book.thumbnail || "http://via.placeholder.com/170x200"} width="30"/></td>
                            <td>{book.title}</td>
                            <td>{book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                            <td>{book.authors}</td>
                            <td><Button size="sm" variant='secondary' onClick={()=> onInsert(book)}>저장</Button></td>
                            <td><input onChange={(e)=> {onChangeSingle(e, book.isbn)}}
                                type="checkbox" checked={book.checked}/></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {total > 5 &&
                <div className='text-center'>
                    <Button onClick={()=> navi(`${path}?query=${query}&page=${page-1}`)} 
                        disabled={page===1} variant='outline-secondary'>이전</Button>
                    <span className='mx-2'>{page} / {Math.ceil(total/5)}</span>
                    <Button onClick={()=> navi(`${path}?query=${query}&page=${page+1}`)} 
                        disabled={end} variant='outline-secondary'>다음</Button>
                </div>
            }
        </div>
    )
}

export default BookSearch