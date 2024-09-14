import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Index({ auth, curriculums, success }) {
    // useEffect(() => {
    //     $(document).ready(function () {
    //         $("#departmentTable").DataTable();
    //     });
    // }, []);

    const handleDelete = (cur) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this! All Data associated with this will also be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("curriculum.destroy", cur.id));
                Swal.fire("Deleted!", "Successfully deleted.", "success");
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Curriculum Management
                    </h2>

                    <Link
                        href={route("curriculum.create")}
                        className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        <span>Add Curriculum</span>
                    </Link>
                </div>
            }
        >
            <Head title="Section Management" />

            <div className="py-12">
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
                                    id=""
                                    className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                                >
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Course Code
                                            </th>
                                            <th className="px-4 py-3">
                                                Descriptive Title
                                            </th>
                                            <th className="px-4 py-3">CMO</th>
                                            <th className="px-4 py-3">HEI</th>
                                            <th className="px-4 py-3">LEC</th>
                                            <th className="px-4 py-3">LAB</th>
                                            <th className="px-4 py-3">
                                                Pre-requisite
                                            </th>
                                            <th className="px-4 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {curriculums.data.map((cur) => (
                                            <tr
                                                key={cur.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-3">
                                                    {cur.course_code}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cur.descriptive_title}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cur.cmo}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cur.hei}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cur.lec}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cur.lab}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cur.pre_requisite ? cur.pre_requisite : "None"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route(
                                                                "curriculum.edit",
                                                                cur.id
                                                            )}
                                                            className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Edit ${cur.course_code}`}
                                                        >
                                                            <FaEdit className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    cur
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Delete ${cur.course_code}`}
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
