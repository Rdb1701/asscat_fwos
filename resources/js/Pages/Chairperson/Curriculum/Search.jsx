import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { FaTrash, FaEdit, FaPlus, FaPrint, FaFileExcel } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Index({
    auth,
    curriculum,
    program,
    school_year,
    curriculum_year,
    noDataFound,
}) {
    // Group the curriculum by year level and semester
    const groupByYearAndSemester = curriculum.reduce((acc, cur) => {
        const key = `${cur.year_level}-${cur.semester}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);

        // console.log(acc);
        return acc;
    }, {});

    // Check if there is no data to display
    const isEmpty =
        noDataFound || Object.keys(groupByYearAndSemester).length === 0;

    const handleClick = (program, school_year) => {
        router.get(route("getPrint.curriculum"), {
            course: program,
            school_year: curriculum_year,
            curriculum_year: school_year,
        });
    };

    const handleClickExcel = (program, school_year) => {
        router.get(route("getPrintExcel.curriculum"), {
            course: program,
            school_year: curriculum_year,
            curriculum_year: school_year,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {program.course_description} (SY: {school_year})
                    </h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleClick(program.id, school_year)}
                            className="text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                        >
                            <FaPrint className="mr-2" /> Print
                        </button>
                        
                    <button
                        onClick={() =>
                            handleClickExcel(
                                program.id,
                                school_year
                            )
                        }
                        className="text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                    >
                        <FaFileExcel className="mr-2" /> Export
                    </button>
                    </div>
                    {/* <Link
                        href={route("getPrint.curriculum")}
                        className="text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                  
                    >
                        <FaPrint className="mr-2" /> Print
                    </Link> */}
                </div>
            }
        >
            <Head title="Curriculum Management" />
            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="text-center font-bold">
                                CURRICULUM
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            {isEmpty ? (
                <div className="text-center text-red-600 font-bold py-5">
                    No data found
                </div>
            ) : (
                // Wrap all tables in a single container for printing
                <div id="tablesToPrint">
                    {Object.entries(groupByYearAndSemester).map(
                        ([key, courses], index) => {
                            const [yearLevel, semester] = key.split("-");

                            // Calculate total units for CMO, HEI, LEC, and LAB
                            const totalCMO = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.cmo || 0),
                                0
                            );
                            const totalHEI = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.hei || 0),
                                0
                            );
                            const totalLEC = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.lec || 0),
                                0
                            );
                            const totalLAB = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.lab || 0),
                                0
                            );

                            return (
                                <div className="py-3 page-break" key={index}>
                                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                                <div
                                                    key={index}
                                                    className="mb-8"
                                                >
                                                    <h3 className="font-semibold text-lg mb-4">
                                                        {yearLevel} : {semester}
                                                    </h3>
                                                    <div className="overflow-x-auto">
                                                        <table className="datatable w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-600">
                                                                <tr>
                                                                    <th className="px-4 py-3">
                                                                        Course
                                                                        Code
                                                                    </th>
                                                                    <th className="px-4 py-3">
                                                                        Descriptive
                                                                        Title
                                                                    </th>
                                                                    <th className="px-4 py-3">
                                                                        CMO
                                                                    </th>
                                                                    <th className="px-4 py-3">
                                                                        HEI
                                                                    </th>
                                                                    <th className="px-4 py-3">
                                                                        LEC
                                                                    </th>
                                                                    <th className="px-4 py-3">
                                                                        LAB
                                                                    </th>
                                                                    <th className="px-4 py-3">
                                                                        Pre-requisite
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {courses.map(
                                                                    (cur) => (
                                                                        <tr
                                                                            key={
                                                                                cur.id
                                                                            }
                                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                        >
                                                                            <td className="px-4 py-3">
                                                                                {
                                                                                    cur.course_code
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {
                                                                                    cur.descriptive_title
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {
                                                                                    cur.cmo
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {
                                                                                    cur.hei
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {
                                                                                    cur.lec
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {
                                                                                    cur.lab
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {cur.pre_requisite
                                                                                    ? cur.pre_requisite
                                                                                    : "None"}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                            <tfoot>
                                                                <tr className="font-semibold bg-gray-100 dark:bg-gray-700">
                                                                    <td
                                                                        className="px-4 py-3"
                                                                        colSpan="2"
                                                                    >
                                                                        Total
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {
                                                                            totalCMO
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {
                                                                            totalHEI
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {
                                                                            totalLEC
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {
                                                                            totalLAB
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-3"></td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
