import React from 'react';
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
} from 'mdb-react-ui-kit';
import '../css/OrderSummary.css'; // Import your CSS file here if needed

const OrderSummary = ({ finalOrder, totalPrice }) => {
  const orderDate = new Date().toLocaleDateString();

  return (
    <section className="h-100 gradient-custom" style={{ backgroundColor: "#f5f5f5" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="10" xl="8">
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
                        ${parseFloat(totalPrice).toFixed(2)}
                      </li>
                      <li className="text-muted ms-3 mt-2">
                        <span className="text-black me-4">Tax (15%)</span>
                        ${parseFloat(totalPrice * 0.15).toFixed(2)}
                      </li>
                    </MDBTypography>
                  </MDBCol>
                  <MDBCol xl="6">
                    <p className="text-black float-end">
                      <span className="text-black me-3">Total Amount</span>
                      <span style={{ fontSize: "25px" }}>
                        ${(parseFloat(totalPrice) + parseFloat(totalPrice * 0.15)).toFixed(2)}
                      </span>
                    </p>
                  </MDBCol>
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
                  <MDBTypography className="text-muted mb-0">
                    Order Date: {orderDate}
                  </MDBTypography>
                  <MDBBtn className="text-capitalize" style={{ backgroundColor: "#60bdf3" }}>
                    Pay Now
                  </MDBBtn>
                </div>
              </MDBCardFooter>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default OrderSummary;
