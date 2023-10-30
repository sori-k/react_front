import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Spinner, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navi = useNavigate();
    const ref_file = useRef(null); //이미지 선택하는
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState("http://via.placeholder.com/100x150");

    const [user, setUser] = useState({ // [] 여러명, {} 한사람에 대한 여러가지 정보
        uid: '',
        upass:'',
        uname:'',
        phone:'',
        address1:'',
        address2:'',
        fmtdate:'',
        fmtmodi:''
    });

    const {uid, upass, uname, phone, address1, address2, fmtdate, fmtmodi} = user; 

    const getUser = async() => {
        setLoading(true);
        const res = await axios.get('/users/read/' + sessionStorage.getItem("uid")); 
                                // (`/users/read/${sessionStorage.getItem("uid")}`); 이렇게도 가능
        //console.log(res.data);
        setUser(res.data);
        setLoading(false);
    }

    useEffect(()=> {
        getUser();
    }, []);

    const onChangeFile = (e) => {
        setPhoto(URL.createObjectURL(e.target.files[0]));
    }

    if(loading) return <div className='my-5 text-center'><Spinner/></div>

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>마이페이지</h1>
            <Row className='justify-content-center mx-3'>
                <Col md={6}>
                    <Card className='text-center p-3'>
                        <div>
                            <img src={photo} onClick={()=> ref_file.current.click()}
                                width="100" className='photo' style={{cursor:'pointer'}}/>
                            <input type="file" ref={ref_file} onChange={onChangeFile} style={{display:'none'}}/>
                            <br/>
                            <Button size="sm mt-2" variant='outline-success'>이미지수정</Button>
                            <hr/>
                        </div>
                        <Col className='my-2'>
                            <div>이름: {uname}</div>
                            <div>전화: {phone}</div>
                            <div>주소: {address1} {address2}</div>
                            <div>가입일: {fmtdate}</div>
                            <div>수정일: {fmtmodi}</div>
                            <br/>
                            <Button size="sm" onClick={()=> navi('/users/update')} variant='outline-success'>정보수정</Button>
                        </Col>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default MyPage