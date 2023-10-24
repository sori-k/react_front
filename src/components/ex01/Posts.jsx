import React, { useEffect, useState } from 'react'
import {Table, Button, Spinner} from 'react-bootstrap'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const getPosts = () =>{
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => {
            const start = (page-1)*10 + 1;
            const end = page*10;

            let newJson = json.filter(j => j.id >= start && j.id <= end);
            newJson = (newJson.map(j => j && {...j, show:false}));
            //반복하면서 원래있던 값에 show라는 키를 추가하겠다. true이면 보이고, false는 안보이게
            console.log(newJson);

            setPosts(newJson);
            setLoading(false);
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
    }, [page]);

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