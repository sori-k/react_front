import './App.css'; // ./ 현재폴더
//import Posts from './components/ex01/Posts';
//import Product from './components/ex01/Product';
//import RouterPage from './components/ex02/RouterPage';
//import BookSearch from './components/ex03/BookSearch';
//import RouterPage from './components/ex03/RouterPage';
import HeaderPage from './components/shop/HeaderPage';
import { Container } from 'react-bootstrap'
import RouterPage from './components/shop/RouterPage';

const App = () =>{ //컴포넌트
    const background = "/images/header01.png";
    
    return (
        <Container>
            <img src={background} width="100%"/>
            <HeaderPage/>
            <RouterPage/>
        </Container>
    );
}

export default App;