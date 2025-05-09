import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/NavbarComponent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RouterComponent from "./Router";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import "./form.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Navbar />
      <RouterComponent />
      <Footer />
      <Toaster />
    </Router>
  );
};

export default App;
