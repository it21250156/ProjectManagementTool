import React, { useState } from 'react';

const MultiSelectDropdown = ({ options, placeholder = "Select options", onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option) => {
        if (selectedOptions.some(selected => selected.value === option.value)) {
            const updatedOptions = selectedOptions.filter((item) => item.value !== option.value);
            setSelectedOptions(updatedOptions);
            onChange(updatedOptions);
        } else {
            const updatedOptions = [...selectedOptions, option];
            setSelectedOptions(updatedOptions);
            onChange(updatedOptions);
        }
    };

    const removeChip = (option) => {
        const updatedOptions = selectedOptions.filter((item) => item.value !== option.value);
        setSelectedOptions(updatedOptions);
        onChange(updatedOptions);
    };

    return (
        <div className="relative w-full">
            <div 
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium cursor-pointer min-h-[48px] flex flex-wrap items-center gap-2 hover:from-[#50E3C2]/30 hover:to-[#4a90e2]/30"
                onClick={toggleDropdown}
            >
                {selectedOptions.length === 0 ? (
                    <span className="text-gray-600 font-medium">{placeholder}</span>
                ) : (
                    selectedOptions.map((option) => (
                        <div 
                            key={option.value}
                            className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            {option.label}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeChip(option);
                                }}
                                className="ml-1 hover:bg-white/30 rounded-full w-5 h-5 flex items-center justify-center focus:outline-none transition-all duration-200 hover:scale-110"
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
                <div className="ml-auto">
                    <svg 
                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-sm">
                    <div className="p-1">
                        {options.map((option, index) => (
                            <div
                                key={option.value}
                                className={`px-4 py-3 cursor-pointer rounded-lg margin-1 transition-all duration-200 ${
                                    selectedOptions.some(selected => selected.value === option.value) 
                                        ? 'bg-gradient-to-r from-[#4a90e2]/20 to-[#50E3C2]/20 font-semibold border border-[#4a90e2]/30' 
                                        : 'hover:bg-gradient-to-r hover:from-[#50E3C2]/10 hover:to-[#4a90e2]/10 font-medium'
                                } ${index !== options.length - 1 ? 'mb-1' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">{option.label}</span>
                                    {selectedOptions.some(selected => selected.value === option.value) && (
                                        <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] rounded-full p-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;