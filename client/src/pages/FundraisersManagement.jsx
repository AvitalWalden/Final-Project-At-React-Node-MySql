import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundraiserCard from '../components/FundraiserCard';
import { UserContext } from './UserContext';

function FundraisersManagement() {
  const [fundraisers, setFundraisers] = useState([]);
  const { refreshAccessToken } = useContext(UserContext);

  const handleGetFundraiser = () => {
    fetch('http://localhost:3000/fundraisers', {
      method: "GET",
      credentials: "include"
    })
      .then(async response => {
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Refreshing token and retrying...');
            await refreshAccessToken();
            return handleGetFundraiser();
          }
          if (response.status === 402) {
            console.log('NO Acsses...');
            return;
          }
          if (response.status === 403) {
            console.log('invalid token you cannot do it...');
            return;
          }
          if (response.status === 400) {
            console.log("Fill in the data")
            return;
          }
        }
        else {
          const data =await response.json();

          setFundraisers(data)
        }
      }).catch(error =>  console.log('Error fetching fundraisers:', error));
  }

  useEffect(() => {
    handleGetFundraiser();
  }, []);

  return (
    <section className="w-100 px-4 py-5" style={{ backgroundColor: 'white', borderRadius: '.5rem .5rem 0 0', marginTop: '50px' }}>
      <div className="row d-flex justify-content-center">
        {fundraisers && fundraisers.map((fundraiser, index) => (
          <div key={index} className="col-md-9 col-lg-7 col-xl-6">
            <FundraiserCard fundraiser={fundraiser} setFundraisers={setFundraisers} fundraisers={fundraisers} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FundraisersManagement;
