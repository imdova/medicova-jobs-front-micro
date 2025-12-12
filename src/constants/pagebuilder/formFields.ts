import { FormItem } from "@/types/blog";

export const formList: FormItem[] = [
  {
    id: "form1",
    name: "Contact Form",
    description: "A form to collect user contact information.",
    fields: [
      {
        id: "fullName",
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        rules: {
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
          maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
        },
        gridProps: { xs: 12, sm: 6 },
        textFieldProps: { variant: "outlined" },
      },
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        rules: {
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address",
          },
        },
        gridProps: { xs: 12, sm: 6 },
        textFieldProps: { variant: "outlined" },
      },
      {
        id: "message",
        name: "message",
        label: "Message",
        type: "text",
        textFieldProps: {
          placeholder: "Enter your company description",
          sx: {
            "& .MuiOutlinedInput-root": {
              p: 0,
              borderRadius: "10px",
              height: "auto",
            },
          },
          multiline: true,
          minRows: 4,
          maxRows: 14,
        },
      },
    ],
    apiEndpoint: "/api/contact",
    onSuccessMessage: "Thank you for your submission!",
    onErrorMessage: "Failed to submit the form. Please try again.",
  },
  {
    id: "form2",
    name: "Event Registration",
    description: "Register for an upcoming event.",
    fields: [
      {
        id: "event",
        name: "event",
        label: "Select Event",
        type: "select",
        required: true,
        options: [
          { label: "Tech Conference 2025", value: "tech-conf-2025" },
          { label: "AI Workshop", value: "ai-workshop" },
          { label: "Webinar Series", value: "webinar-series" },
        ],
      },
      {
        id: "attendanceType",
        name: "attendanceType",
        label: "Attendance Type",
        type: "radio",
        required: true,
        options: [
          { label: "In-Person", value: "in-person" },
          { label: "Virtual", value: "virtual" },
        ],
        dependsOn: "event",
      },
      {
        id: "dietary",
        name: "dietary",
        label: "Dietary Preferences",
        type: "select",
        multiple: true,
        options: [
          { label: "Vegetarian", value: "vegetarian" },
          { label: "Vegan", value: "vegan" },
          { label: "Gluten-Free", value: "gluten-free" },
        ],
        hideFieldNames: ["event"],
        dependsOn: "attendanceType",
        required: true,
      },
    ],
    apiEndpoint: "/api/event-registration",
    onSuccessRedirect: "/thank-you",
    onErrorRedirect: "/error",
  },
  {
    id: "form3",
    name: "User Profile",
    fields: [
      {
        id: "username",
        name: "username",
        label: "Username",
        type: "text",
        required: true,
        rules: {
          minLength: {
            value: 3,
            message: "Username must be at least 3 characters",
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message:
              "Username can only contain letters, numbers, and underscores",
          },
        },
        gridProps: { xs: 12, sm: 6 },
        textFieldProps: { variant: "filled" },
      },
      {
        id: "birthdate",
        name: "birthdate",
        label: "Date of Birth",
        type: "date",
        required: true,
        gridProps: { xs: 12, sm: 6 },
        dateFieldProps: { disableFuture: true, format: "MM/DD/YYYY" },
        rules: {
          required: { value: true, message: "Date of birth is required" },
        },
      },
      {
        id: "newsletter",
        name: "newsletter",
        label: "Subscribe to Newsletter",
        type: "checkbox",
        gridProps: { xs: 12 },
        resetFields: ["emailPreferences"],
      },
      {
        id: "emailPreferences",
        name: "emailPreferences",
        label: "Email Frequency",
        type: "select",
        options: [
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
        ],
        dependsOn: "newsletter",
      },
    ],
    apiEndpoint: "/api/user-profile",
    afterSubmitMessage: "Profile updated successfully!",
  },
  {
    id: "form4",
    name: "Feedback Form",
    description: "Provide feedback on our services.",
    fields: [
      {
        id: "rating",
        name: "rating",
        label: "Rating",
        type: "select",
        required: true,
        options: [
          { label: "1 Star", value: "1-star" },
          { label: "2 Stars", value: "2-stars" },
          { label: "3 Stars", value: "3-stars" },
          { label: "4 Stars", value: "4-stars" },
          { label: "5 Stars", value: "5-stars" },
        ],
      },
      {
        id: "comments",
        name: "comments",
        label: "Comments",
        type: "text",
        textFieldProps: {
          placeholder: "Enter your company description",
          sx: {
            "& .MuiOutlinedInput-root": {
              p: 0,
              borderRadius: "10px",
              height: "auto",
            },
          },
          multiline: true,
          minRows: 4,
          maxRows: 14,
        },
      },
      {
        id: "recommend",
        name: "recommend",
        label: "Would you recommend us?",
        type: "checkbox",
      },
    ],
    apiEndpoint: "/api/feedback",
    onSuccessMessage: "Thank you for your feedback!",
    onErrorMessage: "Failed to submit feedback. Please try again.",
    onSuccessRedirect: "/feedback/thank-you",
  },
];
