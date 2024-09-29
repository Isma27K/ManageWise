import React from 'react';
import Nav from "../../components/nav/nav.component";
import Dashboard from "../../components/dashboard/dashboard.component";
import Footer from '../../components/footer/footer.component.jsx';


const Home = () => {
    return (
        <div>
            <Nav />
            <div style={{ paddingTop: '10vh' }}> {/* Adjust this value based on your nav height */}
                <Dashboard />
            </div>
            <Footer />
        </div>
    )
}

export default Home;
