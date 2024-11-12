import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { Head, router, useForm } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";
import { IoMdPrint } from "react-icons/io";
import Swal from "sweetalert2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

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

    const handleAcademicChange = async (e) => {
        const value = e.target.value;
        setData("academic", value);

        try {
            const response = await axios.get(route("faculty_load.change"), {
                params: { academic_id: value },
            });
            setSubjects(response.data);
        } catch (error) {
            console.error("There was an error fetching the subjects:", error);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (data.academic === "") {
            Swal.fire("Please Input Academic Year!", "", "warning");
            return;
        }
    
        if (data.curriculum_id === "") {
            Swal.fire("Please Select a Subject!", "", "warning");
            return;
        }
    
        if (data.section === "") {
            Swal.fire("Please Select a Section!", "", "warning");
            return;
        }
    
        if (data.contact_hours === "" || isNaN(data.contact_hours) || Number(data.contact_hours) <= 0) {
            Swal.fire("Please Enter Valid Contact Hours!", "", "warning");
            return;
        }
    
        try {
            const response = await axios.post(route("faculty_load.store"), data);
    
            if (response.data.success) {
                Swal.fire(response.data.message, "", "success");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                Swal.fire(response.data.message, "", "error");
            }
        } catch (error) {
            console.error("Error Inserting Data", error);
            Swal.fire("The subject and section already have an instructor", "", "error");
        }
    };

    //PRINTING STUDY LOAD
    const handlePrint = (e) => {
       e.preventDefault();

       if (data.academic_year_filter) {
        router.get(route("getPrint.facultyLoad"), {
            academic_year_filter: data.academic_year_filter,
            user_id: data.user_id
        });
        } else {
            Swal.fire("", "Please Select Academic Year.", "error");
        }
    };

    const handleAdminSubmit = (e) => {
        e.preventDefault();
    
        post(route('administrative_load.store'), {
            onSuccess: () => {
                Swal.fire("Successfully Added", "", "success");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: (errors) => {
                Swal.fire(errors.user_id, '','error');
            }
        });
    };

    const handleResearchSubmit = (e) => {
        e.preventDefault();

        post(route('research_load.store'), {
            onSuccess: () => {
                Swal.fire("Successfully Added", "", "success");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: (error) => {
                Swal.fire(errors.user_id, '','error');
            }
        });
    }

    const viewAdmin = ()=> {
        router.get(route("faculty_load.view"), {
            user_id: data.user_id,
            faculty_name: faculty_info.name,
            faculty_code: faculty_info.user_code_id
        });
    }
    const handleResearch = ()=> {
        router.get(route("research_load.view"), {
            user_id: data.user_id,
            faculty_name: faculty_info.name,
            faculty_code: faculty_info.user_code_id
        });
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
                {employment_status && (employment_status.employment_status === "Full-Time" || employment_status.employment_status === "COS")  &&(
                    <div className="flex flex-col md:flex-row gap-6 py-2">
                        {/* Left Column */}
                        <div className="w-full md:w-1/2">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900 dark:text-gray-100">
                                    <form onSubmit={handleAdminSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="admin_load" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Admin Load
                                                </label>
                                                <input
                                                    type="text"
                                                    id="admin_load"
                                                    name="load_desc"
                                                    className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={data.load_desc}
                                                    onChange={(e) => setData("load_desc", e.target.value)}
                                                />
                                                <InputError message={errors.load_desc} className="mt-2" />
                                            </div>
                                            <div>
                                                <label htmlFor="admin_load" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Admin Units
                                                </label>
                                                <input
                                                    type="number"
                                                    id="admin_load"
                                                    name="units"
                                                    className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={data.units}
                                                    onChange={(e) => setData("units", e.target.value)}
                                                />
                                                <InputError message={errors.units} className="mt-2" />
                                            </div>                                        
                                            <div className="flex">
                                                <button type="submit" className=" mr-2 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                    Add Admin Load
                                                </button>
                                                <button onClick={viewAdmin} type="button" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                                    View Admin Load
                                                </button>

                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-full md:w-1/2">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900 dark:text-gray-100">
                                    <form onSubmit={handleResearchSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="research" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Research Load
                                                </label>
                                                <input
                                                    type="text"
                                                    id="research"
                                                    name="research_load"
                                                    className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={data.research_load}
                                                    onChange={(e) => setData("research_load", e.target.value)}
                                                />
                                                <InputError message={errors.research_load} className="mt-2" />
                                            </div>
                                            <div>
                                                <label htmlFor="res_units" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Research Units
                                                </label>
                                                <input
                                                    type="number"
                                                    id="res_units"
                                                    name="research_units"
                                                    className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={data.research_units}
                                                    onChange={(e) => setData("research_units", e.target.value)}
                                                />
                                                <InputError message={errors.research_units} className="mt-2" />
                                            </div>                                        
                                            <div className="flex">
                                                <button type="submit" className="mr-2 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                    Add Research Load
                                                </button>
                                                <button onClick={handleResearch} type="button" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                                    View Research Load
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                  )}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Column */}
                        <div className="w-full md:w-1/2">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900 dark:text-gray-100">
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="acad_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Academic Year
                                                </label>
                                                <select
                                                    id="acad_year"
                                                    name="academic"
                                                    className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={data.academic}
                                                    onChange={handleAcademicChange}
                                                >
                                                    <option value="" hidden>- Select Academic Year -</option>
                                                    {academic_year.map((acad) => (
                                                        <option value={acad.id} key={acad.id}>
                                                            {acad.school_year} - {acad.semester}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.academic} className="mt-2" />
                                            </div>

                                            {subjects.length > 0 && (
                                                <>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="sub"
                                                            value="Subject Code | Description | LEC | LAB "
                                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        />
                                                        <select
                                                            id="sub"
                                                            name="curriculum_id"
                                                            className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                            value={data.curriculum_id}
                                                            onChange={(e) => setData("curriculum_id", e.target.value)}
                                                        >
                                                            <option value="" hidden>Select Subject</option>
                                                            {subjects.map((sub) => (
                                                                <option key={sub.id} value={sub.id}>
                                                                    {sub.course_code} | {sub.descriptive_title} | {sub.lec} | {sub.lab} 
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <InputError message={errors.curriculum_id} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor="section"
                                                            value="Section"
                                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        />
                                                        <select
                                                            id="section"
                                                            name="section"
                                                            className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                            value={data.section}
                                                            onChange={(e) => setData("section", e.target.value)}
                                                        >
                                                            <option value="" hidden>Select Section</option>
                                                            {sections.map((sec) => (
                                                                <option key={sec.id} value={sec.id}>
                                                                    {sec.section_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <InputError message={errors.section} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor="hour"
                                                            value="Contact Hours"
                                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        />
                                                        <input
                                                            id="hour"
                                                            type="number"
                                                            name="contact_hours"
                                                            className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                            value={data.contact_hours}
                                                            placeholder="Enter Hour"
                                                            onChange={(e) => setData("contact_hours", e.target.value)}
                                                        />
                                                        <InputError message={errors.contact_hours} className="mt-2" />
                                                    </div>
                                                </>
                                            )}

                                            <div>
                                                <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                    Add Subject
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-full md:w-1/2">
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

                                            <div>
                                                <button type="submit" className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                                                    Print
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
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
                                                    Total Units: {(parseFloat(semesterTotalUnits) + parseFloat(administrative_faculty_load) + parseFloat(research_faculty_load)).toFixed(2)} |
                                                    Total Hours: {courses.reduce((acc, fl) => acc + parseFloat(fl.lec) + parseFloat(fl.lab), 0) + parseFloat(administrative_faculty_load) + parseFloat(research_faculty_load)}
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