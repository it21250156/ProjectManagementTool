const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

let GoogleGenAI;
let genAI = null;

const loadGemini = async () => {
    if (!GoogleGenAI) {
        const module = await import('@google/genai');
        GoogleGenAI = module.GoogleGenAI;
        genAI = new GoogleGenAI({
            apiKey: "AIzaSyCJExLkrGK_qxykudoWhQp4hhCmk6myE1w"
        });
    }
};

// ✅ 1. Estimate Task Risk and Duration
router.post('/estimate-risk', async (req, res) => {
    const { taskName, taskDescription, complexity, experienceLevel } = req.body;
    if (!taskName || !complexity || !experienceLevel) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        await loadGemini();

        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{
                role: "user",
                parts: [{
                    text: `You are a senior project manager AI assistant.

Given the task details below, return:
1. Estimated time in hours (as a number).
2. Risk level (Low, Medium, High).
3. A one-sentence reason for the risk level.

Task:
- Name: ${taskName}
- Description: ${taskDescription}
- Complexity: ${complexity}
- Developer Experience Level: ${experienceLevel}

Respond in valid JSON format like:
{
  "duration": "6.5",
  "risk": "Medium",
  "reason": "The task is complex, but the developer has moderate experience, so risk is moderate."
}`
                }]
            }],
            config: { temperature: 0.2, maxOutputTokens: 300 }
        });

        let text = result.candidates[0].content.parts[0].text.trim();
        if (text.startsWith("```")) text = text.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

        const json = JSON.parse(text);

        res.status(200).json({
            estimatedDuration: json.duration,
            risk: json.risk,
            reason: json.reason
        });

    } catch (err) {
        console.error("Gemini SDK Error:", err);
        res.status(500).json({ error: "Gemini API failed", details: err.message });
    }
});

// ✅ 2. Allocate Best Member for Task
router.post('/allocate-member', async (req, res) => {
    const { taskName, complexity, priority, estimatedEffort, members } = req.body;
    if (!taskName || !complexity || !priority || !estimatedEffort || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: "Missing required fields or no members provided." });
    }

    try {
        await loadGemini();
        const users = await User.find({ _id: { $in: members } });
        if (users.length === 0) return res.status(404).json({ error: "No valid members found." });

        const memberData = users.map(user =>
            `- ${user.name} (${user.experienceLevel}-level, XP: ${user.earnedXP}, Completed Tasks: ${user.completedTasks}, Level: ${user.level})`
        ).join("\n");

        const prompt = `You are a project manager AI.

Your task is to recommend the best individual for a given task based on their experience level, XP, completed tasks, and overall profile. But try to assign low complexed and low priority tasks for low experienced members to gain experience and xps.

Task Details:
- Type: ${taskName}
- Complexity: ${complexity}
- Priority: ${priority}
- Estimated Effort Hours: ${estimatedEffort}

👥 Assigned Members:
${memberData}

Return valid JSON:
{
  "best_member": "Full Name",
  "reason": "Short explanation"
}`;

        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { temperature: 0.2, maxOutputTokens: 300 }
        });

        let text = result.candidates[0].content.parts[0].text.trim();
        if (text.startsWith("```")) text = text.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(text);
        const matchedUser = users.find(user => user.name === parsed.best_member);

        if (!matchedUser) return res.status(404).json({ error: "Predicted member not found among available users." });

        res.status(200).json({
            best_member: matchedUser.name,
            experienceLevel: matchedUser.experienceLevel,
            completedTasks: matchedUser.completedTasks,
            earnedXP: matchedUser.earnedXP,
            reason: parsed.reason
        });

    } catch (err) {
        console.error("Gemini Allocation Error:", err);
        res.status(500).json({ error: "Gemini API failed for member allocation.", details: err.message });
    }
});

// ✅ 3. Predict Project Timeline
router.post('/predict-timeline', async (req, res) => {
    const {
        projectName, projectDescription, team_size, task_count, developer_experience,
        priority_level, task_complexity, project_size, testing_coverage,
        Effort_Density, Team_Productivity, LoC_per_Team_Member, change_impact_factor
    } = req.body;

    if (!projectName || !team_size || !task_count || !developer_experience) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        await loadGemini();

        const prompt = `
You are a project management expert AI.

Estimate the number of days required to complete the following software project.

Project Name: ${projectName}
Description: ${projectDescription}

Features:
- Team Size: ${team_size}
- Task Count: ${task_count}
- Developer Experience: ${developer_experience}
- Priority Level: ${priority_level}
- Task Complexity: ${task_complexity}
- Project Size (LOC): ${project_size}
- Testing Coverage: ${testing_coverage}
- Effort Density: ${Effort_Density}
- Team Productivity: ${Team_Productivity}
- LOC per Member: ${LoC_per_Team_Member}
- Requirement Change Impact Factor: ${change_impact_factor}

Return JSON:
{
  "estimated_days_before_impact": 45.6,
  "final_estimate_days_after_impact": 51.2,
  "reason": "High complexity with moderate productivity, and impact factor added 10%."
}`;

        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { temperature: 0.2, maxOutputTokens: 400 }
        });

        let rawText = result.candidates[0].content.parts[0].text.trim();
        if (rawText.startsWith("```")) rawText = rawText.replace(/```(?:json)?/, "").replace(/```/, "").trim();

        const match = rawText.match(/\{[\s\S]*?\}/);
        if (!match) return res.status(500).json({ error: "Could not extract valid JSON", raw: rawText });

        const json = JSON.parse(match[0]);
        res.status(200).json(json);

    } catch (err) {
        console.error("Timeline Gemini Error:", err);
        res.status(500).json({ error: "Gemini timeline prediction failed", details: err.message });
    }
});

// ✅ 4. Predict Defect Count
router.post('/predict-defects', async (req, res) => {
    const {
        projectName, projectDescription, defect_fix_time_minutes, size_added,
        size_deleted, size_modified, effort_hours, task_complexity,
        testing_coverage, team_key
    } = req.body;

    if (!projectName || !defect_fix_time_minutes || !effort_hours || !team_key) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        await loadGemini();

        const prompt = `
You are a software quality analyst AI.

Estimate the number of defects likely to be found in this software project.

Project Name: ${projectName}
Description: ${projectDescription}

Technical Details:
- Defect Fix Time (min): ${defect_fix_time_minutes}
- Size Added: ${size_added}
- Size Deleted: ${size_deleted}
- Size Modified: ${size_modified}
- Total Effort (hrs): ${effort_hours}
- Complexity Score: ${task_complexity}
- Testing Coverage: ${testing_coverage}
- Team Key: ${team_key}

Respond in JSON:
{
  "predicted_defects": 19,
  "reason": "High LOC changes with medium coverage and average complexity contributed to moderate defect count."
}`;

        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { temperature: 0.2, maxOutputTokens: 300 }
        });

        let rawText = result.candidates[0].content.parts[0].text.trim();
        if (rawText.startsWith("```")) rawText = rawText.replace(/```(?:json)?/, "").replace(/```/, "").trim();

        const match = rawText.match(/\{[\s\S]*?\}/);
        if (!match) return res.status(500).json({ error: "Could not extract valid JSON", raw: rawText });

        const json = JSON.parse(match[0]);
        res.status(200).json(json);

    } catch (err) {
        console.error("Defect Gemini Error:", err);
        res.status(500).json({ error: "Gemini defect prediction failed", details: err.message });
    }
});

// ✅ 5. Predict Delay Probability for User Profile
router.post('/profile-delay-prediction', async (req, res) => {
    let { level, completedTasks, earnedXP } = req.body;

    // Consistent algorithm for delay probability status
    // Low: completedTasks > 40 or level > 8 OR (completedTasks > 30 && earnedXP > 1500)
    // Medium: completedTasks > 20 or level > 5
    // High: otherwise

    const isTrulyExperienced = (completedTasks > 30 && earnedXP > 1500);
    const isLowRisk = (completedTasks > 40 || level > 8) || isTrulyExperienced;
    const isMediumRisk = (completedTasks > 20 || level > 5);

    let avgEffortHours, onTimeDeliveryRate, currentTaskLoad, delayProbability, reason, status;

    if (isLowRisk) {
        avgEffortHours = 4;
        onTimeDeliveryRate = 0.9;
        currentTaskLoad = 3;
        delayProbability = 0.2;
        status = "Low";
        if (isTrulyExperienced) {
            reason = `This user has completed ${completedTasks} tasks and earned ${earnedXP} XP, demonstrating advanced experience and consistent reliability. Their history shows they can handle tasks efficiently and on time, making delays very unlikely.`;
        } else if (completedTasks > 40) {
            reason = `With over 40 completed tasks, this user has a proven track record of handling a high volume of work. Their experience reduces the chance of delays, as they are familiar with the workflow and common challenges.`;
        } else {
            reason = `The user is at a high level (${level}), indicating advanced skills and a deep understanding of project requirements. Such users typically manage their workload well and deliver tasks on schedule.`;
        }
    } else if (isMediumRisk) {
        avgEffortHours = 8;
        onTimeDeliveryRate = 0.5;
        currentTaskLoad = 6;
        delayProbability = 0.5;
        status = "Medium";
        if (completedTasks > 20 && completedTasks <= 40) {
            reason = `This user has completed ${completedTasks} tasks, showing a fair amount of experience. However, they are still building up to advanced proficiency, so there is a moderate risk of delay if workload increases or unexpected issues arise.`;
        } else if (level > 5 && level <= 8) {
            reason = `The user is at level ${level}, which is above beginner but not yet advanced. They have a reasonable skill set but may still encounter challenges that could cause moderate delays.`;
        } else {
            reason = `The user has moderate experience or is currently managing a moderate workload. Their on-time delivery rate is average, so while they can often deliver on time, there is still a noticeable risk of delay.`;
        }
    } else {
        avgEffortHours = 12;
        onTimeDeliveryRate = 0.2;
        currentTaskLoad = 10;
        delayProbability = 0.8;
        status = "High";
        if (completedTasks <= 20 && level <= 5) {
            reason = `This user has only completed ${completedTasks} tasks and is at level ${level}, indicating they are relatively new or inexperienced. Such users are more likely to face difficulties, leading to a high risk of delay.`;
        } else if (completedTasks <= 20) {
            reason = `With only ${completedTasks} completed tasks, this user lacks the experience needed to consistently deliver on time. They may require additional support or supervision, increasing the risk of delays.`;
        } else if (level <= 5) {
            reason = `The user is at a lower level (${level}), suggesting they are still developing their skills. Lower-level users often need more time to complete tasks and are more susceptible to delays.`;
        } else {
            reason = `This user is either less experienced or currently overloaded with work. Their low on-time delivery rate and high task load make delays very likely unless their workload is reduced or they receive extra help.`;
        }
    }

    // For transparency, show the prompt that would be sent to Gemini
    const prompt = `
You are a software project analyst AI assistant.

Given the user profile data below, predict the delay probability for their next assigned task as a number between 0 and 1.

Profile:
- Level: ${level}
- Completed Tasks: ${completedTasks}
- Earned XP: ${earnedXP}
- Average Effort Hours per Task: ${avgEffortHours}
- On-Time Delivery Rate (0 to 1): ${onTimeDeliveryRate}
- Current Task Load: ${currentTaskLoad}

Based on the above, the delay probability status is "${status}".
`;

    return res.status(200).json({
        delayProbability,
        reason,
        status,
        prompt // Optional: for debugging or UI display
    });
});

module.exports = router;