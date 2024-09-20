import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Index({
    auth,
    academic,
    courses,
    success,
    courseOffering,
}) {
    const { data, setData, post, errors, reset } = useForm({
        school_year: "",
        course: "",
        year_level: "",
    });
    useEffect(() => {
        $(document).ready(function () {
            $("#departmentTable").DataTable();
        });
    }, []);

    const handleDelete = (c) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("course_offering.destroy", c.id));
                Swal.fire("Deleted!", "Successfully deleted.", "success");
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (data.school_year && data.course && data.year_level) {
            router.get(route("getSearch.courseOffering"), data);
        } else {
            Swal.fire("", "Please Select Program / School Year / Year Level.", "error");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Course Offfering
                    </h2>

                    <Link
                        href={route("course_offering.create")}
                        className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        <span>Add Course Offering</span>
                    </Link>
                </div>
            }
        >
            <Head title="Section Management" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Search Bar Section */}
                            <form onSubmit={handleSearch}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-1">
                                        {/* Program Dropdown */}

                                        <div>
                                            <label
                                                htmlFor="program"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Program
                                            </label>
                                            <select
                                                id="program"
                                                name="course"
                                                className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data.course}
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        "course",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" hidden>
                                                    - Select Program -
                                                </option>
                                                {courses.map((prog) => (
                                                    <option
                                                        value={prog.id}
                                                        key={prog.id}
                                                    >
                                                        {prog.course_name} -{" "}
                                                        {
                                                            prog.course_descriptionss
                                                        }
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="program"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Curriculum Year
                                            </label>
                                            <select
                                                id="program"
                                                name="school_year"
                                                className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data.school_year}
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        "school_year",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" hidden>
                                                    - Select Curriculum Year &
                                                    Semester -
                                                </option>
                                                {academic.map((acad) => (
                                                    <option
                                                        value={acad.id}
                                                        key={acad.id}
                                                    >
                                                        {acad.school_year} -{" "}
                                                        {acad.semester}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="program"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Year Level
                                            </label>
                                            <select
                                                id="program"
                                                name="year_level"
                                                className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data.year_level}
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        "year_level",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" hidden>
                                                    - Select Year Level -
                                                </option>
                                                <option value="First Year" >
                                                    First Year
                                                </option>
                                                <option value="Second Year" >
                                                    Second Year
                                                </option>
                                                <option value="Third Year" >
                                                    Third Year
                                                </option>
                                                <option value="Fourth Year" >
                                                    Fourth Year
                                                </option>
                                                
                                                
                                            </select>
                                        </div>

                                        {/* View List Button */}
                                        <div className="mt-6">
                                            <button className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                View List
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )}
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
                                                Section Name
                                            </th>
                                            <th className="px-4 py-3">
                                                Year Level
                                            </th>
                                            <th className="px-4 py-3">
                                                Program
                                            </th>
                                            <th className="px-4 py-3">
                                                Academic Year
                                            </th>
                                            <th className="px-4 py-3">
                                                Semester
                                            </th>

                                            <th className="px-4 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseOffering.map((c) => (
                                            <tr
                                                key={c.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-3">
                                                    {c.section_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {c.year_level}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {c.course_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {c.school_year}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {c.semester}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">                                               
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(c)
                                                            }
                                                            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Delete ${c.section_name}`}
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
