import React, { useState } from 'react';
import '../../styles/farmer/CropHealthAnalysis.css';

const CropHealthAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG)');
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError('');
  };

  // Handle upload and analysis
  const handleAnalyze = () => {
    if (!selectedFile) {
      setError('Please select an image to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a timeout (in a real app, this would be an API call)
    setTimeout(() => {
      // Mock AI analysis result - randomly select between healthy and unhealthy
      const isHealthy = Math.random() > 0.5;
      
      let result = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        cropType: detectCropType(selectedFile.name),
      };
      
      if (!isHealthy) {
        // For unhealthy crops, add problem details
        result.problems = determineProblem();
      }
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };
  
  // Mock function to detect crop type (would be part of the AI model in production)
  const detectCropType = (filename) => {
    const cropTypes = ['Rice', 'Wheat', 'Tomato', 'Potato', 'Cotton', 'Corn', 'Soybean'];
    
    // In a real app, this would use the AI model to detect crop type
    // Here we're randomly selecting a crop type
    return cropTypes[Math.floor(Math.random() * cropTypes.length)];
  };
  
  // Mock function to determine the problem (would be part of the AI model in production)
  const determineProblem = () => {
    const problemTypes = [
      {
        type: 'disease',
        name: 'Fungal Infection',
        description: 'Fungal growth detected on leaves causing brown spots and wilting.',
        solution: 'Apply fungicide treatment and remove affected leaves. Ensure proper air circulation around plants.'
      },
      {
        type: 'pest',
        name: 'Aphid Infestation',
        description: 'Small insects feeding on plant sap, causing yellowing and curling of leaves.',
        solution: 'Apply insecticidal soap or neem oil. Introduce natural predators like ladybugs if possible.'
      },
      {
        type: 'nutrient',
        name: 'Nitrogen Deficiency',
        description: 'Yellowing of older leaves starting from the tips, stunted growth.',
        solution: 'Apply nitrogen-rich fertilizer and consider a soil test to determine exact nutrient needs.'
      },
      {
        type: 'water',
        name: 'Overwatering',
        description: 'Wilting despite wet soil, yellowing leaves, and potential root rot.',
        solution: 'Reduce watering frequency and ensure proper drainage. Allow soil to dry between waterings.'
      }
    ];
    
    // Randomly select 1-2 problems
    const numProblems = Math.floor(Math.random() * 2) + 1;
    const shuffledProblems = [...problemTypes].sort(() => 0.5 - Math.random());
    return shuffledProblems.slice(0, numProblems);
  };
  
  // Function to reset the analysis
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setAnalysisResult(null);
    setError('');
  };

  // Function to render the appropriate icon for each problem type
  const renderProblemIcon = (type) => {
    switch (type) {
      case 'disease':
        return '🦠';
      case 'pest':
        return '🐛';
      case 'nutrient':
        return '🍂';
      case 'water':
        return '💧';
      default:
        return '❓';
    }
  };

  return (
    <div className="crop-health-analysis">
      <h2>AI Crop Health Analysis</h2>
      
      <div className="analysis-container">
        <div className="upload-section">
          <div className="file-input-container">
            <input
              type="file"
              id="crop-image"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="crop-image" className="file-input-label">
              {selectedFile ? 'Change Image' : 'Upload Crop Image'}
            </label>
            
            {!selectedFile && (
              <p className="upload-instruction">Upload a clear image of your crop for AI analysis</p>
            )}
            
            {error && <p className="error-message">{error}</p>}
          </div>
          
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Crop Preview" />
              <div className="preview-actions">
                <button 
                  className="analyze-button" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Crop Health'}
                </button>
                <button className="reset-button" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
        
        {isAnalyzing && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Analyzing your crop image...</p>
          </div>
        )}
        
        {analysisResult && (
          <div className={`analysis-result ${analysisResult.status}`}>
            <h3>Analysis Results for {analysisResult.cropType}</h3>
            
            {analysisResult.status === 'healthy' ? (
              <div className="healthy-result">
                <div className="result-header">
                  <span className="status-icon">✅</span>
                  <h4>Your crop is healthy!</h4>
                </div>
                <p>Our AI analysis indicates your {analysisResult.cropType} crop is in good health.</p>
                <div className="healthy-characteristics">
                  <h5>Healthy Characteristics Detected:</h5>
                  <ul>
                    <li>Proper leaf color and development</li>
                    <li>No signs of disease or pest damage</li>
                    <li>Good growth pattern and structure</li>
                    <li>Appropriate stem thickness and strength</li>
                    <li>Normal fruit/flower development (if applicable)</li>
                  </ul>
                </div>
                <p className="recommendation">
                  Continue your current farming practices to maintain crop health.
                </p>
              </div>
            ) : (
              <div className="unhealthy-result">
                <div className="result-header">
                  <span className="status-icon">❌</span>
                  <h4>Your crop has issues!</h4>
                </div>
                <p>Our AI analysis detected the following problems with your {analysisResult.cropType} crop:</p>
                
                <div className="problems-list">
                  {analysisResult.problems.map((problem, index) => (
                    <div key={index} className="problem-item">
                      <div className="problem-header">
                        <span className="problem-icon">{renderProblemIcon(problem.type)}</span>
                        <h5>{problem.name}</h5>
                      </div>
                      <p className="problem-description">{problem.description}</p>
                      <div className="solution">
                        <h6>Recommended Solution:</h6>
                        <p>{problem.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="seek-advice">
                  For more specific advice, consider consulting with a local agricultural expert.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropHealthAnalysis; 