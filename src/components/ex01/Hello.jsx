const Hello = ()=>{
    return( //리턴은 하나로 묶어서, 태그 사용하고 싶지 않을때는 빈태그 사용 <></>
        <>
            <div><h1>안녕하세요.</h1></div>
            <div><h2>저는 홍길동입니다.</h2></div>
        </>
    )
}

export default Hello; //Hello함수형 컴포넌트를 외부에서도 사용하겠다.