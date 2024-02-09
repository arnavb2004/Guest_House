import react from "react";
import HomePage from "./pages/HomePage";
import Header from "./Components/Header";
import Menu from './Components/Menu';
import Footer from "./Components/Footer";
import backgroundImage from "./images/backgroundImage.jpeg";

function App() {
  return (
    <div className="App flex flex-col h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      {/* Header starts */}
      <Header />
      <Menu />
      {/* Header ends */}

      <HomePage />

      {/* Footer starts */}
      <Footer />
      {/* Footer ends */}
    </div>
  );
}

export default App;
