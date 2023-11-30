const [isModalOpen, setIsModalOpen] = useState(false);

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