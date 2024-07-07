import React from 'react';
import '../css/SideSlidePanel.css';
import { MdClose } from "react-icons/md";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { MDBBtn } from 'mdb-react-ui-kit';
import image from '../images/image.png'
const SideSlidePanel = ({ orders, isOpen, onClose }) => {
    return (
        <div className={`order-list ${isOpen ? 'open' : ''}`}>
            <div className="modal-header bg-info text-white">
                <h5 className="modal-title" id="exampleSideModal1">Product in the cart</h5>
                <button type="button" className="btn-close btn-close-white" data-mdb-dismiss="modal" aria-label="Close" onClick={onClose}></button>
            </div>
            {/* <div className="header"> */}
            {/* <h2>my order<RiShoppingBag2Fill /> */}
            {/* <i className="fas fa-shopping-cart fa-4x text-info"></i> */}
            {/* </h2> */}
            {/* <button className="close-button" onClick={onClose}><MdClose /> */}
            {/* </button> */}
            {/* </div> */}
            <ul className="orders">
                {orders.length == 0 ? <>
                <img className='emptyCart' src={image} alt={"empty cart"} />
                <h1>Your shopping cart is empty, go shopping...</h1>
                </>
                    :
                    orders.map((gift, index) => (
                        <li key={index}>
                            <div className="gift-info">
                                <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                                <p>Name:{gift.name}</p>
                                <p>Price:{gift.price}</p>
                                <p>Quantity:{gift.quantity}</p>
                            </div>
                        </li>
                    ))}
            </ul>
            {/* <button type="button" className="btnb btn btn-info">Go to the cart</button> */}
            {/* <button type="button" class="btn btn-outline-info" data-mdb-dismiss="modal"> */}
            {/* Close */}
            {/* </button> */}
            {/* <MDBBtn color='info'>
                Info
            </MDBBtn>
            <MDBBtn color='info'>
                Info
            </MDBBtn> */}
        </div>
    );
};

export default SideSlidePanel;
