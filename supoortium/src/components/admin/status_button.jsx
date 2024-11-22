import React from 'react';

const StatusButton = ({ status }) => {
  // Преобразование статусов на русский язык и стилизация
  const statusMap = {
    PENDING: { text: 'Ещё не принятое', bgColor: 'bg-red-500', textColor: 'text-white' },
    IN_PROGRESS: { text: 'В процессе', bgColor: 'bg-yellow-500', textColor: 'text-black' },
    RESOLVED: { text: 'Решено', bgColor: 'bg-green-500', textColor: 'text-white' },
    CLOSED: { text: 'Закрыто', bgColor: 'bg-gray-500', textColor: 'text-white' },
  };

  const currentStatus = statusMap[status] || { text: 'Неизвестный статус', bgColor: 'bg-gray-300', textColor: 'text-black' };

  return (
    <button
      className={`px-4 py-2 rounded ${currentStatus.bgColor} ${currentStatus.textColor} font-bold`}
    >
      {currentStatus.text}
    </button>
  );
};

export default StatusButton;
