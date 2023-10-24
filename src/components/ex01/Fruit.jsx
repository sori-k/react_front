import React, { useState } from 'react'

const Fruit = () => {
    const [fruit, setFruit] = useState([
        {"id": 1, "name": "사과", "price": 2000},
        {"id": 2, "name": "오렌지", "price": 2500},
        {"id": 3, "name": "복숭아", "price": 3000}
    ]);

    const [form, setForm] = useState({
        id:4,
        name:'',
        price:0
    });

    const onSubmit = (e) =>{
        e.preventDefault();
        setFruit(fruit.concat(form));
        alert("추가!");
        setForm({
            id: id+1,
            name:'',
            price:0
        })
        
    }

    const {id, name, price} = form;

    const onChange = (e) =>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
    return (
        <div>
            <h1>과일</h1>
            <div>
                <form onSubmit={onSubmit}>
                    <h2>아이디: {id}</h2>
                    <input name="name" placeholder='과일이름' value={name} onChange={onChange}/>
                    <input name="price" placeholder='가격' value={price} onChange={onChange}/>
                    <button>추가</button>
                </form>
            </div>
            <table>
                {fruit.map(f=>
                    <tr key={f.id}>
                        <td>{f.id}</td>
                        <td>{f.name}</td>
                        <td>{f.price}</td>
                    </tr>
                )}
            </table>
        </div>
    )
}

export default Fruit