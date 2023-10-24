import './App.css'; // ./ 현재폴더
import Posts from './components/ex01/Posts';
import Product from './components/ex01/Product';

const App = () =>{ //컴포넌트
    return (
        <div className="App">
            <Product/>
        </div>
    );
}

export default App;