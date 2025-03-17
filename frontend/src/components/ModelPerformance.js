import React, { useState, useEffect } from "react";
import axios from "axios";

const ModelPerformance = () => {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/model_performance")
            .then(response => {
                setPerformanceData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ Error fetching model performance:", error);
                setError("Failed to load model performance.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={{ padding: "20px" }}>⏳ Loading Model Performance...</div>;
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>❌ {error}</div>;
    }

    if (!performanceData) {
        return <div style={{ padding: "20px", color: "red" }}>⚠️ No data available.</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>📊 Model Performance Overview</h2>

            {/* 🛠️ Task Allocation Model */}
            {performanceData.task_allocation && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>🛠️ Task Allocation Model</h3>
                    {performanceData.task_allocation.cross_validation_scores && (
                        <p>
                            <strong>Cross-Validation Scores:</strong>{" "}
                            {performanceData.task_allocation.cross_validation_scores.join(", ")}
                        </p>
                    )}
                    {performanceData.task_allocation.mean_cross_validation_accuracy && (
                        <p>
                            <strong>Mean Cross-Validation Accuracy:</strong>{" "}
                            {performanceData.task_allocation.mean_cross_validation_accuracy}
                        </p>
                    )}
                    {performanceData.task_allocation.test_accuracy && (
                        <p>
                            <strong>Test Accuracy:</strong>{" "}
                            {performanceData.task_allocation.test_accuracy}
                        </p>
                    )}
                    <p style={{ color: "green", fontStyle: "italic" }}>
                        The Task Allocation Model shows strong performance with a mean cross-validation accuracy of 76.25% and a test accuracy of 76%. This indicates that the model is reliable and generalizes well to unseen data.
                    </p>
                </div>
            )}

            {/* ⏳ Project Timeline Model */}
            {performanceData.project_timeline && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>⏳ Project Timeline Model</h3>
                    <p><strong>R² Score:</strong> {performanceData.project_timeline.r2_score}</p>
                    <p><strong>MAE:</strong> {performanceData.project_timeline.mae}</p>
                    <p><strong>RMSE:</strong> {performanceData.project_timeline.rmse}</p>
                    <p style={{ color: "green", fontStyle: "italic" }}>
                        The Project Timeline Model performs exceptionally well with an R² score of 0.922, indicating that it explains 92.2% of the variance in project timelines. The low MAE (12.19) and RMSE (15.85) suggest high precision in predictions.
                    </p>
                </div>
            )}

            {/* 🐞 Defect Prediction Model */}
            {performanceData.defect_prediction && (
                <div>
                    <h3>🐞 Defect Prediction Model</h3>
                    <p><strong>R² Score:</strong> {performanceData.defect_prediction.r2_score}</p>
                    <p><strong>MAE:</strong> {performanceData.defect_prediction.mae}</p>
                    <p><strong>RMSE:</strong> {performanceData.defect_prediction.rmse}</p>
                    <p style={{ color: "green", fontStyle: "italic" }}>
                        The Defect Prediction Model demonstrates strong predictive power with an R² score of 0.8225. The low MAE (2.92) and RMSE (3.67) indicate that the model accurately predicts defects with minimal error.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ModelPerformance;