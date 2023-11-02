import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Spinner, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BoxContext } from '../BoxContext';

const MyPage = () => {
    const {box, setBox} = useContext(BoxContext);

    const navi = useNavigate();
    const ref_file = useRef(null); //이미지 선택하는
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({ // [] 여러명, {} 한사람에 대한 여러가지 정보
        uid: '',
        upass:'',
        uname:'',
        phone:'',
        address1:'',
        address2:'',
        fmtdate:'',
        fmtmodi:'',
        photo:'', //파일이름
        file:null //실제 업로드 파일
    });

    const {uid, upass, uname, phone, address1, address2, fmtdate, fmtmodi, photo, file} = user;  //비구조할당 (유저에 있는 키를 각각 할당해줌)

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
        setUser({
            ...user,
            photo: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        })
    }

    //이미지 업로드 함수(수정 눌렀을때)
    const onUpdatePhoto = async() => {
        if(!file){
            //alert("수정할 사진을 선택하세요.");
            setBox({
                show: true,
                message: '수정할 사진을 선택하세요.',
            });
        }else{
            /*
            if(window.confirm("변경된 사진을 저장할까요?")){
                //사진 저장
                const formData = new FormData(); //새로운 클래스 생성
                formData.append("file", file); //file을 users의 file에 넣겠다.
                formData.append("uid", uid);
                await axios.post("/users/update/photo", formData);
                alert("사진이 변경되었습니다.");
            }*/
            setBox({
                show: true,
                message: '변경된 사진을 저장할까요?',
                action: async() => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("uid", uid);
                    await axios.post("/users/update/photo", formData);
                    
                    setBox({show: true, message:'사진이 변경되었습니다.'})
                }
            })
        }
    }

    if(loading) return <div className='my-5 text-center'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>마이페이지</h1>
            <Row className='justify-content-center mx-3'>
                <Col md={6}>
                    <Card className='text-center p-3'>
                        <div>
                            <img onClick={()=> ref_file.current.click()} 
                                src={photo || "http://via.placeholder.com/100x150"} width="100" className='photo'/>
                            <input type="file" ref={ref_file} onChange={onChangeFile} style={{display:'none'}}/>
                            <br/>
                            <Button size="sm mt-2" variant='outline-success'
                                onClick={onUpdatePhoto}>이미지수정</Button>
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