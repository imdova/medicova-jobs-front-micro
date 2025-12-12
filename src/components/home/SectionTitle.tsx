type Props = {
  title: string;
  featured: string;
};
const SectionTitle: React.FC<Props> = ({ featured, title }) => {
  return (
    <h4 className="mb-6 text-center text-[45px] font-bold leading-none text-secondary md:text-[50px]">
      <span className="text-[45px] font-bold text-main md:text-[50px]">
        {title}
      </span>{" "}
      {featured}
    </h4>
  );
};

export default SectionTitle;
