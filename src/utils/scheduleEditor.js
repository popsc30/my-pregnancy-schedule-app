import { useState } from 'react';
import { useModal } from './modalUtil';

const api = process.env.REACT_APP_API_URL;

export function useScheduleEditor(schedule, setSchedule) {
    const [editingWeekIndex, setEditingWeekIndex] = useState(null);
    const [editContent, setEditContent] = useState('');
    const { isOpen, openModal, closeModal } = useModal();

    // 处理编辑图标的点击事件
    const handleEditClick = (index) => {
        setEditingWeekIndex(index);
        setEditContent(schedule[index].notes.mark);
        openModal();
    };

    // 处理模态框确认操作
    const handleModalConfirm = (key) => {
        const encryptedKey = btoa(key);
        if (encryptedKey !== "aWxvdmVib2I=") {
            // 密钥错误，显示错误信息并重置状态
            alert("密钥错误，无法编辑！");
            setEditingWeekIndex(null); // 重置编辑状态
        }
        closeModal();
    };

    // 处理模态框的关闭
    const handleModalClose = () => {
        closeModal();
        if (isOpen) {
            setEditingWeekIndex(null);
        }
    };

    const handleSave = async () => {
        const updatedSchedule = [...schedule];
        updatedSchedule[editingWeekIndex].notes.mark = editContent;
        setSchedule(updatedSchedule);
        const updated = updatedSchedule.map((item, index) => {
            return {
                index: index,
                mark: item.mark
            };
        });
        console.log(updated);
        try {
            const response = await fetch(api + '/update-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updated),
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

    return {
        editingWeekIndex,
        editContent,
        setEditContent,
        isOpen,
        handleEditClick,
        handleModalConfirm,
        handleModalClose,
        handleSave
    };
}