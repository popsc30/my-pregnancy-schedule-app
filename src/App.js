// src/App.js

import React, { useState, useEffect } from 'react';
import { format, differenceInCalendarWeeks } from 'date-fns';
import SecretKeyModal from './components/SecretKeyModal';
import { WeekCard } from './components/WeekCard';
import { calculateSchedule } from './utils/scheduleUtils';
import { useScheduleEditor } from './utils/scheduleEditor';
import { useHover } from './utils/hoverUtil';

const startDate = new Date(process.env.REACT_APP_START_DATE);
const today = format(new Date(), 'yyyy-MM-dd');
const api = process.env.REACT_APP_API_URL;
console.log("🚀 ~ file: App.js:14 ~ api:", api)

function App() {
  const [schedule, setSchedule] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);
  const { hoveredWeek, handleMouseEnter, handleMouseLeave } = useHover();

  const {
    editingWeekIndex,
    editContent,
    setEditContent,
    isOpen,
    handleEditClick,
    handleModalConfirm,
    handleModalClose,
    handleSave
  } = useScheduleEditor(schedule, setSchedule);

  useEffect(() => {
    const today = new Date();
    const weeksDifference = differenceInCalendarWeeks(today, startDate);
    if (weeksDifference >= 0 && weeksDifference < 40) {
      setCurrentWeek(weeksDifference);
    }
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(api+'/get-note');
        if (response.ok) {
          const jsonData = await response.json();
          const newSchedule = calculateSchedule(jsonData, startDate);
          setSchedule(newSchedule);
        } else {
          console.error('Failed to fetch schedule');
        }
      } catch (error) {
        console.log(api + '/get-note');
        console.error('Error:',error);
      }
    };

    fetchSchedule();
  }, []);

  const firstTrimester = schedule.slice(0, 12);
  const secondTrimester = schedule.slice(12, 26);
  const thirdTrimester = schedule.slice(26, 40);

  const renderTrimester = (trimester, title, offset) => (
    <>
      <div className="my-8 p-4 border border-gray-200 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-600 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trimester.map((weekInfo, index) => {
            const globalIndex = index + offset;
            return (
              <WeekCard
                key={globalIndex}  
                weekInfo={weekInfo}
                globalIndex={globalIndex}
                currentWeek={currentWeek}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                hoveredWeek={hoveredWeek}
                editingWeekIndex={editingWeekIndex}
                editContent={editContent}
                setEditContent={setEditContent}
                handleSave={handleSave}
              />
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="App p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pregnancy Schedule</h2>
        <span className="text-lg text-gray-600">{today}</span>
      </div>
      <div className="p-4 bg-gray-100">
        <p className="text-lg text-gray-700">
          了解更多关于怀孕每周的详细信息，请访问
          <a href="https://www.babycenter.com/pregnancy/week-by-week" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">BabyCenter 怀孕周周指南</a>
          或
          <a href="https://www.whattoexpect.com/pregnancy/week-by-week/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">WhatToExpect 怀孕周周指南</a>.
        </p>
      </div>

      {schedule.length > 0 && (
        <>
          {renderTrimester(firstTrimester, "第1-12周（第一孕期）", 0)}
          {renderTrimester(secondTrimester, "第13-26周（第二孕期）", 12)}
          {renderTrimester(thirdTrimester, "第27-40周（第三孕期）", 26)}
        </>
      )}

      <SecretKeyModal
        isOpen={isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default App;