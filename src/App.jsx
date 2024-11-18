import './data.json';
import NavBar from './Navbar';
import Product from './Product';
import './style/App.css';


const App = () => {
  
  return (
    <>
      <div >
        <NavBar />
        <div className='container'>
        <Product />

        </div>
      </div>
     
    </>
  )
}

export default App
