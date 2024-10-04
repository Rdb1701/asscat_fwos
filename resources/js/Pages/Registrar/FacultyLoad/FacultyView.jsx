import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";
import { IoMdPrint } from "react-icons/io";
import Swal from "sweetalert2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { IoArrowBack } from "react-icons/io5";

export default function FacultyLoading({
    auth,
    faculty_id,
    academic_year,
    faculty_info,
    sections,
    facultyLoad,
    administrative_faculty_load,
    research_faculty_load,
    employment_status
}) {
    const { data, setData, errors, post } = useForm({
        user_id: faculty_id || "",
        academic: "",
        curriculum_id: "",
        contact_hours: "",
        section: "",
        academic_year_filter: "",
        load_desc: "",
        units: "",
        research_load: "",
        research_units: ""
    });

    const [subjects, setSubjects] = useState([]);

    // Group the curriculum by year level and semester
    const groupByYearAndSemester = facultyLoad.reduce((acc, cur) => {
        const key = `${cur.school_year}/${cur.semester}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);
        return acc;
    }, {});

    // useEffect(() => {
    //     $(document).ready(function () {
    //         $('table').each(function() {
    //             $(this).DataTable();
    //         });
    //     });
    // }, [groupByYearAndSemester]);


    const handleDelete = (fl) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("faculty_load.destroy", fl.id));
                Swal.fire("Deleted!", "Successfully deleted.", "success");
            }
        });
    };


    //PRINTING STUDY LOAD
    const handlePrint = (e) => {
       e.preventDefault();

       if (data.academic_year_filter) {
        router.get(route("getPrint.facultyload"), {
            academic_year_filter: data.academic_year_filter,
            user_id: data.user_id
        });
        } else {
            Swal.fire("", "Please Select Academic Year.", "error");
        }
    };

    const handleBack = ()=>{
       route('facultyload.index');
    }

   

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Faculty Name: {faculty_info.name} ({faculty_info.user_code_id}) ({employment_status && employment_status.employment_status ? employment_status.employment_status : ""})
                    </h2>
                </div>
            }
        >
            <Head title="Faculty Loading" />

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-section, .print-section * {
                        visibility: visible;
                    }
                    .print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
            `}</style>
            
           
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">                                    
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handlePrint}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="acad_year_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Filter:
                                        </label>
                                        <select
                                            id="acad_year_filter"
                                            name="academic_year_filter"
                                            className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={data.academic_year_filter}
                                            onChange={(e) => setData("academic_year_filter", e.target.value)}
                                        >
                                            <option value="" hidden>- Select Academic Year -</option>
                                            {academic_year.map((acad) => (
                                                <option value={acad.id} key={acad.id}>
                                                    {acad.school_year} - {acad.semester}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.academic_year_filter} className="mt-2" />
                                    </div>

                                    <div className="flex">
                                    <Link
                                        href={route(
                                            "facultyload.index"
                                        )}
                                        className="mr-2 text-center w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                      
                                    >
                                        Back
                                    </Link>
                              
                                    <button type="submit" className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                                        Print
                                    </button>
                                      
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    

                    <div className="print-section">
                        {Object.entries(groupByYearAndSemester).map(([key, courses], index) => {
                            const [school_year, semester] = key.split("/");
                            const semesterTotalUnits = courses.reduce((acc, fl) => acc + (parseFloat(fl.lec) + (parseFloat(fl.lab) * 0.75)), 0).toFixed(2);
                            return (
                                <div className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg" key={index}>
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="font-semibold text-lg mb-4">
                                            {school_year} : {semester}
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table id={`curTable-${school_year}-${semester}`} className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-600">
                                                    <tr>
                                                        <th className="px-4 py-3">Course Code</th>
                                                        <th className="px-4 py-3">Descriptive Title</th>
                                                        <th className="px-4 py-3">CMO</th>
                                                        <th className="px-4 py-3">HEI</th>
                                                        <th className="px-4 py-3">LEC</th>
                                                        <th className="px-4 py-3">LAB</th>
                                                        <th className="px-4 py-3">Pre-requisite</th>
                                                        <th className="px-4 py-3">Section</th>
                                                        <th className="px-4 py-3">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {courses.map((fl) => (
                                                        <tr key={fl.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-4 py-3">{fl.course_code}</td>
                                                            <td className="px-4 py-3">{fl.descriptive_title}</td>
                                                            <td className="px-4 py-3">{fl.cmo}</td>
                                                            <td className="px-4 py-3">{fl.hei}</td>
                                                            <td className="px-4 py-3">{fl.lec}</td>
                                                            <td className="px-4 py-3">{fl.lab}</td>
                                                            <td className="px-4 py-3">{fl.pre_requisite ? fl.pre_requisite : "None"}</td>
                                                            <td className="px-4 py-3">{fl.section_name}</td>
                                                            <td className="px-4 py-3">
                                                                <button
                                                                    onClick={() => handleDelete(fl)}
                                                                    className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                                    aria-label={`Delete ${fl.course_code}`}
                                                                >
                                                                    <FaTrash className="w-5 h-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <td className="px-4 py-3 font-semibold" colSpan="4">Total</td>
                                                        <td className="px-4 py-3 font-semibold">
                                                            {courses.reduce((acc, fl) => acc + parseFloat(fl.lec), 0)}
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold">
                                                            {courses.reduce((acc, fl) => acc + parseFloat(fl.lab), 0)}
                                                        </td>
                                                        <td colSpan="3"></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        <div className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                                <p>
                                                    Faculty Units: {semesterTotalUnits} | 
                                                    Administrative Load Units: {administrative_faculty_load} | 
                                                    Research Load Units: {research_faculty_load} |
                                                    Total Units: {(parseFloat(semesterTotalUnits) + parseFloat(administrative_faculty_load) + parseFloat(research_faculty_load)).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}