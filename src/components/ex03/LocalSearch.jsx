import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Spinner, Button, Form, InputGroup, Row, Col } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import LocalMadal from './LocalMadal';

const LocalSearch = () => {
    const [locals, setLocals] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigator = useNavigate(); //원하는 주소로 이동하기 위해
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    let page = parseInt(search.get("page")); //뒤로가기 했을 때, 유지하기 위해.. (현재 페이지를) 2페이지였다가 딴데갔다 뒤로하기해도 2페이지로
    
    //let query = search.get("query");
    const [query, setQuery] = useState(search.get("query"));

    const [total, setTotal] = useState(0); //검색수 구하기
    const [end, setEnd] = useState(false);

    const getLocal = async() => {
        const url= `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=5&page=${page}`;
        const config = {
            headers:{
                "Authorization":"KakaoAK 6256b727c3acb106515114d93a33f668"
            }
        }
        setLoading(true);
        const res=await axios.get(url, config);
        console.log(res.data);
        setLocals(res.data.documents);

        setTotal(res.data.meta.pageable_count); //검색수
        setEnd(res.data.meta.is_end); //마지막 페이지인지(true) 아닌지(false) 
        setLoading(false);
    }


    const onSubmit = (e) => {
        e.preventDefault();
        navigator(`/local?page=${page}&query=${query}`);
    }

    useEffect(()=>{
        getLocal();
    }, [location]); //첫번째는 함수, 두번째는 배열


    return (
        <div className='my-5'>
            <h1 className='text-center my-5'>지역검색</h1>
            {loading ?
                <div className='text-center'>
                    <Spinner variant='primary'/>
                    <h5>로딩중입니다....</h5>
                </div>
                :
                <>
                    <div>
                        <Row>
                            <Col md={4}>
                                <form onSubmit={onSubmit}>
                                    <InputGroup>
                                        <Form.Control onChange={(e)=> setQuery(e.target.value)}
                                            value={query}/>
                                        <Button type="submit" variant='success'>검색</Button>
                                    </InputGroup>
                                </form>
                            </Col>
                            <Col>
                                검색수: {total}
                            </Col>
                        </Row>
                    </div>
                    <hr/>
                    <Table>
                        <thead>
                            <tr>
                                <td>지역명</td>
                                <td>주소</td>
                                <td>전화번호</td>
                                <td>위치보기</td>
                            </tr>
                        </thead>
                        <tbody>
                            {locals.map(local=>
                                <tr key={local.id}>
                                    <td>{local.id}:{local.place_name}</td>
                                    <td>{local.address_name}</td>
                                    <td>{local.phone}</td>
                                    <td><LocalMadal local={local}/></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className='text-center'>
                        <Button onClick={()=> navigator(`/local?page=${page-1}&query=${query}`)}
                            disabled={page===1} variant='outline-success'>이전</Button>
                        <span className='mx-3'> {page} / {Math.ceil(total/5)}</span>
                        <Button onClick={()=> navigator(`/local?page=${page+1}&query=${query}`)}
                            disabled={end} variant='outline-success'>다음</Button>
                    </div>
                </>
            }
        </div>
    )
}

export default LocalSearch

//검색은 REST API키
//지도는 Javascript키 ->카카오개발자센터 내애플리케이션 내 플랫폼 등록되어있어야 나옴