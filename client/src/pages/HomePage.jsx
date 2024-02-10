import React from 'react'
import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import backgroundImage from '../images/backgroundImage.jpeg';

const HomePage = () => {
  return (
    <div className='home-page'>
      {/* Header starts */}
      <Header />
      {/* Header ends */}


      {/* Menu starts */}
      <Menu />
      {/* Menu ends */}


      {/* Slideshow starts */}

      {/* Slideshow ends */}


      {/* Content starts */}
      <div className="content">

      </div>
      {/* Content ends */}


      {/* Footer starts */}
      <Footer />
      {/* Footer ends */}

    </div>
  )
}

export default HomePage