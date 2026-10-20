import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addAccount } from "../store/accountsSlice";
import { industries } from "../data/dummyData";

// Common Tailwind classes reused by every input
const inputClass = "w-full border border-gray-300 rounded px-3 py-2";
// Classes for the red validation message
const errorClass = "text-red-600 text-sm mt-1";

export default function AccountForm({ onSaved }) {
  const dispatch = useDispatch();

  // Read existing accounts so we can stop duplicate emails
  const accounts = useSelector((state) => state.accounts.list);

  // React Hook Form:
  // register -> connects an input to the form
  // handleSubmit -> runs validation, then calls our function only if everything is valid
  // errors -> contains the validation messages
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Runs only when all fields are valid
  const onSubmit = (data) => {
    const newAccount = {
      id: Date.now(), // simple unique id
      ...data,
      accountStatus: data.accountStatus === "true", // dropdown gives text, convert to boolean
    };
    dispatch(addAccount(newAccount)); // save in Redux store
    reset(); // clear the form
    onSaved(); // go back to the table
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Account</h2>

      {/* grid: 1 column on mobile, 2 columns on medium screens and above */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Name */}
        <div>
          <label className="block text-sm mb-1">Account Name *</label>
          <input
            className={inputClass}
            {...register("accountName", {
              required: "Account name is required",
              minLength: { value: 2, message: "Enter at least 2 characters" },
              maxLength: { value: 50, message: "Maximum 50 characters allowed" },
            })}
          />
          {errors.accountName && <p className={errorClass}>{errors.accountName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email *</label>
          <input
            className={inputClass}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                message: "Enter a valid email address",
              },
              // custom rule: email must not already be in the table
              validate: (value) =>
                !accounts.some((a) => a.email.toLowerCase() === value.toLowerCase()) ||
                "This email already exists",
            })}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm mb-1">Phone No. *</label>
          <input
            className={inputClass}
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^[0-9]{10}$/, message: "Phone must be exactly 10 digits" },
            })}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm mb-1">Website *</label>
          <input
            placeholder="https://example.com"
            className={inputClass}
            {...register("website", {
              required: "Website is required",
              pattern: {
                value: /^https?:\/\/[\w-]+(\.[\w-]+)+(\/\S*)?$/i,
                message: "Enter a valid URL starting with http:// or https://",
              },
            })}
          />
          {errors.website && <p className={errorClass}>{errors.website.message}</p>}
        </div>

        {/* Industry dropdown */}
        <div>
          <label className="block text-sm mb-1">Industry *</label>
          <select
            className={inputClass}
            {...register("industry", { required: "Please select an industry" })}
          >
            <option value="">Select industry</option>
            {industries.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {errors.industry && <p className={errorClass}>{errors.industry.message}</p>}
        </div>

        {/* Account Status dropdown */}
        <div>
          <label className="block text-sm mb-1">Account Status *</label>
          <select
            className={inputClass}
            {...register("accountStatus", { required: "Please select a status" })}
          >
            <option value="">Select status</option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          {errors.accountStatus && <p className={errorClass}>{errors.accountStatus.message}</p>}
        </div>

        {/* Remark (takes the full width on medium screens) */}
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Remark *</label>
          <textarea
            rows={3}
            className={inputClass}
            {...register("remark", {
              required: "Remark is required",
              minLength: { value: 3, message: "Enter at least 3 characters" },
              maxLength: { value: 100, message: "Maximum 100 characters allowed" },
            })}
          />
          {errors.remark && <p className={errorClass}>{errors.remark.message}</p>}
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Reset
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
