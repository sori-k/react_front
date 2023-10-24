import React, { useState } from 'react'
import '../../App.css'

const Count = () => {
    const [count, setCount] = useState(100); // 값이 바뀌면 새롭게 바뀌는..(출력을 알아서) state 변수 (const, let과 같은 변수)
    //    변수, 값을 바꿔줄때 사용하는 함수
    return (
        <div className='count'>
            <button className='button' onClick={()=>setCount(count-1)}>감소</button>
            <span className='text'>{count}</span>
            <button className='button' onClick={()=>setCount(count+1)}>증가</button>
        </div>
    )
}

export default Count;