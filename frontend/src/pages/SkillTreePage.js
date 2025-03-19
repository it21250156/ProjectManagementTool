import React from 'react';
import Header from '../components/Header';
import SkillTree from '../components/SkillTree'; // ✅ Import SkillTree component

const SkillTreePage = () => {
    return (
        <div>
            <div className='m-4'>
                <h1 className="text-4xl font-bold">Skill Tree</h1>
                <p>This is where the skill tree will be displayed.</p>

                {/* ✅ Include SkillTree Component */}
                <SkillTree />
            </div>
        </div>
    );
};

export default SkillTreePage;
