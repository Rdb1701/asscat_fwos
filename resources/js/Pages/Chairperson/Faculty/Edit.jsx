import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { FaTrash, FaEdit, FaPlus, FaKey } from "react-icons/fa";
import Swal from 'sweetalert2';

export default function Add({ auth, program, faculty_edit, user_department, user_employment, specializations, specialization_select }) {
  const { data, setData, post,put, errors } = useForm({
    name: faculty_edit.data.name || "",
    email: faculty_edit.data.email || "",
    course_id: faculty_edit.data.course_id || "",
    role: faculty_edit.data.role || "",
    employment_classification: user_employment.employment_classification || "",
    employment_status:  user_employment.employment_status || "",
    regular_load: user_employment.regular_load || "",
    extra_load: user_employment.extra_load || "",
    specialization : ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("faculty_file.update", faculty_edit.data.id));
  };

  const handleDelete = (spec) => {
    Swal.fire({
        title: "Are you sure?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
          router.delete(route("faculty_specialization.destroy", { id: spec.id, faculty_id: faculty_edit.data.id }));

            Swal.fire("Deleted!", "Successfully deleted.", "success");
        }
    });
};

  const handleSpecialization  = (e)=> {
    e.preventDefault();

    post(route("faculty_specialization.store", faculty_edit.data.id));
    Swal.fire("", "Successfully Added.", "success");
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit New User
          </h2>
        </div>
      }
    >
      <Head title="Faculty" />

      <div className="py-2">
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
                  </div>

                  <div className="space-y-4">
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
               
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
            <h1 className="text-lg">Add Specialization</h1>
              <form onSubmit={handleSpecialization} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="">
                  <div className="space-y-4">

                  <div>
                      <InputLabel htmlFor="special_" value="Specilization Status" />
                      <SelectInput
                        id="special_"
                        name="specialization"
                        value={data.specialization}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("specialization", e.target.value)}
                      >
                        <option value="" hidden>- Sepecilization -</option>
                        {specialization_select.map((spec)=>(
                          <option value={spec.id} >{spec.name}</option>
                        ))}
                      </SelectInput>
                      <InputError message={errors.specialization} className="mt-2" />
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


      <div className="py-1">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table
                                    id="departmentTable"
                                    className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                                >
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Specialization
                                            </th>
                                          
                                            <th className="px-4 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specializations.map((spec) => (
                                            <tr
                                                key={spec.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-3">
                                                    {spec.name}
                                                </td>
                                             
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">              
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    spec
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Delete ${spec.name}`}
                                                        >
                                                            <FaTrash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </AuthenticatedLayout>
  );
}