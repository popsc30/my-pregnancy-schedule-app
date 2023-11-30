// src/App.js

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addWeeks, format, differenceInCalendarWeeks } from 'date-fns';
// import jsonData from './data/note.json';
import SecretKeyModal from './components/SecretKeyModal'; // 确保路径正确
import { calculateSchedule } from './utils/scheduleUtils';


const startDate = process.env.REACT_APP_START_DATE;

function App() {
  const [editingWeekIndex, setEditingWeekIndex] = useState(null);
  const [editContent, setEditContent] = useState('');
  const formattedDate = format(new Date(), 'yyyy-MM-dd');

  // 处理编辑图标的点击事件
  const handleEditClick = (index) => {
    setEditingWeekIndex(index);
    setEditContent(schedule[index].notes.mark);
    setIsModalOpen(true);
  };

  // 处理模态框确认操作
  const handleModalConfirm = (key) => {
    const encryptedKey = btoa(key);
    if (encryptedKey === "aWxvdmVib2I=") {
      // 密钥正确，关闭模态框，保持编辑状态
      setIsModalOpen(false);
    } else {
      // 密钥错误，显示错误信息并重置状态
      alert("密钥错误，无法编辑！");
      setIsModalOpen(false);
      setEditingWeekIndex(null); // 重置编辑状态
    }
  };

  // 处理模态框的关闭
  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isModalOpen) {
      setEditingWeekIndex(null);
    }
  };



  const handleSave = async () => {
    const updatedSchedule = [...schedule];
    updatedSchedule[editingWeekIndex].notes.mark = editContent;
    setSchedule(updatedSchedule);
    console.log(updatedSchedule.map((item) => item.notes));
    try {
      const response = await fetch('http://localhost:3001/update-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSchedule.map((item) => item.notes)),
      });

      if (response.ok) {
        console.log('Schedule updated successfully');
      } else {
        console.error('Failed to update schedule');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setEditingWeekIndex(null);
  };

  // ========================= i18n =========================
  // const [startDate, setStartDate] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleMouseEnter = (weekNumber) => {
    setHoveredWeek(weekNumber);
  };

  const handleMouseLeave = () => {
    setHoveredWeek(null);
  };

  useEffect(() => {
    // Calculate the current week
    const today = new Date();
    const weeksDifference = differenceInCalendarWeeks(today, startDate);
    if (weeksDifference >= 0 && weeksDifference < 40) {
      setCurrentWeek(weeksDifference);
    }
  }, []);

  useEffect(() => {
    // 获取schedule数据
    const fetchSchedule = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-note');
        if (response.ok) {
          const jsonData = await response.json();
          const newSchedule = calculateSchedule(jsonData, startDate);
          setSchedule(newSchedule);
        } else {
          console.error('Failed to fetch schedule');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSchedule();
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
            return (
              <div
                key={globalIndex}
                className={`border rounded p-4 hover:bg-gray-100 ${globalIndex === currentWeek ? 'bg-green-100' : ''}`}
                onMouseEnter={() => handleMouseEnter(globalIndex)}
                onMouseLeave={handleMouseLeave}
              >
                <h4 className="font-semibold flex justify-between items-center">
                  {weekInfo.week}
                  <button onClick={() => handleEditClick(globalIndex)} className="text-blue-500">
                    <p className="w-5 h-5">✏️</p>
                  </button>
                </h4>

                <p>{weekInfo.startDate} - {weekInfo.endDate}</p>
                {(hoveredWeek === globalIndex || globalIndex === currentWeek) && (
                  <div className={`mt-2 p-2 rounded ${globalIndex === currentWeek ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <p className="mt-2 text-sm text-blue-600">{weekInfo.notes.checkups}</p>
                    <p className="mt-2 text-sm text-green-600">{weekInfo.notes.attention}</p>
                    {editingWeekIndex !== globalIndex && weekInfo.notes.mark && (
                      <p className="mt-2 text-sm text-purple-600 font-semibold font-mono">{weekInfo.notes.mark}</p>
                    )}

                    {editingWeekIndex === globalIndex && (
                      <div className="mt-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <button
                          onClick={handleSave}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                          保存
                        </button>
                      </div>
                    )}
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pregnancy Schedule</h2>
        <span className="text-lg text-gray-600">{formattedDate}</span>
      </div>
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

      <SecretKeyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>

  );
}

export default App;