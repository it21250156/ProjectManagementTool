import React, { useState } from 'react';

const MultiSelectDropdown = ({ options, placeholder = "Select options", onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Handle option selection
    const handleSelect = (option) => {
        if (selectedOptions.some(selected => selected.value === option.value)) {
            // Remove if already selected
            const updatedOptions = selectedOptions.filter((item) => item.value !== option.value);
            setSelectedOptions(updatedOptions);
            onChange(updatedOptions); // Send full selected options (objects)
        } else {
            // Add if not selected
            const updatedOptions = [...selectedOptions, option];
            setSelectedOptions(updatedOptions);
            onChange(updatedOptions); // Send full selected options (objects)
        }
    };

    // Remove a selected option (chip)
    const removeChip = (option) => {
        const updatedOptions = selectedOptions.filter((item) => item.value !== option.value);
        setSelectedOptions(updatedOptions);
        onChange(updatedOptions); // Send full selected options (objects)
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
                            key={option.value}
                            className="flex items-center bg-blue-500 text-white rounded-full px-3 py-1 text-sm"
                        >
                            {option.label}
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

            {/* Dropdown options - now with max-height and overflow-y-auto for scrolling */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-[#50E3C2] border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedOptions.some(selected => selected.value === option.value) ? 'bg-blue-50' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;