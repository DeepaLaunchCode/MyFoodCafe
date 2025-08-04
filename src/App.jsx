import React from 'react';
    import { Routes, Route, Link } from 'react-router-dom';

    import Navbar from './shared/Navbar';
    import Footer from './shared/Footer'; 
    import BackToTop from './shared/BackToTop';
    import Home from './components/Home';
    import AboutUs from './components/AboutUs';
    import ContactUs from './components/ContactUs';
    import Menu from './components/Menu';
    import Reviews from './components/Reviews';
    import Order from './components/OrderOnline';
    import ReserveTable from './components/TableReservation';
    import ManageReservation from './components/ManageReservation'

    import './assets/css/App.css';

    function App() {
      return (
        <div className="app-container">
         <Navbar />
         <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/orderonline" element={<Order />} />
              <Route path="/reservetable" element={<ReserveTable />} />
              <Route path="/manage-reservation" element={<ManageReservation />} />
            </Routes>
          </main>
          <div className='bottomcontainer'>
              <BackToTop />
          </div>
          <Footer />
        </div>
      );
    }

    export default App;
