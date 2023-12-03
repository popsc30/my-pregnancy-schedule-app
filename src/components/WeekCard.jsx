export const WeekCard = ({
  weekInfo,
  globalIndex,
  isCurrentWeek,
  handleMouseEnter,
  handleMouseLeave,
  handleEditClick,
  hoveredWeek,
  editingWeekIndex,
  editContent,
  setEditContent,
  handleSave,
}) => (
  <div
    key={globalIndex}
    className={`border rounded p-4 hover:bg-gray-100 ${
      isCurrentWeek ? "bg-green-100" : ""
    }`}
    onMouseEnter={() => handleMouseEnter(globalIndex)}
    onMouseLeave={handleMouseLeave}
  >
    <h4 className="font-semibold flex justify-between items-center">
      {weekInfo.week}
      <button
        onClick={() => handleEditClick(globalIndex)}
        className="text-blue-500"
      >
        <p className="w-5 h-5">✏️</p>
      </button>
    </h4>

    <p>
      {weekInfo.startDate} - {weekInfo.endDate}
    </p>
    {(hoveredWeek === globalIndex || isCurrentWeek) && (
      <div
        className={`mt-2 p-2 rounded ${
          isCurrentWeek ? "bg-yellow-100" : "bg-blue-100"
        }`}
      >
        <p className="mt-2 text-sm text-blue-600">{weekInfo.notes.checkups}</p>
        <p className="mt-2 text-sm text-green-600">
          {weekInfo.notes.attention}
        </p>
        {editingWeekIndex !== globalIndex && weekInfo.notes.mark && (
          <p className="mt-2 text-sm text-purple-600 font-semibold font-mono">
            {weekInfo.notes.mark}
          </p>
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
