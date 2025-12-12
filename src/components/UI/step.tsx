
type StepProps = {
    number: number;
    title: string;
    description: string;
    Icon: React.ElementType;
};

const Step = ({ number, title, description, Icon }: StepProps) => {
    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                    {number}
                </div>
            </div>
            <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                    <Icon className="h-5 w-5 text-indigo-500" /> {title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}

export default Step;