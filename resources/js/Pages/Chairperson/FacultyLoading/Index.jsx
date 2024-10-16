import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { FaTrash, FaEdit, FaPlus, FaRegEye, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Index({ auth, faculty, success, academic }) {
    const { data, setData, post, errors, reset, processing } = useForm({
        academic_id: "",
    });

    useEffect(() => {
        $(document).ready(function () {
            $("#departmentTable").DataTable();
        });
    }, []);

    const handleView = (fac) => {
        router.get(route("faculty_view.view"), {
            faculty_id: fac.id,
        });
    };

    const handleGenerate = (e) => {
        e.preventDefault();

        if (data.academic_id) {
            post(route("faculty_loads.generate"));
        } else {
            Swal.fire(
                "",
                "Please Academic Year",
                "error"
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Faculty Load
                    </h2>
                    {/* <Link
                        href={route("curriculum.create")}
                        className="text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                    >
                        <FaDownload className="mr-2" />
                        <span>Generate Faculty Loads</span>
                    </Link> */}
                </div>
            }
        >
            <Head title="Faculty Load" />
            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Search Bar Section */}
                            <form onSubmit={handleGenerate}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-1">
                                        <div>
                                            <label
                                                htmlFor="program"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Curriculum Year
                                            </label>
                                            <select
                                                id="program"
                                                name="academic_id"
                                                className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data.academic_id}
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        "academic_id",
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

                                        {/* View List Button */}
                                        <div className="mt-6">
                                            <button
                                                className="bg-yellow-600 text-white px-4 py-1 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? "Generating..."
                                                    : "Generate Faculty Loads"}
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
                                                Faculty Name
                                            </th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {faculty.map((fac) => (
                                            <tr
                                                key={fac.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-3">
                                                    {fac.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fac.role}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(fac)
                                                            }
                                                            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Delete ${fac.name}`}
                                                        >
                                                            <span className="flex">
                                                                <FaRegEye className="w-5 h-5 mr-3" />
                                                                View Faculty
                                                                Load
                                                            </span>
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
