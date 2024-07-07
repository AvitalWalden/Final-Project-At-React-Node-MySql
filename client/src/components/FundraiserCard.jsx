import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

function FundraiserCard({ fundraiser, setFundraisers, fundraisers }) {
    const [loading, setLoading] = useState(false);

    const handleFundraiserStatus = async (status) => {
        setLoading(true);
        const updatedFundraiser = {
            ...fundraiser,
            status: status,
        };
        try {
            const fundraiserResponse = await fetch(`http://localhost:3000/fundraisers/status/${fundraiser.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedFundraiser),
            });
            if (!fundraiserResponse.ok) {
                throw new Error('Failed to update fundraiser');
            }
            const updatedData = await fundraiserResponse.json();
            const updatedFundraisers = fundraisers.map(f => f.user_id === fundraiser.user_id ? updatedData : f);
            setFundraisers(updatedFundraisers);
        } catch (error) {
            console.error('Error updating fundraiser status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ borderRadius: '15px', marginTop: '5px' }}>
            <div className="card-body p-4">
                <div className="d-flex">
                    <div className="flex-shrink-0">
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                            alt="Generic placeholder image"
                            className="img-fluid"
                            style={{ width: '180px', borderRadius: '10px' }}
                        />
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h5 className="mb-1">{fundraiser.user_id}</h5>
                        <h5 className="mb-1">{fundraiser.name}</h5>
                        <p className="mb-2 pb-1" style={{ color:'#3B71CA' }}>{fundraiser.status}</p>
                        <div className="d-flex justify-content-start rounded-3 p-2 mb-2 bg-body-tertiary">
                            <div>
                                <p className="small text-muted mb-1">Bonus</p>
                                <p className="mb-0">{fundraiser.bonus}</p>
                            </div>
                            <div className="px-3">
                                <p className="small text-muted mb-1">Debt</p>
                                <p className="mb-0">{fundraiser.debt}</p>
                            </div>
                            <div>
                                <p className="small text-muted mb-1">People Fundraised</p>
                                <p className="mb-0">{fundraiser.people_fundraised}</p>
                            </div>
                        </div>
                        <div className="d-flex pt-1">
                            <button
                                type="button"
                                className="btn btn-outline-primary me-1 flex-grow-1"
                                onClick={() => handleFundraiserStatus(fundraiser.status === 'pending' || fundraiser.status === 'blocked' ? 'approved' : 'pending')}
                                disabled={loading}
                            >
                                {loading && <Spinner animation="border" size="sm" />} &nbsp;
                                {fundraiser.status === 'pending' && 'Approved'}
                                {fundraiser.status === 'blocked' && 'Approved'}
                                {fundraiser.status === 'approved' && 'Pending'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary flex-grow-1"
                                onClick={() => handleFundraiserStatus(fundraiser.status === 'pending' ? 'blocked' : fundraiser.status === 'blocked' ? 'pending' : 'blocked')}
                                disabled={loading}
                            >
                                {loading && <Spinner animation="border" size="sm" />} &nbsp;
                                {fundraiser.status === 'pending' && 'Blocked'}
                                {fundraiser.status === 'blocked' && 'Pending'}
                                {fundraiser.status === 'approved' && 'Blocked'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FundraiserCard;