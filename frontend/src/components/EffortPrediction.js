import { useState } from "react";

function EffortPrediction() {
    const [inputs, setInputs] = useState({
        TeamExp: "",
        ManagerExp: "",
        YearEnd: "",
        Length: ""
    });

    const [error, setError] = useState("");
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
        setError(""); // Clear errors on new input
    };

    const validateInputs = () => {
        const { TeamExp, ManagerExp, YearEnd, Length } = inputs;
        
        if (!TeamExp || !ManagerExp || !YearEnd || !Length) {
            return "All fields are required.";
        }

        if (isNaN(TeamExp) || isNaN(ManagerExp) || isNaN(YearEnd) || isNaN(Length)) {
            return "All inputs must be numbers.";
        }

        if (parseInt(TeamExp) < 0 || parseInt(TeamExp) > 4) {
            return "Team Experience must be between 0 and 4 years.";
        }

        if (parseInt(ManagerExp) < 1 || parseInt(ManagerExp) > 7) {
            return "Manager Experience must be between 1 and 7 years.";
        }

        if (parseInt(YearEnd) < 0 || parseInt(YearEnd) > 99) {
            return "Year-End must be between 00 and 99 (e.g. 24 for 2024).";
        }

        if (parseInt(Length) <= 0) {
            return "Project Length must be greater than 0 months.";
        }

        return "";
    };

    const handleSubmit = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            setPrediction(null);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/predict_effort", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    TeamExp: parseInt(inputs.TeamExp),
                    ManagerExp: parseInt(inputs.ManagerExp),
                    YearEnd: parseInt(inputs.YearEnd),
                    Length: parseInt(inputs.Length)
                })
            });

            const data = await response.json();
            if (data.predicted_effort) {
                setPrediction(data.predicted_effort);
            } else {
                setError("Prediction failed. Try again.");
                setPrediction(null);
            }
        } catch (error) {
            setError("Error connecting to API.");
            setPrediction(null);
        }
    };

    return (
        <div style={{
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2>Software Development Effort Estimator</h2>

            <input 
                type="number" 
                name="TeamExp" 
                placeholder="Team Experience (0 - 4 years)" 
                value={inputs.TeamExp} 
                onChange={handleChange} 
                style={inputStyle}
            />
            <input 
                type="number" 
                name="ManagerExp" 
                placeholder="Manager Experience (1 - 7 years)" 
                value={inputs.ManagerExp} 
                onChange={handleChange} 
                style={inputStyle}
            />
            <input 
                type="number" 
                name="YearEnd" 
                placeholder="Year-End (e.g. 24 for 2024)" 
                value={inputs.YearEnd} 
                onChange={handleChange} 
                style={inputStyle}
            />
            <input 
                type="number" 
                name="Length" 
                placeholder="Length of Project (in months)" 
                value={inputs.Length} 
                onChange={handleChange} 
                style={inputStyle}
            />

            {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

            <button 
                onClick={handleSubmit} 
                style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginTop: "10px"
                }}>
                Estimate Effort
            </button>

            {prediction !== null && (
                <h3 style={{ marginTop: "20px" }}>
                    The effort required for the project is {prediction} person-hours.
                </h3>
            )}
        </div>
    );
}

// CSS-in-JS styling for input fields
const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px"
};

export default EffortPrediction;
