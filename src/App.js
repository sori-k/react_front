import './App.css'; // ./ 현재폴더
//import Posts from './components/ex01/Posts';
//import Product from './components/ex01/Product';
//import RouterPage from './components/ex02/RouterPage';
//import BookSearch from './components/ex03/BookSearch';
//import RouterPage from './components/ex03/RouterPage';
import HeaderPage from './components/shop/HeaderPage';
import { Container } from 'react-bootstrap'
import RouterPage from './components/shop/RouterPage';
import { useState } from 'react';
import { BoxContext } from './components/shop/BoxContext';
import BoxModal from './components/shop/BoxModal';

const App = () =>{ //컴포넌트
    const background = "/images/header01.png";
    
    const [box, setBox] = useState({
        show: false,
        message: '',
        action: null
    });

    return (
            <BoxContext.Provider value={{box, setBox}}>
                <Container>
                    <img src={background} width="100%"/>
                    <HeaderPage/>
                    <RouterPage/>
                    {box.show && <BoxModal/>}  {/* <- 모든 컴포넌트에서 사용하기 위해 */}
                </Container>
            </BoxContext.Provider>
    );
}

export default App;