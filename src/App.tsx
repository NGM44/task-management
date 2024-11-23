import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Router from "./routes";

function App() {
  return (
    <div>
      <Router />
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default App;
