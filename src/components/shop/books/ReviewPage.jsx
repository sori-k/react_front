import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import '../Pagination.css';
import {BoxContext} from '../BoxContext';

const ReviewPage = ({location, setBook, book}) => {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const size = 5;
    const {bid} = useParams();
    const [total, setTotal] = useState(0);
    const [contents, setContents] = useState('');

    const {box, setBox} = useContext(BoxContext);
    
    const getReviews = async() => {
        const url = `/review/list.json?page=${page}&size=${size}&bid=${bid}`;
        const res = await axios(url);
        console.log(res.data);
        let list = res.data.list;
        list = list.map(r=> r && {...r, ellipsis:true, edit:false, text:r.contents});
        setReviews(list);
        setTotal(res.data.total);
        setBook({...book, rcnt:res.data.total});
    }

    useEffect(()=> {
        getReviews();
    }, [page]);


    const onClickWrite = () => {
        sessionStorage.getItem("target", location.pathname);
        window.location.href="/users/login";
    }

    const onChangePage = (page) => {
        setPage(page);
    }

    const onChangeEllipsis = (rid) => {
        const list = reviews.map(r=> r.rid === rid ? {...r, ellipsis:!r.ellipsis} : r);
        setReviews(list);
    }

    //리뷰 등록버튼 눌렀을 때
    const onClickRegister = async()  => {
        if(contents == ""){
            setBox({
                show: true,
                message: '내용을 입력하세요!'
            });
        }else{
            const res = await axios.post('/review/insert', {
                uid:sessionStorage.getItem("uid"),
                bid,
                contents
            });

            if(res.data === 1){
                getReviews();
                setContents("");
            }
        }
    }

    const onClickDelete = async(rid) => {
        /*
        if(window.confirm(`${rid}번 리뷰를 삭제할까요?`)){
            const res = await axios.post('/review/delete', {rid});

            if(res.data === 1){
                getReviews();
            }
        }
        */
       setBox({
            show: true,
            message: `${rid}번 리뷰를 삭제할까요?`,
            action: async() => {
                const res = await axios.post('/review/delete', {rid});
                if(res.data === 1){
                    getReviews();
                }
            }
       })
    }

    //리뷰 수정버튼 눌렀을 때,
    const onClickUpdate = (rid) => {
        const list = reviews.map(r=> r.rid === rid ? {...r, edit:true} : r);
        setReviews(list);
    }

    //리뷰 수정
    const onChange = (e, rid) => {
        const list = reviews.map(r=> r.rid === rid ? {...r, text:e.target.value} : r);
        setReviews(list);
    }


    //리뷰 수정취소 버튼 눌렀을 때,
    const onClickCancel = (rid, text, contents) => {
        if(text != contents){ // 수정내용과 기존 수정내용이 다르면
            //if(!window.confirm("취소할까요?")) return;
            setBox({
                show: true,
                message:'취소할까요?',
                action: () => {
                    const list = reviews.map(r=> r.rid === rid ? {...r, edit:false, text:r.contents} : r);
                    setReviews(list);  
                }
            })
        }else{
            const list = reviews.map(r=> r.rid === rid ? {...r, edit:false, text:r.contents} : r);
            setReviews(list);    
        }
    }

    //리뷰 수정 저장
    const onClickSave = async(rid, text, contents) => {
        if(text === contents) return;
        /*
        if(window.confirm("수정할까요?")){
            const res = await axios.post('/review/update', {rid, contents:text});
            if(res.data === 1){
                getReviews();
            }
        }
        */
       setBox({
            show: true,
            message:'수정할까요?',
            action: async() => {
                const res = await axios.post('/review/update', {rid, contents:text});
                if(res.data === 1){
                    getReviews();
                }
            }
       });
    }

    return (
        <div>
            {!sessionStorage.getItem("uid") ? 
                <div><Button className='w-100' onClick={onClickWrite}>리뷰작성</Button></div>
                :
                <div>
                    <Form.Control value={contents} onChange={(e)=> setContents(e.target.value)}
                        as="textarea" rows={5} placeholder='내용을 입력하세요.'/>
                    <div className='text-end'>
                        <Button className='px-5' variant='outline-success' size="sm" onClick={onClickRegister}>등록</Button>
                    </div>
                </div>
            }
            {reviews.map(review=>
                <Row key={review.rid} className='mt-2'>
                    <Col xs={2} md={1} className='align-self-center'>
                        <img src={review.photo || "http://via.placeholder.com/100x100"} className='photo' width="80%"/>
                        <div className='small'>{review.uname}</div>
                    </Col>
                    <Col>
                        <div className='small'>{review.fmtdate}</div>

                        {!review.edit ?
                            <>
                            <div onClick={()=> onChangeEllipsis(review.rid)} style={{cursor:'pointer'}}
                                className={review.ellipsis && 'ellipsis2'}>[{review.rid}] {review.contents}</div>
                            
                            {sessionStorage.getItem("uid") === review.uid &&
                                <div className='text-end'>
                                    <Button onClick={()=> onClickDelete(review.rid)}
                                        variant='danger' size="sm me-2" >삭제</Button>
                                    <Button onClick={()=> onClickUpdate(review.rid)}
                                        variant='outline-secondary' size="sm">수정</Button>
                                </div>
                            }
                            </>
                            :
                            // eidt가 true일때
                            <>
                                <Form.Control onChange={(e)=> onChange(e, review.rid)}
                                    value={review.text} rows={5} as="textarea"/>
                                <div className='text-end'>
                                    <Button onClick={()=> onClickSave(review.rid, review.text, review.contents)}
                                        variant='outline-dark' size="sm me-2">저장</Button>
                                    <Button onClick={()=> onClickCancel(review.rid, review.text, review.contents)}
                                        variant='dark' size="sm">취소</Button>
                                </div>
                            </>
                        }
                    </Col>
                    <hr/>
                </Row>  
            )}
            {total > 3 && 
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

export default ReviewPage