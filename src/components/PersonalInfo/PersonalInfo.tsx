import { JSX } from "solid-js";

export interface PersonalInfoFields {
  firstName: string;
  lastName: string;
  email: string;
}

interface PersonalFieldsProps {
  personalInfo: PersonalInfoFields;
  errors: Record<string, string>;
  setFormData: (data: PersonalInfoFields) => void;
}

export function PersonalInfo(props: PersonalFieldsProps): JSX.Element {
  return (
    <>
      <h3>Personal Info</h3>
      {["firstName", "lastName", "email"].map((field) => (
        <label>
          <span class="label-text">
            {field.replace(/^\w/, (c) => c.toUpperCase())}
          </span>
          <input
            type={field === "email" ? "email" : "text"}
            id={field}
            name={field}
            placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
            value={props.personalInfo[field as keyof PersonalInfoFields]}
            onInput={(e) =>
              props.setFormData({
                ...props.personalInfo,
                [field]: (e.target as HTMLInputElement).value,
              })
            }
          />
          <span class="error-text">{props.errors[field]}</span>
        </label>
      ))}
    </>
  );
}
