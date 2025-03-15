import React, { useState } from 'react';

const MultiSelectDropdown = ({ options, placeholder = "Select options" }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Handle option selection
    const handleSelect = (option) => {
        if (selectedOptions.includes(option)) {
            // Remove option if already selected
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            // Add option if not selected
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    // Remove a selected option (chip)
    const removeChip = (option) => {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
    };

    return (
        <div className="relative w-100">
            {/* Selected options (chips) */}
            <div className="flex flex-wrap gap-2 p-2 border-none rounded-lg cursor-pointer bg-[#50E3C2]" onClick={toggleDropdown}>
                {selectedOptions.length === 0 ? (
                    <span className="font-light italic">-{placeholder}-</span>
                ) : (
                    selectedOptions.map((option) => (
                        <div
                            key={option}
                            className="flex items-center bg-blue-500 text-white rounded-full px-3 py-1 text-sm"
                        >
                            {option}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeChip(option);
                                }}
                                className="ml-2 focus:outline-none"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Dropdown options */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-[#50E3C2] border border-gray-300 rounded-lg shadow-lg ">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedOptions.includes(option) ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;