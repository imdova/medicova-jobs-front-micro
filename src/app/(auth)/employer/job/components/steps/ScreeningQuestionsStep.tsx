import React, { KeyboardEvent, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  FormControl,
  TextareaAutosize,
} from "@mui/material";
import { Add, Close, Delete, FormatSize } from "@mui/icons-material";
import { JobData } from "@/types";
import { disableEnterKey } from "@/util";

interface ScreenQuestionsProps {
  jobData: JobData;
  onSubmit: (data: Partial<JobData>) => void;
  onDraft: (data: Partial<JobData>) => void;
  onBack: (data: Partial<JobData>) => void;
  draftLoading: boolean;
  isDirty: boolean;
}

const ScreeningQuestionsStep: React.FC<ScreenQuestionsProps> = ({
  jobData,
  onBack,
  onDraft,
  onSubmit,
  draftLoading,
  isDirty,
}) => {
  const [questions, setQuestions] = useState<string[]>(jobData.questions || []);
  const [showCompany, setShowCompany] = useState(true);
  const [recieveEmails, setRecieveEmails] = useState(true);

  const [email, setEmail] = useState(jobData.jobEmail || "");
  const [isEditing, setIsEditing] = useState(jobData.jobEmail ? false : true); // To toggle the editing state
  const [emailError, setEmailError] = useState("");

  const [newQuestion, setNewQuestion] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // State to track which predefined questions have been added
  const [addedPredefinedQuestions, setAddedPredefinedQuestions] = useState<{
    [key: string]: boolean;
  }>({
    workExperience: false,
    dataFlow: false,
    Prometric: false,
    healthLiscence: false,
    driverLiscence: false,
    language: false,
    location: false,
  });

  const predefinedQuestionLabels: { [key: string]: string } = {
    workExperience: "Work Experience",
    dataFlow: "Data Flow Report",
    prometric: "Prometric Exam",
    healthLiscence: "Health License",
    driverLiscence: "Driver License",
    language: "Language Proficiency",
    location: "Location Preference",
  };

  const predefinedQuestions = {
    workExperience:
      "How many years of [Job Function] experience do you have currently have?",
    dataFlow: "Do you have a valid data flow Report from [Country]?",
    prometric: "Have you passed Prometric Exam from [Country]?",
    healthLiscence: "Do you have a valid Health Liscence from [Country]?",
    driverLiscence: "Do you have a valid Driver Liscence?",
    language: "What is your level of proficiency in [Language]?",
    location: "Are you comfortable communting to this job's [Location]?",
  };

  const handleAddOrEditQuestion = () => {
    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      const originalQuestion = questions[editingIndex];
      updatedQuestions[editingIndex] = newQuestion;
      setQuestions(updatedQuestions);

      const predefinedKey = Object.keys(predefinedQuestions).find(
        (key) =>
          predefinedQuestions[key as keyof typeof predefinedQuestions] ===
          originalQuestion,
      );

      if (
        predefinedKey &&
        !updatedQuestions.includes(
          predefinedQuestions[
            predefinedKey as keyof typeof predefinedQuestions
          ],
        )
      ) {
        setAddedPredefinedQuestions((prev) => ({
          ...prev,
          [predefinedKey]: false,
        }));
      }

      setEditingIndex(null);
      setNewQuestion("");
    } else {
      if (newQuestion.trim() === "") {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        return;
      }
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    }
  };

  const handleDelete = (index: number) => {
    const questionToDelete = questions[index];
    setQuestions(questions.filter((_, i) => i !== index));

    const predefinedKey = Object.keys(predefinedQuestions).find(
      (key) =>
        predefinedQuestions[key as keyof typeof predefinedQuestions] ===
        questionToDelete,
    );
    if (predefinedKey) {
      setAddedPredefinedQuestions((prev) => ({
        ...prev,
        [predefinedKey]: false,
      }));
    }
  };

  const handleAddPredefinedQuestion = (
    key: keyof typeof predefinedQuestions,
  ) => {
    if (!addedPredefinedQuestions[key]) {
      setQuestions([...questions, predefinedQuestions[key]]);
      setAddedPredefinedQuestions((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      onSubmit({
        questions: questions,
        showCompany,
        recieveEmails,
        jobEmail: email,
      });
    } else {
      setIsEditing(true);
    }
  };
  const handleBack = () => {
    onBack({
      questions: questions,
      showCompany,
      recieveEmails,
      jobEmail: email,
    });
  };
  const handleDraft = () => {
    onDraft({
      questions: questions,
      showCompany,
      recieveEmails,
      jobEmail: email,
    });
  };

  const validateEmail = (): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let errorMessage = "";

    if (!email.trim()) {
      errorMessage = "Job email is required";
    } else if (!re.test(email.trim())) {
      errorMessage = "Job email is not valid";
    }

    setEmailError(errorMessage);
    return errorMessage === "";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && email.trim()) {
      e.preventDefault();
      if (validateEmail()) {
        setIsEditing(false);
      }
    }
  };
  const handleQuestionKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && email.trim()) {
      e.preventDefault();
      handleAddOrEditQuestion();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={disableEnterKey}
      className="mb-4 rounded-base border border-gray-100 bg-white p-4 shadow-lg"
    >
      <div className="rounded-md bg-green-50 p-3">
        <div className="m-4">
          <label className="mb-2 text-lg font-semibold text-main">
            Screening Questions
          </label>
          <p className="text-sm text-muted-foreground">
            Add screening questions to get 5 to 10x better results!
          </p>
        </div>
        {showAlert && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You cannot save an empty value for a question!
          </Alert>
        )}
        <div className="mb-2 flex gap-2">
          <div className="flex flex-1 items-center gap-2">
            <div className="mr-3 rounded-full bg-primary p-1 text-primary-foreground">
              <FormatSize />
            </div>
            <TextField
              fullWidth
              placeholder="Write a new question here"
              value={newQuestion}
              onKeyDown={handleQuestionKeyDown}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </div>
          <IconButton
            onClick={handleAddOrEditQuestion}
            className="rounded border border-solid border-gray-200 p-2"
          >
            <Add />
          </IconButton>
          {editingIndex !== null && (
            <IconButton
              onClick={() => {
                setNewQuestion("");
                setEditingIndex(null);
              }}
              className="rounded border border-solid border-gray-200 p-2"
            >
              <Close />
            </IconButton>
          )}
        </div>

        <List sx={{ mb: 4 }}>
          {questions.map((question, index) => (
            <ListItem
              key={index}
              className="mb-1 rounded-base border bg-white pr-10"
            >
              <div className="mr-3 rounded-full bg-primary p-1 text-primary-foreground">
                <FormatSize />
              </div>
              {/* <ListItemText secondary={formatQuestionText(question)} /> */}
              <TextareaAutosize
                minRows={1}
                maxRows={10}
                placeholder={`Question ${index+1}`}
                value={question}
                onChange={(e) =>
                  setQuestions((pv) =>
                    pv.map((q, i) => (i === index ? e.target.value : q)),
                  )
                }
                className="w-full resize-none tracking-tight focus:outline-none"
              />
              <ListItemSecondaryAction>
                {/* <IconButton
                  onClick={() => handleEdit(index)}
                  className="m-1 rounded border border-solid border-gray-300 p-1 text-primary"
                >
                  <Edit />
                </IconButton> */}
                <IconButton
                  color="error"
                  onClick={() => handleDelete(index)}
                  className="m-1 rounded border border-solid border-gray-300 p-1"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}

          <h6 className="mb-2 text-2xl font-semibold text-main">
            Ready Questions
          </h6>
          <div className="flex flex-wrap gap-2">
            {(
              Object.keys(predefinedQuestions) as Array<
                keyof typeof predefinedQuestions
              >
            ).map((key) => (
              <Button
                key={key}
                variant="outlined"
                onClick={() => handleAddPredefinedQuestion(key)}
                disabled={addedPredefinedQuestions[key]}
                className={`${addedPredefinedQuestions[key] ? "text-muted-foreground" : "text-primary"} flex items-center border-primary p-2 normal-case`}
              >
                {predefinedQuestionLabels[key] ||
                  key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>
        </List>

        {/* Job Options */}

        <h6 className="mb-2 text-2xl font-semibold text-main">Job Options</h6>
        <div className="flex flex-wrap justify-between gap-4 p-2">
          <div className="flex-1">
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCompany}
                    onChange={(e) => setShowCompany(e.target.checked)}
                    color="primary"
                  />
                }
                label="Keep Company Confidential"
              />
            </FormControl>
          </div>

          <div className="flex flex-1 flex-col items-start gap-2">
            <label className="mb-2 text-lg font-semibold text-main">
              Send email notification when there are good candidates:
            </label>
            <RadioGroup
              row
              defaultValue={"yes"}
              onChange={(e) => setRecieveEmails(e.target.value === "yes")}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>

            <div className="flex items-center gap-2">
              <p>Recipient Email: </p>
              {isEditing ? (
                <TextField
                  value={email}
                  sx={{ height: 35, bgcolor: "white" }}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  onKeyDown={handleKeyDown}
                  variant="standard"
                  className="h-[35px] w-full sm:w-56"
                />
              ) : (
                <span>{email}</span>
              )}
            </div>
            <p className="text-xs text-red-500">{emailError}</p>

            {!isEditing && (
              <Button
                variant="text"
                className="p-0 text-main hover:underline"
                onClick={() => setIsEditing(true)}
              >
                Change email address
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="space-between mt-5 flex gap-2 md:justify-end">
        <Button onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Button
          onClick={handleDraft}
          disabled={draftLoading || !isDirty}
          className="bg-[#FFAE35] text-[#464748] hover:enabled:bg-[#e19e39] disabled:opacity-50"
        >
          {draftLoading ? "Loading... " : "Save and Publish Later"}
        </Button>
        <Button type="submit" variant="contained">
          next
        </Button>
      </div>
    </form>
  );
};

export default ScreeningQuestionsStep;
