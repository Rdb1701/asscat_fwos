import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";
import { LuPrinter } from "react-icons/lu";
import Swal from "sweetalert2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function Dashboard({  
    auth,
    faculty_id,
    academic_year,
    faculty_info,
    sections,
    facultyLoad,
    administrative_faculty_load,
    research_faculty_load,
    employment_status }) {

     const { data, setData, errors, post } = useForm({
        user_id: faculty_id || "",
        academic_year_filter: "",
        
    });    

    
    const [subjects, setSubjects] = useState([]);

    // Group the curriculum by year level and semester
    const groupByYearAndSemester = facultyLoad.reduce((acc, cur) => {
        const key = `${cur.school_year}/${cur.semester}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);
        return acc;
    }, {});



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

    return (
        <AuthenticatedLayout
        user={auth.user}
        header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {faculty_info.name} ({faculty_info.user_code_id}) ({employment_status && employment_status.employment_status ? employment_status.employment_status : ""})
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

                                    <div className="">                              
                              
                                    <button type="submit" className="flex bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm">
                                      <LuPrinter className="mr-1"/> Print
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
