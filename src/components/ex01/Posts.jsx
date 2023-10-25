import React, { useEffect, useState } from 'react'
import {Table, Button, Spinner} from 'react-bootstrap'

const Posts = () => {
    const [posts, setPosts] = useState([]); //useState -> 값을 저장할 수 있는 변수 (배열, 객체, 숫자/문자, 배열안 오프젝트까지 모두 저장가능)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const getPosts = () =>{
        setLoading(true); //로딩중
        fetch('https://jsonplaceholder.typicode.com/posts') //fetcn (자바스크립트 함수) / $.ajax (제이쿼리 함수)
        .then(response => response.json()) //response 타입을 json으로 바꿔서 넣어준다.
        .then(json => {
            const start = (page-1)*10 + 1;
            const end = page*10;

            let newJson = json.filter(j => j.id >= start && j.id <= end);
            newJson = (newJson.map(j => j && {...j, show:false}));
            //반복하면서 원래있던 값에 show라는 키를 추가하겠다. true이면 보이고, false는 안보이게
            console.log(newJson);

            setPosts(newJson);
            setLoading(false); //로딩 끝
        });
    }

    //title 클릭했을때 함수
    const onClickTitle = (id) =>{ //title을 클릭했을때, 몇번째꺼를 했는지 아는것
        const newPosts = posts.map(p => p.id === id ? {...p, show:!p.show} : p); //삼항연산자 true면 기존꺼에 !p.show 반대로하겠다.
                        //p.id 는 하나씩꺼내온 id (반복하는 거), id는 새로운
        setPosts(newPosts); 

    }

    useEffect(() =>{
        getPosts();
    }, [page]); //page가 바뀔때마다 호출하기

    if(loading) return(
        <div className='text-center'>
            <Spinner variant='success'/>
            <h5>로딩중입니다....</h5>
        </div>
    );


    return (
        <div>
            <h1 className='text-center my-3'>Posts</h1>
            <Table striped className='text-center'>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post =>
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>
                                <div onClick={()=> onClickTitle(post.id)}
                                    style={{color:'blue', cursor:'pointer'}}>{post.title}</div>
                                {post.show && <div>{post.body}</div>}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button variant='success' onClick={()=> setPage(page-1)} disabled={page===1}>이전</Button>
                <span className='mx-4'>{page} / 10</span>
                <Button variant='success' onClick={()=> setPage(page+1)} disabled={page===10}>다음</Button>
            </div>
        </div>
    )
}

export default Posts