import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'
import ImageModal from './ImageModal';


const ImageSearch = () => {
    const [box, setBox] = useState({
        show:false, //true -> 모달창 뜨고, false -> 안뜨게
        url:''
    });

    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [total, setTotal] = useState(0);
    const [end, setEnd] = useState(false);

    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const page = parseInt(search.get("page") ? search.get("page") : 1); //있으면 가져오고 없으면 1을 가져온다.

    const [query, setQuery] = useState(search.get("query") ? search.get("query") : "권나라");
    //console.log(page, query);

    const [cnt, setCnt] = useState(0);


    //데이터 가져오는 함수
    const getImages = async() => {
        const url=`https://dapi.kakao.com/v2/search/image?page=${page}&query=${query}&size=12`;
        const config = {
            headers:{"Authorization":"KakaoAK 6256b727c3acb106515114d93a33f668"}
        }
        setLoading(true);
        //결과가져오기
        const res = await axios.get(url, config);

        let data=res.data.documents;
        //console.log(data);
        setTotal(res.data.meta.pageable_count);
        setEnd(res.data.meta.is_end);

        data = data.map(img => img && {...img, checked:false});
        setImages(data);
        setLoading(false);
    }

    //checkbox 전체선택
    const onChangeAll = (e) => {
        const data = images.map(img => img && {...img, checked:e.target.checked});
        setImages(data);
    }

    //checkbox 하나씩
    const onChangeSingle = (e, url) => {
        const data = images.map(img => img.thumbnail_url === url ? {...img, checked:e.target.checked} : img);
        setImages(data);
    }

    //checkbox useEffect
    useEffect(()=> {
        let cnt = 0;
        images.forEach(img=> img.checked && cnt++);
        setCnt(cnt);
    },[images]);

    //실행
    useEffect(()=> {
        getImages();
    },[location]);



    const onSubmit = (e) => {
        e.preventDefault();

        if(query == ""){
            alert("검색어를 입력하세요.");
        }else{
            navigate(`/image?query=${query}&page=${page}`);
        }
    }



    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>이미지 검색</h1>
            {loading ?
                <div>로딩중...</div>
                :
                <>
                    <Row>
                        <Col col={1}>
                            <input checked={images.length === cnt} type="checkbox" onChange={onChangeAll}/>
                        </Col>
                        <Col>
                            <form onSubmit={onSubmit}>
                                <InputGroup>
                                    <Form.Control value={query} onChange={(e)=> setQuery(e.target.value)}/>
                                    <Button type="submit" variant='success'>검색</Button>
                                </InputGroup>
                            </form>
                        </Col>
                        <Col className='text-end'>검색수: {total}건</Col>
                    </Row>
                    <hr/>
                    <Row>
                        {images.map(img =>
                            <Col lg={2} md={3} sm={4} key={img.thumbnail_url} className='mb-3'>
                                <Card className='p-2'>
                                    <input onChange={(e)=> onChangeSingle(e, img.thumbnail_url)}
                                        type="checkbox" checked={img.checked}/>
                                    <img onClick={()=> setBox({url:img.image_url, show:true})}
                                        src={img.thumbnail_url} width="100%" style={{cursor:'pointer'}}/>
                                </Card>
                            </Col>
                        )}
                    </Row>
                    <div className='text-center'>
                        <Button onClick={()=> navigate(`/image?query=${query}&page=${page-1}`)}
                            disabled={page === 1} variant='outline-success'>이전</Button>
                        <span className='mx-3'>{page} / {Math.ceil(total/12)}</span>
                        <Button onClick={()=> navigate(`/image?query=${query}&page=${page+1}`)}
                            disabled={end} variant='outline-success'>다음</Button>
                    </div>
                    <ImageModal box={box} setBox={setBox}/>
                </>
            }
        </div>
    )
}

export default ImageSearch