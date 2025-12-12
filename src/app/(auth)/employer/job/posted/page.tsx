import {
  getEmploymentTypes,
  getIndustries,
} from "@/lib/actions/employer.actions";
import PostJobForm from "../components/PostJobForm";

const PostJobPage = async () => {
  const result = await getIndustries();
  const industries = (result.success && result.data) || [];
  const employmentResult = await getEmploymentTypes();
  const employmentTypes =
    (employmentResult.success && employmentResult.data) || [];
  return (
    <div className="w-full px-4 md:px-5">
      <PostJobForm industries={industries} employmentTypes={employmentTypes} />
    </div>
  );
};

export default PostJobPage;
