import { LanguageOutlined } from "@mui/icons-material";
import { UserProfile } from "@/types/seeker";

type LanguageSectionProps = {
  user: UserProfile;
};

const SeekerPublicLanguages: React.FC<LanguageSectionProps> = ({ user }) => {
  const languageData = user.languages || [];

  return (
    <div className="rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-xl font-semibold text-main">Languages</h3>
      </div>
      <div>
        {!languageData.length && (
          <p className="text-muted-foreground">No Language data found.</p>
        )}
        {languageData.map((language, index) => (
          <div key={index}>
            <p className="my-2 text-muted-foreground">
              <LanguageOutlined className="mr-2 inline-block" color="primary" />
              <span className="font-semibold text-main">
                {language.name} :
              </span>{" "}
              {language.proficiency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeekerPublicLanguages;
