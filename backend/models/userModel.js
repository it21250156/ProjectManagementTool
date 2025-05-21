const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    earnedXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    experienceLevel: {
        type: String,
        enum: ['Junior', 'Mid', 'Senior'],
        default: 'Junior' // fallback
      },      
    unlockedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    badges: [{ type: String }],
});

// 🔹 Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  
    // Auto-assign experienceLevel based on level
    if (this.level <= 3) {
      this.experienceLevel = 'Junior';
    } else if (this.level <= 6) {
      this.experienceLevel = 'Mid';
    } else {
      this.experienceLevel = 'Senior';
    }
  
    next();
  });
  

// 🔹 Compare input password with hashed password
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// 🔹 Unlock a skill (deducts points)
UserSchema.methods.unlockSkill = function (skillId, skillPointsRequired) {
    if (!this.unlockedSkills.includes(skillId)) {
        this.unlockedSkills.push(skillId);
        this.points -= skillPointsRequired; // Deduct points
    }
};

// 🔹 Function to update user level based on XP
UserSchema.methods.updateLevel = function () {
    let xpThreshold = 50; // XP required for Level 2
    let newLevel = 1;

    while (this.earnedXP >= xpThreshold) {
        newLevel++;
        xpThreshold *= 2; // Each level requires double XP
    }

    this.level = newLevel;

    // Auto-update experienceLevel based on new level
    if (this.level <= 3) {
        this.experienceLevel = 'Junior';
    } else if (this.level <= 6) {
        this.experienceLevel = 'Mid';
    } else {
        this.experienceLevel = 'Senior';
    }
};


// 🔹 Function to update badges (Uses XP instead of Points to prevent losing badges)
UserSchema.methods.updateBadges = function () {
    const badgeCriteria = [
        { name: "Task Beginner", threshold: 30 },
        { name: "Task Master", threshold: 100 },
        { name: "Collaboration Guru", threshold: 10 },
        { name: "Skill Unlocker", threshold: 5 },
    ];

    badgeCriteria.forEach(badge => {
        if (!this.badges.includes(badge.name) && this.earnedXP >= badge.threshold) {
            this.badges.push(badge.name);
        }
    });
};

module.exports = mongoose.model('User', UserSchema);
