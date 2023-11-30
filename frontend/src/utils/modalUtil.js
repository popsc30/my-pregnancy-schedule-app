import { useState } from 'react';

export function useModal(initialIsOpen = false) {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return {
        isOpen,
        openModal,
        closeModal,
};
}