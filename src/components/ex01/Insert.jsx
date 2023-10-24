import React, { useState } from 'react'

const Insert = ({onInsert}) => {
    const [form, setForm] = useState({ //값을 넣어줄땐 (), 배열은 [], 오브젝트는 {}
        id: 5,
        name: "무기명",
        address: "서울 금천구 가산동"
    });

    const {id, name, address} = form; //form에 들어있는 값을 각각 할당
    const onSubmit = (e) =>{
        e.preventDefault();

        if(window.confirm('등록할까요?')){
            onInsert(form);
            setForm({ //insert 후 값 초기화
                id: id+1,
                name: '',
                address: ''
            })
        }
    }

    //change 함수
    const onChange = (e) =>{
        setForm({
            ...form, //원래있던 값을 그대로 사용(복사)
            [e.target.name] : e.target.value  // 새로운 name에 새로운 value값
        })
    }

    return (
        <div>
            <h1>주소등록</h1>
            <form onSubmit={(e)=>onSubmit(e)}>
                <h3>아이디: {id}</h3>
                <input value={name} name="name" onChange={(e)=> onChange(e)}/>
                {name}
                <hr />
                <input value={address} name="address" onChange={(e)=> onChange(e)}/>
                {address}
                <hr />
                <button>등록</button>
                <button type="reset">취소</button>
            </form>
        </div>
    )
}

export default Insert