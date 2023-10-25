import './App.css'; // ./ 현재폴더
//import Posts from './components/ex01/Posts';
//import Product from './components/ex01/Product';
//import RouterPage from './components/ex02/RouterPage';
import BookSearch from './components/ex03/BookSearch';
import { Row, Col } from 'react-bootstrap'
import RouterPage from './components/ex03/RouterPage';

const App = () =>{ //컴포넌트
    
    return (
        <div className="App">
            <RouterPage/>
        </div>
    );
}

export default App;