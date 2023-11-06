import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Spinner } from 'react-bootstrap'
import Pagination from 'react-js-pagination';
import '../Pagination.css';
import OrderModal from './OrderModal';

const OrderList = () => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const navi = useNavigate();

    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const size=5;

    const getPurchase = async() => {
        setLoading(true);
        const res = await axios.get(`/orders/list/purchase.json?uid=${sessionStorage.getItem("uid")}&page=${page}&size=${size}`);
        //console.log(res.data);
        setList(res.data.list); //특정 페이지
        setTotal(res.data.total); //전체 주문목록
        setLoading(false);
    }

    useEffect(()=> {
        getPurchase();
    }, [location]);

    const onChangePage = (page) => {
        navi(`/orders/list?page=${page}`);
    }

    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문목록</h1>
            <Table bordered striped hover>
                <thead>
                    <tr className='text-center'>
                        <th>주문번호</th>
                        <th>주문일</th>
                        <th>전화</th>
                        <th>금액</th>
                        <th>주문상태</th>
                        <th>주문상품</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(p=>
                        <tr key={p.pid} className='text-center'>
                            <td>{p.pid}</td>
                            <td>{p.fmtdate}</td>
                            <td>{p.rphone}</td>
                            <td className='text-end'>{p.fmtsum}원</td>
                            <td>{p.str_status}</td>
                            <td><OrderModal purchase={p} sum={p.fmtsum}/></td>
                            {/* 받을때는 purchase로 받아야함 */}
                        </tr>
                    )}
                </tbody>
            </Table>
            {total > size &&
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

export default OrderList