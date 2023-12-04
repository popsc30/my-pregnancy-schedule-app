// src/App.js

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addWeeks, format, subDays, isWithinInterval,startOfDay, endOfDay } from 'date-fns';
import jsonData from './data/note.json';
import { tr } from 'date-fns/locale';

const calculateSchedule = (startDate) => {
  const schedule = [];
  const start = new Date(startDate);

  for (let week = 1; week <= 40; week++) {
    const weekStart = addWeeks(start, week - 1);
    const weekEnd = subDays(addWeeks(start, week),1);

    // 获取对应周的产检信息和注意事项
    const weekData = jsonData[week - 1];
    const notes = {
      mark: weekData.mark,
      checkups: weekData.checkups,
      attention: weekData.attention
    };

    schedule.push({
      week: `Week ${week}`,
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(weekEnd, 'yyyy-MM-dd'),
      notes: notes // 存储每周的具体信息
    });
  }

  return schedule;
};

function App() {
  const fixedStartDate = new Date('2023-10-17');
  const [schedule, setSchedule] = useState([]);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const today = new Date();

  const handleMouseEnter = (weekNumber) => {
    setHoveredWeek(weekNumber);
  };

  const handleMouseLeave = () => {
    setHoveredWeek(null);
  };

  useEffect(() => {
    const newSchedule = calculateSchedule(fixedStartDate);
    setSchedule(newSchedule);
  }, []);

  // 将日程划分为三个孕期
  const firstTrimester = schedule.slice(0, 12);
  const secondTrimester = schedule.slice(12, 26);
  const thirdTrimester = schedule.slice(26, 40);

  // 渲染每个孕期的函数
  const renderTrimester = (trimester, title, offset) => (
    <>
      <div className="my-8 p-4 border border-gray-200 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-600 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trimester.map((weekInfo, index) => {
          const globalIndex = index + offset; // 全局索引
          const isCurrentWeek = today >= startOfDay(new Date(weekInfo.startDate)) && today <= endOfDay(new Date(weekInfo.endDate));
         
          return (
            <div
              key={globalIndex}
              className={`border rounded p-4 hover:bg-gray-100 ${isCurrentWeek ? 'bg-green-100' : ''}`}
              onMouseEnter={() => handleMouseEnter(globalIndex)}
              onMouseLeave={handleMouseLeave}
            >
              <h4 className="font-semibold">{weekInfo.week}</h4>
              <p>{weekInfo.startDate} - {weekInfo.endDate}</p>
              {(hoveredWeek === globalIndex || isCurrentWeek) && (
                <div className={`mt-2 p-2 rounded ${isCurrentWeek ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                  {weekInfo.mark && (
                    <p className="mt-2 text-sm italic">{weekInfo.notes.mark}</p>
                  )}
                  <p className="mt-2 text-sm text-blue-600">{weekInfo.notes.checkups}</p>
                  <p className="mt-2 text-sm text-green-600">{weekInfo.notes.attention}</p>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </>
  );

  return (
    <div className="App p-4">
      <h2 className="text-2xl font-bold mb-4">Pregnancy Schedule</h2>
      
      <div className="p-4 bg-gray-100">
        <p className="text-lg text-gray-700">
          了解更多关于怀孕每周的详细信息，请访问 
          <a href="https://www.babycenter.com/pregnancy/week-by-week" target="_blank" className="text-blue-500 hover:text-blue-700">BabyCenter 怀孕周周指南</a> 
          或 
          <a href="https://www.whattoexpect.com/pregnancy/week-by-week/" target="_blank" className="text-blue-500 hover:text-blue-700">WhatToExpect 怀孕周周指南</a>.
        </p>
      </div>

      {schedule.length > 0 && (
        <>
          {renderTrimester(firstTrimester, "第1-12周（第一孕期）", 0)}
          {renderTrimester(secondTrimester, "第13-26周（第二孕期）", 12)}
          {renderTrimester(thirdTrimester, "第27-40周（第三孕期）", 26)}
        </>
      )}

    </div>
    
  );
}

export default App;