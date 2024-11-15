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
    curriculumYear,
}) {
    const { data, setData, post, errors, reset } = useForm({
        school_year: "",
        course: "",
        year_level: "",
        curriculum_year : ""
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

        if (data.school_year && data.course && data.year_level && data.curriculum_year) {
            router.get(route("getSearch.courseOffer"), data);
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
                </div>
            }
        >
            <Head title="Section Management" />

            <div className="py-8">
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
                                                        {prog.course_name}
                                                        {/* {
                                                            prog.course_description
                                                        } */}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="program"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Academic Year
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
                                                    - Select Academic Year &
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
                                                htmlFor="curriculumYear"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Curriculum
                                            </label>
                                            <select
                                                id="curriculumYear"
                                                name="curriculum_year"
                                                className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data.curriculum_year}
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        "curriculum_year",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" hidden>
                                                    - Choose From -
                                                </option>
                                                {curriculumYear.map((acad) => (
                                                    <option
                                                        key={acad.school_year}
                                                        value={acad.school_year}
                                                    >
                                                        {acad.school_year} Curriculum
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

        </AuthenticatedLayout>
    );
}
