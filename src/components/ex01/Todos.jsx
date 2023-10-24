import React, { useState, useEffect } from 'react'
import {Table, Spinner, Button} from 'react-bootstrap'

//앞에 use가 붙은거 -> 훅 
const Todos = () => {
    const [todos, setTodos] = useState([]); 
    
    //useState -> 변수 선언할때, 
    //useEffect -> rendering 할때마다 그려주는..

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const getTodos = () =>{
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(json => {
            const start = (page-1) *10 + 1;
            const end = page*10;

            const newJson = json.filter(j => j.id >= start && j.id <= end);
            setTodos(newJson);
            console.log(newJson);
            setLoading(false);
        });
    }

    useEffect(() =>{ //랜더링하기 전에 실행됨
        getTodos();
    }, [page]); //page가 바뀔 때마다 getTodos() 를 실행해라

    if(loading) return(
        <div className='text-center my-5'>
            <Spinner variant="primary"/>
            <h5>로딩중입니다...</h5>
        </div>
    );

    return (
        <div className='m-5'>
            <h1 className='text-center my-5'>Todos</h1>
            <Table borderd>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                    {todos.map(todo =>
                        <tr key={todo.id}>
                            <td>{todo.id}</td>
                            <td>{todo.title}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button variant='outline-success' onClick={()=> setPage(page-1)} disabled={page===1}>
                    이전</Button>
                <span className='mx-3'>{page}/20</span>
                <Button variant='outline-success' onClick={()=> setPage(page+1)} disabled={page===20}>
                    다음</Button>
            </div>
        </div>
    )
}

export default Todos

// a === b 같은때, a !== b 같지 않다.