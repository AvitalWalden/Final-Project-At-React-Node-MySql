import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardFooter,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from 'mdb-react-ui-kit';
import '../css/OrderSummary.css';
import { UserContext } from '../pages/UserContext';
import React, { useContext, useEffect } from 'react';

const OrderSummary = ({ finalOrder, setTotalPrice,totalPrice, handleSubmit, handlePrevSubmit, checkboxChecked,setBonusChecked,bonusChecked }) => {
  const orderDate = new Date().toLocaleDateString();
  const { user, setUser, refreshAccessToken } = useContext(UserContext);

  useEffect(() => {
    if (checkboxChecked) {
      const getFundraiser = async () => {
        try {
          const fundraiserGetResponse = await fetch(`http://localhost:3000/fundraisers/${user.user_id}`, {
            method: "GET",
            credentials: "include"
          });

          if (!fundraiserGetResponse.ok) {
            if (!response.ok) {
              if (response.status === 401) {
                console.log('Refreshing token and retrying...');
                await refreshAccessToken();
                return getFundraiser();
              }
              throw new Error('Failed to fetch fundraiser.');
            }
          }

          const data = await fundraiserGetResponse.json();
          setUser({ ...user, ...data });
        } catch (error) {
          console.error('Error during fetching fundraiser:', error);

        }
      };

      getFundraiser();
    }
  }, [checkboxChecked]);

  const handleBonusClick = async () => {
    if (  user.bonus === 0) 
    {
        alert('No bonus to applay')
        setBonusChecked(false);
       return;
    }
    if(totalPrice-user.bonus < 0){
      user.bonus -= totalPrice;
      setTotalPrice(0);
    }
    else{
      setTotalPrice(totalPrice-user.bonus)
      user.bonus =0;
    }
    setBonusChecked(true);
  }

  return (
    <MDBContainer fluid className="p-0 m-0 h-100">
      <MDBCard style={{ borderRadius: "10px" }}>
        <MDBCardHeader className="px-4 py-5">
          <MDBTypography tag="h5" className="text-muted mb-0">
            Order Summary
          </MDBTypography>
        </MDBCardHeader>
        <MDBCardBody className="p-4">
          <MDBTable hover>
            <MDBTableHead className="bg-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Description</th>
                <th scope="col">Qty</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Amount</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {finalOrder.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${parseFloat(item.price).toFixed(2)}</td>
                  <td>${parseFloat(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>

          <MDBRow className="mt-4">
            <MDBCol xl="6">
              <MDBTypography listUnStyled>
                <li className="text-muted ms-3">
                  <span className="text-black me-4">SubTotal</span>
                  {<span>${parseFloat(totalPrice).toFixed(2)}</span>}
                </li>
                <li className="text-muted ms-3 mt-2">
                  <span className="text-black me-4">Tax (15%)</span>
                  {<span>${parseFloat(totalPrice * 0.15).toFixed(2)}</span>}
                </li>
              </MDBTypography>
            </MDBCol>
            <MDBCol xl="6">
              <p className="text-black float-end">
                <span className="text-black me-3">Total Amount</span>
                {<span style={{ fontSize: "25px" }}>
                  ${(parseFloat(totalPrice) + parseFloat(totalPrice * 0.15)).toFixed(2)}
                </span>}
              </p>
            </MDBCol>
            {(checkboxChecked &&
              <MDBInput
                wrapperClass='mb-4'
                label='Bonus'
                id='form1'
                type='readOnly'
                style={{ textAlign: 'center' }}
                value={user.bonus||0}  
              />

            )}
           {(checkboxChecked && <MDBBtn onClick={handleBonusClick}>Applay Bonus</MDBBtn>)}
          </MDBRow>
        </MDBCardBody>
        <MDBCardFooter
          className="border-0 px-4 py-4"
          style={{
            backgroundColor: "#e0e0e0",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            {handlePrevSubmit &&
              <MDBBtn className="text-capitalize" style={{ backgroundColor: "#60bdf3" }} onClick={handlePrevSubmit} >
                Prev
              </MDBBtn>
            }
            <MDBTypography className="text-muted mb-0">
              Order Date: {orderDate}
            </MDBTypography>
            <MDBBtn className="text-capitalize" style={{ backgroundColor: "#60bdf3" }} onClick={handleSubmit}>
              Pay Now
            </MDBBtn>
          </div>
        </MDBCardFooter>
      </MDBCard>
    </MDBContainer>
  );
};

export default OrderSummary;
