function getRandomNumber(min = 40, max = 160) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SkillsSkeleton = () => {
  return (
    <div className="mt-2 flex flex-wrap">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          style={{ width: `${getRandomNumber()}px` }}
          className="mb-2 mr-2 animate-pulse rounded-full border border-gray-200 bg-gray-200 px-2 py-2 pl-4 text-transparent"
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default SkillsSkeleton;
