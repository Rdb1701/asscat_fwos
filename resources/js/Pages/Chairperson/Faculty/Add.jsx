import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Add({ auth, program }) {
  const { data, setData, post, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    course_id: "",
    role: "",
    position: "",
    employment_classification: "",
    employment_status: "",
    regular_load: "",
    extra_load: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("faculty_file.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Create New User
          </h2>
        </div>
      }
    >
      <Head title="Faculty" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <form onSubmit={handleSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <InputLabel htmlFor="item_desc" value="Name" />
                      <TextInput
                        id="user_name"
                        type="text"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("name", e.target.value)}
                      />
                      <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="user_email" value="Email" />
                      <TextInput
                        id="user_email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("email", e.target.value)}
                      />
                      <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="user_password" value="Password" />
                      <TextInput
                        id="user_password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("password", e.target.value)}
                      />
                      <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="user_password_confirm" value="Confirm Password" />
                      <TextInput
                        id="user_password_confirm"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                      />
                      <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="faculty_role" value="Role" />
                      <SelectInput
                        id="faculty_role"
                        name="role"
                        className="mt-1 block w-full"
                        onChange={(e) => setData("role", e.target.value)}
                        value={data.role}
                      >
                        <option value="" hidden>Select Role</option>
                        <option value="Faculty">Faculty</option>
                      </SelectInput>
                      <InputError message={errors.role} className="mt-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <InputLabel htmlFor="course" value="Program" />
                      <SelectInput
                        id="course"
                        name="course_id"
                        value={data.course_id}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("course_id", e.target.value)}
                      >
                        <option value="" hidden>Select Program</option>
                        {program.map((prog) => (
                          <option value={prog.id} key={prog.id}>
                            {prog.course_name} - {prog.course_description}
                          </option>
                        ))}
                      </SelectInput>
                      <InputError message={errors.course_id} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="emp_class" value="Employment Classification" />
                      <SelectInput
                        id="emp_class"
                        name="employment_classification"
                        value={data.employment_classification}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("employment_classification", e.target.value)}
                      >
                        <option value="" hidden>- Employment Classification -</option>
                        <option value="Teaching">Teaching</option>
                      </SelectInput>
                      <InputError message={errors.employment_classification} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="emp_stat" value="Employment Status" />
                      <SelectInput
                        id="emp_stat"
                        name="employment_status"
                        value={data.employment_status}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("employment_status", e.target.value)}
                      >
                        <option value="" hidden>- Employment Status -</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="COS">COS (Contract of Service)</option>
                      </SelectInput>
                      <InputError message={errors.employment_status} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="reg_load" value="Regular Load" />
                      <TextInput
                        id="reg_load"
                        type="number"
                        name="regular_load"
                        value={data.regular_load}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("regular_load", e.target.value)}
                      />
                      <InputError message={errors.regular_load} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="ex_load" value="Extra Load" />
                      <TextInput
                        id="ex_load"
                        type="number"
                        name="extra_load"
                        value={data.extra_load}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("extra_load", e.target.value)}
                      />
                      <InputError message={errors.extra_load} className="mt-2" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <Link
                    href={route("faculty_file.index")}
                    className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                  >
                    Cancel
                  </Link>
                  <button className="bg-emerald-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-emerald-600">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}