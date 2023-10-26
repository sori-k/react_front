import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Table, Button, InputGroup, Form, Row, Col } from 'react-bootstrap'

const BlogSearch = () => {
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [end, setEnd] = useState(false);
    const [cnt, setCnt] = useState(0);
    const ref_query = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const page = parseInt(search.get("page"));
    const [query, setQuery] = useState(search.get("query")); //query를 바꾸게하기위해 state변수로(useState)
    //console.log(page, query);

    
    //검색하는 함수 만들기
    const getBlogs = async() => {
        const url=`https://dapi.kakao.com/v2/search/blog?page=${page}&query=${query}&size=5`;
        const config = {
            headers:{
                "Authorization":"KakaoAK 6256b727c3acb106515114d93a33f668"
            }
        }
        setLoading(true); //데이터 가져오는중
        const res = await axios(url, config); //결과 가져오기 -> 시간걸리니까 순차적으로 하기위해 async await 사용
        //console.log(res.data);

        let data = res.data.documents;
        data = data.map(blog => blog && {...blog, show:false, checked:false}); //원래있던 블로그 데이터에 show추가
        setBlogs(data);
        setBlogs(res.data.documents); //배열 들어가있는곳 (블로그에 데이터가 들어가있다.)
        setEnd(res.data.meta.is_end);
        setTotal(res.data.meta.pageable_count);
        setLoading(false); //데이터 다가져왔을때
    }


    useEffect(()=>{
        getBlogs();
    },[location]); //빈 배열은 제일처음 한번만 실행됨 [location] ->(location 정보가 바뀌면 블로그를 다시 가져오겠다.)


    useEffect(()=>{ //checkbox
        let cnt = 0;
        blogs.forEach(blog => blog.checked && cnt++);
        setCnt(cnt);
    },[blogs]);


    const onSubmit = (e) =>{
        e.preventDefault();
        if(query == ""){
            alert("검색어를 입력하세요!");
            ref_query.current.focus();
        }else{
            navigate(`/blog?page=1&query=${query}`);
        }
    }

    const onClick = (url) =>{ //몇번째거를 보였다 안보였다 할지
        let data = blogs.map(blog => blog.url === url ? {...blog, show:!blog.show} : blog);
        setBlogs(data);                     //현재반복하는 url랑 url이 같으면
    }

    const onChangeAll = (e) =>{ //전체 선택 체크박스
        let data = blogs.map(blog => blog && {...blog, checked:e.target.checked});
        setBlogs(data);
    }

    const onChangeSingle = (e, url) =>{ //각 행마다 체크박스 선택시
        let data = blogs.map(blog => blog.url === url ? {...blog, checked:e.target.checked} : blog);
        setBlogs(data);
    }
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>블로그 검색</h1>
            {loading ?
                <div>로딩중....</div>
                :
                <>
                    <Row>
                        <Col md={4}>
                            <form onSubmit={onSubmit}>
                                <InputGroup>
                                    <Form.Control ref={ref_query} value={query} onChange={(e)=> setQuery(e.target.value)}/>
                                    <Button type="submit" variant='success'>검색</Button>
                                </InputGroup>
                            </form>
                        </Col>
                        <Col>검색수: {total}</Col>
                    </Row>
                    <hr/>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th><input checked={cnt == blogs.length}
                                    type="checkbox" onChange={onChangeAll}/></th>
                                <th>블로그 이름</th>
                                <th>제목</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, index)=>
                                <tr key={blog.url}>
                                    <td><input onChange={(e)=> onChangeSingle(e, blog.url)}
                                        type="checkbox" checked={blog.checked}/></td>
                                    <td>{index} : <a href={blog.url}>{blog.blogname}</a></td>
                                    <td>
                                        <div onClick={()=> onClick(blog.url)}
                                            dangerouslySetInnerHTML={{__html: blog.title}} style={{cursor:'pointer', color:'blue'}}></div>
                                        {blog.show &&
                                            <div dangerouslySetInnerHTML={{__html: blog.contents}}></div>
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className='text-center'>
                        <Button onClick={()=> navigate(`/blog?page=${page-1}&query=${query}`)}
                            variant='outline-success' disabled={page===1}>이전</Button>
                        <span className='mx-3'>{page} / {Math.ceil(total/5)}</span>
                        <Button onClick={()=> navigate(`/blog?page=${page+1}&query=${query}`)}
                            variant='outline-success' disabled={end}>다음</Button>
                    </div>
                </>
            }
        </div>
    )
}

export default BlogSearch