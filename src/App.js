import logo from './logo.svg';
import './App.css';
import Login from "./routes/login/login.component.jsx";
import Register from "./routes/register/register.compoment.jsx";

function App() {
  return (
    <div className="App">
      {<Login />}
      {/*<Register/>*/}
    </div>
  );
}

export default App;
