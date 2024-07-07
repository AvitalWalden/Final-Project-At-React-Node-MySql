import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundraiserCard from '../components/FundraiserCard';

function FundraisersManagement() {
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/fundraisers')
      .then(response => response.json())
      .then(data => setFundraisers(data))
      .catch(error => console.error('Error fetching fundraisers:', error));
  }, []);

  return (
    <section className="w-100 px-4 py-5" style={{ backgroundColor: 'white', borderRadius: '.5rem .5rem 0 0' ,marginTop: '50px'}}>
      <div className="row d-flex justify-content-center">
        {fundraisers.map((fundraiser,index) => (
          <div key={index} className="col-md-9 col-lg-7 col-xl-6">
            <FundraiserCard fundraiser={fundraiser} setFundraisers={setFundraisers} fundraisers={fundraisers} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FundraisersManagement;
