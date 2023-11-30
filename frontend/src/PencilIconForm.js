import React, { useState } from 'react';

const PencilIconForm = ({ weekInfo, globalIndex, schedule, setSchedule }) => {
    const [inputText, setInputText] = useState('');

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSaveNote = () => {
        const updatedSchedule = [...schedule];
        updatedSchedule[globalIndex].notes.mark = inputText;
        setSchedule(updatedSchedule);
        setInputText('');
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text..."
                className="border rounded p-2 mt-2"
            />
            {inputText && (
                <button
                    onClick={handleSaveNote}
                    className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default PencilIconForm;