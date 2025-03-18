from flask import Flask, jsonify, request
from pymongo import MongoClient
import joblib
import pandas as pd
import numpy as np
import os
from bson import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define the directory where all the pre-trained models are stored
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

# Load all the machine learning models we need for predictions
# These models are pre-trained and saved as joblib files
project_timeline_model = joblib.load(os.path.join(MODEL_DIR, "best_optimized_hybrid_model.pkl"))
defect_prediction_model = joblib.load(os.path.join(MODEL_DIR, "optimized_defect_prediction_model.pkl"))
effort_prediction_model = joblib.load(os.path.join(MODEL_DIR, "effort_prediction_model.pkl"))
defect_preprocessor = joblib.load(os.path.join(MODEL_DIR, "defect_preprocessor.pkl"))
defect_encoder = joblib.load(os.path.join(MODEL_DIR, "defect_encoder.pkl"))

# Load the task allocation model and its associated metrics
task_allocation_model = joblib.load(os.path.join(MODEL_DIR, "task_allocation_model.pkl"))
accuracy_metrics = joblib.load(os.path.join(MODEL_DIR, "accuracy_metrics.pkl"))
feature_importance = joblib.load(os.path.join(MODEL_DIR, "feature_importance.pkl"))

# Load scalers and feature selection tools for project timeline and defect prediction
timeline_scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

# Connect to MongoDB using the provided connection string
# This is where all our project and team data is stored
client = MongoClient("mongodb+srv://janithchathurangakck:jani123@cluster0.ncbw8.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]
projects_collection = db["projects"]
teams_collection = db["teams"]

@app.route('/')
def home():
    """Simple home route to check if the API is running."""
    return jsonify({"message": "Flask API is running!"})


@app.route('/get_projects', methods=['GET'])
def get_projects():
    """Fetch all projects from MongoDB and ensure ObjectId fields are JSON serializable."""
    try:
        projects = list(projects_collection.find({}))

        # Convert ObjectId fields to strings
        for project in projects:
            project['_id'] = str(project['_id'])  # Convert ObjectId to string
            project['projectId'] = str(project.get('projectId', ''))  # Ensure projectId is a string
            project['members'] = str(project.get('members', ''))

        return jsonify(projects)
    except Exception as e:
        print(f"Error fetching projects: {e}")
        return jsonify({"error": "Failed to fetch projects"}), 500



@app.route('/get_teams', methods=['GET'])
def get_teams():
    """Fetch all teams from MongoDB. This is used to populate dropdowns in the frontend."""
    try:
        teams = list(teams_collection.find({}, {"_id": 0}))
        return jsonify(teams)
    except Exception as e:
        print(f"Error fetching teams: {e}")
        return jsonify({"error": "Failed to fetch teams"}), 500


@app.route('/get_project_details/<project_id>', methods=['GET'])
def get_project_details(project_id):
    """Fetch details for a specific project using its ID. This is used for predictions."""
    try:
        project_data = projects_collection.find_one({"projectId": str(project_id)})
        
        if not project_data:
            return jsonify({"error": f"Project ID {project_id} not found"}), 404

        # Convert _id to a string to avoid serialization issues
        if "_id" in project_data:
            project_data["_id"] = str(project_data["_id"])
            project_data['projectId'] = str(project_data.get('projectId', ''))  
            project_data['members'] = str(project_data.get('members', ''))

        return jsonify(project_data)
    
    except Exception as e:
        print(f"Error fetching project details: {e}")
        return jsonify({"error": "Failed to fetch project details"}), 500


@app.route('/predict', methods=['POST'])
def predict():
    """Predict the project timeline and defect count for a given project."""
    try:
        data = request.json
        project_id = data.get("project_id")

        # Fetch project data from MongoDB using correct key `projectId`
        project_data = projects_collection.find_one({"projectId": str(project_id)})

        if not project_data:
            return jsonify({"error": "Project not found in MongoDB"}), 404

        # Convert `_id` to a string to avoid serialization issues
        if "_id" in project_data:
            project_data["_id"] = str(project_data["_id"])

        # Prepare input for project timeline prediction
        project_timeline_input = [
            project_data.get("team_size", 0),
            project_data.get("task_count", 0),
            project_data.get("developer_experience", 0),
            project_data.get("priority_level", 0),
            project_data.get("task_complexity", 0),
            project_data.get("project_size", 0),
            project_data.get("testing_coverage", 0),
            project_data.get("Effort_Density", 0),
            project_data.get("Team_Productivity", 0),
            project_data.get("LoC_per_Team_Member", 0)
        ]

        # Scale the input data for the timeline model
        scaled_timeline_input = timeline_scaler.transform([project_timeline_input])
        project_timeline_pred = project_timeline_model.predict(scaled_timeline_input)[0]

        # Adjust the timeline prediction based on the impact factor
        impact_factor = project_data.get("change_impact_factor", 1.0)
        adjusted_timeline_pred = project_timeline_pred * impact_factor

        # Prepare input for defect prediction
        defect_prediction_input = pd.DataFrame([{
            "defect_fix_time_minutes": project_data.get("defect_fix_time_minutes", 0),
            "size_added": project_data.get("size_added", 0),
            "size_deleted": project_data.get("size_deleted", 0),
            "size_modified": project_data.get("size_modified", 0),
            "effort_hours": project_data.get("effort_hours", 0),
            "complexity_score": project_data.get("task_complexity", 0),
            "testing_coverage": project_data.get("testing_coverage", 0),
            "team_key": str(project_data.get("team_key", "0")).strip()  # ✅ Remove extra spaces
        }])

        # Encode the `team_key` column for defect prediction
        defect_prediction_input["team_key_encoded"] = defect_encoder.transform(defect_prediction_input[["team_key"]])
        defect_prediction_input = defect_prediction_input.drop(columns=["team_key"])  # Drop the original categorical column

        # Scale the input data for the defect model
        scaled_defect_input = defect_preprocessor.transform(defect_prediction_input)
        defect_pred = defect_prediction_model.predict(scaled_defect_input)[0]

        # Return the predictions
        return jsonify({
            "predicted_timeline_days_before_impact": round(float(project_timeline_pred), 2),
            "predicted_timeline_days_after_impact": round(float(adjusted_timeline_pred), 2),
            "predicted_defect_count": round(float(defect_pred), 2)
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/update_project_deadline', methods=['PUT'])
def update_project_deadline():
    """Update the estimated end date as the project deadline in MongoDB."""
    try:
        data = request.json
        project_id = data.get("project_id")
        project_deadline = data.get("project_deadline")

        if not project_id or not project_deadline:
            return jsonify({"error": "Project ID and deadline are required"}), 400

        # Update the project document in MongoDB
        result = projects_collection.update_one(
            {"projectId": str(project_id)},
            {"$set": {"projectDeadline": project_deadline}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Project not found"}), 404

        return jsonify({"message": "Project deadline updated successfully!", "project_deadline": project_deadline})

    except Exception as e:
        print(f"Error updating project deadline: {e}")
        return jsonify({"error": "Failed to update project deadline"}), 500


@app.route('/predict_task_allocation', methods=['POST'])
def predict_task_allocation():
    """Predict the best team for a given task using the task allocation model."""
    try:
        data = request.json

        # Fetch all teams from MongoDB
        all_teams = list(teams_collection.find({}, {"_id": 0}))
        if not all_teams:
            return jsonify({"error": "No teams found in the database"}), 404

        # Convert teams data into a DataFrame
        teams_df = pd.DataFrame(all_teams)

        # Drop unnecessary columns
        teams_df.drop(columns=["__v", "team_name", "total_members"], errors="ignore", inplace=True)

        # Prepare task input from the user
        task_input_df = pd.DataFrame([{
            "task_type": data.get("task_type", ""),
            "task_complexity": data.get("task_complexity", 0),
            "task_priority": data.get("task_priority", 0),
            "estimated_effort_hours": data.get("estimated_effort_hours", 0)
        }])

        # Merge task input with all teams to prepare for prediction
        task_features = task_input_df.assign(key=1).merge(teams_df.assign(key=1), on="key").drop(columns=["key"])

        # Predict the best team using the task allocation model
        predicted_team_idx = task_allocation_model.predict(task_features)[0]

        # Format the predicted team ID
        assigned_team = f"T-{predicted_team_idx+1}"

        # Return the prediction and feature importance
        return jsonify({
            "predicted_best_team": assigned_team,
            "feature_importance": feature_importance
        })

    except Exception as e:
        print(f"Error in task allocation prediction: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/model_performance', methods=['GET'])
def get_model_performance():
    """Fetch performance metrics for all models."""
    try:
        # Load task allocation model performance metrics
        task_metrics = joblib.load(os.path.join(MODEL_DIR, "accuracy_metrics.pkl"))

        # Convert numpy arrays to lists for JSON serialization
        if isinstance(task_metrics.get("cross_validation_scores"), np.ndarray):
            task_metrics["cross_validation_scores"] = task_metrics["cross_validation_scores"].tolist()

        # Load project timeline model metrics
        timeline_metrics = joblib.load(os.path.join(MODEL_DIR, "project_timeline_metrics.pkl"))

        # Load defect prediction model metrics
        defect_metrics = joblib.load(os.path.join(MODEL_DIR, "defect_prediction_metrics.pkl"))

        # Return all metrics in a structured format
        return jsonify({
            "task_allocation": {
                "cross_validation_scores": task_metrics.get("cross_validation_scores", []),
                "mean_cross_validation_accuracy": task_metrics.get("mean_cross_validation_accuracy", 0.0),
                "test_accuracy": task_metrics.get("test_accuracy", 0.0)
            },
            "project_timeline": timeline_metrics,
            "defect_prediction": defect_metrics
        })

    except FileNotFoundError as e:
        print(f"File not found: {e}")
        return jsonify({"error": f"Model performance data missing: {str(e)}"}), 500

    except Exception as e:
        print(f"Error fetching model performance: {e}")
        return jsonify({"error": f"Failed to fetch model performance: {str(e)}"}), 500

@app.route('/predict_effort', methods=['POST'])
def predict_effort():
    """Predict the effort required for a software project based on input features."""
    try:
        data = request.get_json()

        # Extract features from request
        team_exp = data.get("TeamExp", 0)
        manager_exp = data.get("ManagerExp", 0)
        year_end = data.get("YearEnd", 0)
        length = data.get("Length", 0)

        # Ensure all values are numeric
        input_features = np.array([[team_exp, manager_exp, year_end, length]])

        # Make prediction
        predicted_effort = effort_prediction_model.predict(input_features)[0]

        return jsonify({"predicted_effort": round(float(predicted_effort), 2)})

    except Exception as e:
        print(f"Error in effort prediction: {e}")
        return jsonify({"error": f"Effort prediction failed: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)