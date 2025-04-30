const SeachBar = () => {
  return (
    <aside className="w-1/5 bg-white p-6 shadow-md">
      <h2 className="text-lg font-bold mb-4">Suggestions</h2>
      <div className="flex items-center mb-4">
        <img
          src="https://via.placeholder.com/50"
          alt="Suggestion"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <p className="font-bold">Jessica Alba</p>
          <p className="text-gray-600">@jessicaalba</p>
        </div>
      </div>
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/50"
          alt="Suggestion"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <p className="font-bold">Jessica Alba</p>
          <p className="text-gray-600">@jessicaalba</p>
        </div>
      </div>
    </aside>
  );
};

export default SeachBar;
