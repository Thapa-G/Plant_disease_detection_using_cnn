import React, { useState , useEffect} from 'react'; 
import axios from 'axios';
import getCsrfToken from './cssrf';
const Train = () => {
  const [formData, setFormData] = useState({
    kernelSize: 3,
    stride: 1,
    learningRate: 0.0001,
    gamma: 0.01,
    numEpochs: 12,
  });
  const [csrftoken, setCsrfToken] = useState('');
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = await getCsrfToken();
        setCsrfToken(token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const [trainingResults, setTrainingResults] = useState(null); // State to store the training results

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Donot change tab while training.");
    try {
      // Prepare the data to send to the backend
      const formDataToSend = {
        kernelSize: formData.kernelSize,
        stride: formData.stride,
        learningRate: formData.learningRate,
        gamma: formData.gamma,
        numEpochs: formData.numEpochs,
      };

      // Sending data to the backend (Django API)
      const response = await axios.post('http://localhost:8000/app/train/', formDataToSend,{
        headers: {
          'X-CSRFToken': csrftoken,
        },
        withCredentials: true,
      });

      // Storing the response data in state to render the table
      setTrainingResults(response.data);
      alert('Training started successfully');
    } catch (error) {
      console.error('There was an error!', error);
      alert('An error occurred during the training request');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Training Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="kernelSize">Kernel Size</label>
          <input
            type="number"
            name="kernelSize"
            value={formData.kernelSize}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="stride">Stride</label>
          <input
            type="number"
            name="stride"
            value={formData.stride}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="learningRate">Learning Rate</label>
          <input
            type="number"
            name="learningRate"
            step="0.0001"
            value={formData.learningRate}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="gamma">Gamma</label>
          <input
            type="number"
            name="gamma"
            step="0.1"
            value={formData.gamma}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="numEpochs">Number of Epochs</label>
          <input
            type="number"
            name="numEpochs"
            value={formData.numEpochs}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Training
        </button>
      </form>

      {/* Table to display the training results */}
      {trainingResults && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Training Results</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Epoch</th>
                <th className="px-4 py-2 border">Train Loss</th>
                <th className="px-4 py-2 border">Validation Loss</th>
                <th className="px-4 py-2 border">Accuracy</th>
                <th className="px-4 py-2 border">Precision</th>
                <th className="px-4 py-2 border">Recall</th>
                <th className="px-4 py-2 border">F1 Score</th>
              </tr>
            </thead>
            <tbody>
              {trainingResults.epoch.map((epoch, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{epoch}</td>
                  <td className="px-4 py-2 border">{trainingResults.train_loss[index].toFixed(4)}</td>
                  <td className="px-4 py-2 border">{trainingResults.val_loss[index].toFixed(4)}</td>
                  <td className="px-4 py-2 border">{trainingResults.accuracy[index].toFixed(4)}</td>
                  <td className="px-4 py-2 border">{trainingResults.precision[index].toFixed(4)}</td>
                  <td className="px-4 py-2 border">{trainingResults.recall[index].toFixed(4)}</td>
                  <td className="px-4 py-2 border">{trainingResults.f1_score[index].toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Train;

