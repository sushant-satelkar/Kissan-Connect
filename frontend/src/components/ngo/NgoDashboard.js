import React, { useState } from 'react';
import '../../styles/ngo/NgoDashboard.css';

// NGO Data
const MAHARASHTRA_NGOS = [
  {
    id: 1,
    name: 'BAIF Development Research Foundation',
    mission: 'BAIF works towards sustainable livelihood for rural farmers through various agricultural interventions and technologies.',
    support: 'They provide technical support, training, and resources for improved farming practices and livestock development.',
    applyInstructions: 'Contact via email at info@baif.org.in or visit their website at baif.org.in for more information on their farmer support programs.'
  },
  {
    id: 2,
    name: 'Dharamitra',
    mission: 'Promoting sustainable agriculture and natural resource management in Maharashtra.',
    support: 'Training on organic farming methods, soil conservation techniques, and water management systems.',
    applyInstructions: 'Visit their center in Wardha, Maharashtra or email at dharamitra.wardha@gmail.com to register for their programs.'
  },
  {
    id: 3,
    name: 'WOTR (Watershed Organisation Trust)',
    mission: 'Focusing on watershed development and climate change adaptation in drought-prone areas of Maharashtra.',
    support: 'Water conservation infrastructure, sustainable agriculture training, and climate-resilient farming practices.',
    applyInstructions: 'Apply through your local gram panchayat or contact directly at info@wotr.org for inclusion in their watershed programs.'
  }
];

const INDIA_NGOS = [
  {
    id: 4,
    name: 'Digital Green',
    mission: 'Using technology to empower smallholder farmers across India with knowledge sharing and market access.',
    support: 'Video-based training on agricultural best practices, market linkages, and digital platforms for farmers.',
    applyInstructions: 'Join through partner organizations in your region or contact them at info@digitalgreen.org to express interest in their programs.'
  },
  {
    id: 5,
    name: 'Action for Social Advancement (ASA)',
    mission: 'Working with tribal and rural communities across multiple states for sustainable livelihoods.',
    support: 'Farmer producer organizations, irrigation systems, and sustainable agriculture training programs.',
    applyInstructions: 'Contact through their website asa.org.in or visit one of their field offices to register for support programs.'
  },
  {
    id: 6,
    name: 'PRADAN (Professional Assistance for Development Action)',
    mission: 'Enabling poor rural families across India to live a life of dignity.',
    support: 'Forming women\'s self-help groups, providing technical assistance for agriculture, and establishing market linkages.',
    applyInstructions: 'Reach out to local PRADAN teams in your district or email info@pradan.net for information on joining their programs.'
  }
];

const NgoDashboard = () => {
  const [selectedNgo, setSelectedNgo] = useState(null);

  const openQuickApplyForm = () => {
    window.open('https://forms.gle/StHZYnCqyt1mcATJ6', '_blank');
  };

  const openNgoDetails = (ngo) => {
    setSelectedNgo(ngo);
  };

  const closeModal = () => {
    setSelectedNgo(null);
  };

  return (
    <div className="ngo-dashboard">
      <div className="dashboard-header">
        <h1>NGO Support Dashboard</h1>
        <p>Connect with NGOs that support farmers and sustainable agriculture</p>
      </div>

      <div className="quick-apply-section">
        <h2>Quick Apply</h2>
        <p>Apply to all participating NGOs with a single form</p>
        <button 
          className="quick-apply-button" 
          onClick={openQuickApplyForm}
        >
          Quick Apply
        </button>
      </div>

      <div className="custom-apply-section">
        <h2>Custom Apply</h2>
        <p>Choose specific NGOs to learn about and apply directly</p>

        <div className="ngo-categories">
          <div className="ngo-category">
            <h3>NGOs in Maharashtra</h3>
            <div className="ngo-list">
              {MAHARASHTRA_NGOS.map(ngo => (
                <button 
                  key={ngo.id} 
                  className="ngo-button"
                  onClick={() => openNgoDetails(ngo)}
                >
                  {ngo.name}
                </button>
              ))}
            </div>
          </div>

          <div className="ngo-category">
            <h3>NGOs working across India</h3>
            <div className="ngo-list">
              {INDIA_NGOS.map(ngo => (
                <button 
                  key={ngo.id} 
                  className="ngo-button"
                  onClick={() => openNgoDetails(ngo)}
                >
                  {ngo.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NGO Details Modal */}
      {selectedNgo && (
        <div className="ngo-modal-overlay" onClick={closeModal}>
          <div className="ngo-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>
            <h2>{selectedNgo.name}</h2>
            <div className="ngo-modal-content">
              <div className="ngo-details-section">
                <h3>Mission</h3>
                <p>{selectedNgo.mission}</p>
              </div>
              <div className="ngo-details-section">
                <h3>Support Provided</h3>
                <p>{selectedNgo.support}</p>
              </div>
              <div className="ngo-details-section">
                <h3>How to Apply</h3>
                <p>{selectedNgo.applyInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboard; 