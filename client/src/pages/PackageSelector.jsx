import React, { useContext, useState, useEffect } from 'react';
import '../css/PackageSelector.css';
import Package from '../components/package';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';

const PackageSelector = () => {
  const [packages, setPackages] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null)
  const { selectedPackage, setSelectedPackage, order } = useContext(OrderContext);
  const { refreshAccessToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGetPackages = async () => {
    try {
      const res = await fetch(`http://localhost:3000/packages`, {
        method: "GET",
        credentials: "include"
      });
  
      if (!res.ok) {
        // if (res.status === 401) {
        //   console.log('Refreshing token and retrying...');
        //   await refreshAccessToken();
        //   return handleGetPackages(); // Retry after refreshing token}
         if (res.status === 403) {
          console.log('Invalid token, you cannot do it...');
          throw new Error('Access forbidden');
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      }
  
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    }
  };
  
  useEffect(() => {
    handleGetPackages();
  }, []);
  
  const handleModalClose = () => {
    setIsModal(false);
  };

  const handleModalOpen = (pkg) => {
    setCurrentPackage(pkg)
    setIsModal(true);
  };
  const handleStartShopping = (currentPackage) => {
    if (selectedPackage) {
      let totalSelectedQuantity = 0;
      order.forEach((gift) => {
        if (gift.isChecked) {
          totalSelectedQuantity += gift.quantity;
        }
      });
      if (totalSelectedQuantity > selectedPackage.amount) {
        alert(`You can only select up to ${selectedPackage.amount} gifts.
          delete ${totalSelectedQuantity - selectedPackage.amount} gifts and try again later`);
        return;
      }
    }
    setSelectedPackage(currentPackage);
    navigate("/gifts")
  };
  return (
    <div className="package-selector">
      <h2>Select a Package</h2>
      { packages.map((pkg) => (
        <div className="package-card" key={pkg.package_id} onClick={() => handleModalOpen(pkg)}>
          <img src={`http://localhost:3000/images/${pkg.image_url}`} alt={pkg.name} />
          <h1>{pkg.name}</h1>
          <p>{pkg.short_description}</p>
          <p className="price">{pkg.price}$</p>
        </div>
      ))}
      {isModal && currentPackage &&
        <Package
          packageDetails={currentPackage}
          onClose={handleModalClose}
          onStartShopping={() => handleStartShopping(currentPackage)}
        />
      }
    </div>
  );
};

export default PackageSelector;
