
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { FaTrash, FaEdit, FaPlus, FaUpload, FaFileExcel  } from "react-icons/fa";
import Swal from "sweetalert2";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Index({
    auth,
    curriculums,
    programs,
    academic,
    success,
    cur_error
}) {
    const [isOpen, setIsOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    const { data, setData, post, processing, errors, reset } = useForm({
        course: "",
        school_year: "",
        curriculum_year: "",
        excel_file: null,
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        $(document).ready(function () {
            $("#curTable").DataTable({
                pageLength: 100,
                order: [[9, "asc"], [1, "asc"]], // First sort by semester (column 9), then by descriptive title (column 1)
                columnDefs: [
                    {
                        targets: [9], // Semester column
                        orderable: true,
                        type: 'string',
                        render: function(data) {
                            // Convert semester text to a sortable value
                            const semesterMap = {
                                'First': '1',
                                'Second': '2',
                                'Summer': '3'
                            };
                            return semesterMap[data] || data;
                        }
                    },
                    {
                        targets: [1], // Descriptive title column
                        orderable: true
                    },
                    {
                        targets: [11], // Action column
                        orderable: false
                    }
                ],
                // Add dropdown filter for semester
                initComplete: function () {
                    this.api().columns(9).every(function () {
                        const column = this;
                        const select = $('<select class="ml-2"><option value="">All Semesters</option></select>')
                            .appendTo($(column.header()))
                            .on('change', function () {
                                const val = $.fn.dataTable.util.escapeRegex($(this).val());
                                column
                                    .search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                            });
    
                        column.data().unique().sort().each(function (d) {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        });
                    });
                }
            });
        });
    
        // Clean up DataTable on component unmount
        return () => {
            $("#curTable").DataTable().destroy(true);
        };
    }, []);
    const handleSearch = (e) => {
        e.preventDefault();

        if (data.course && data.school_year && data.curriculum_year) {
            router.get(route("getSearch.curriculum"), data);
        } else {
            Swal.fire("", "Please Select Program, School Year and Curriculum Year.", "error");
        }
    };

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

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setData("excel_file", file);
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        
        if (!data.excel_file) {
            Swal.fire("", "Please select an Excel file to upload.", "error");
            return;
        }
    
        const formData = new FormData();
        formData.append('excel_file', data.excel_file);
    
        post(route("curriculum.import"))
       
                setIsOpen(false)
         
                reset('excel_file');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
       
    };


    const handleTemplate = () => {
       
        const fileUrl = '/CurriculumTemplate.xlsx'; 
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'CurriculumTemplate.xlsx'; 
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Curriculum Management
                    </h2>

                    <div className="flex space-x-4">
                        <Link
                            href={route("curriculum.create")}
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                        >
                            <FaPlus className="mr-2" />
                            <span>Add Subject</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                        >
                            <FaUpload className="mr-2" />
                            <span>Upload Excel</span>
                        </button>


                        <button
                            type="button"
                            onClick={handleTemplate}
                            className="text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                        >
                            <FaFileExcel className="mr-2" />
                            <span>Download Template</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Curriculum File" />
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
                                                {programs.map((prog) => (
                                                    <option
                                                        value={prog.id}
                                                        key={prog.id}
                                                    >
                                                        {prog.course_name} -{" "}
                                                        {
                                                            prog.course_description
                                                        }
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Curriculum Year Dropdown */}
                                        <div>
                                            <label
                                                htmlFor="curricul"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                School Year
                                            </label>
                                            <select
                                                id="curricul"
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
                                                    - Select SY -
                                                </option>
                                                <option value="2024-2025">2024-2025</option>
                                                <option value="2025-2026">2025-2026</option>
                                                <option value="2026-2027">2026-2027</option>
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
                                                    - Choose From -
                                                </option>
                                                {academic.map((acad) => (
                                                    <option
                                                        key={acad.school_year}
                                                        value={acad.school_year}
                                                    >
                                                        {acad.school_year} Curriculum
                                                    </option>
                                                ))}
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

            <div className="py-1">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )}
                    {cur_error && (
                        <div className="bg-red-500 py-2 px-4 text-white rounded mb-4">
                            {cur_error}
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table
                                    id="curTable"
                                    className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                                >
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-4 py-3">Course Code</th>
                                            <th className="px-4 py-3">Descriptive Title</th>
                                            <th className="px-4 py-3">CMO</th>
                                            <th className="px-4 py-3">HEI</th>
                                            <th className="px-4 py-3">LEC</th>
                                            <th className="px-4 py-3">LAB</th>
                                            <th className="px-4 py-3">Pre-requisite</th>
                                            <th className="px-4 py-3">SPECIALIZATION</th>
                                            <th className="px-4 py-3">PROGRAM</th>
                                            <th className="px-4 py-3">SEMESTER</th>
                                            <th className="px-4 py-3">EFFECTIVITY YEAR</th>
                                            <th className="px-4 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {curriculums.data.map((cur) => (
                                            <tr
                                                key={cur.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-3">{cur.course_code}</td>
                                                <td className="px-4 py-3">{cur.descriptive_title}</td>
                                                <td className="px-4 py-3">{cur.cmo}</td>
                                                <td className="px-4 py-3">{cur.hei}</td>
                                                <td className="px-4 py-3">{cur.lec}</td>
                                                <td className="px-4 py-3">{cur.lab}</td>
                                                <td className="px-4 py-3">{cur.pre_requisite ? cur.pre_requisite : "None"}</td>
                                                <td className="px-4 py-3">{cur.specialization_name ? cur.specialization_name : "None"}</td>
                                                <td className="px-4 py-3">{cur.course_name}</td>
                                                <td className="px-4 py-3">{cur.semester}</td>
                                                <td className="px-4 py-3">{cur.efectivity_year}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route("curriculum.edit", cur.id)}
                                                            className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Edit ${cur.course_code}`}
                                                        >
                                                            <FaEdit className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(cur)}
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

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Upload Excel File
                                    </Dialog.Title>
                                    <form onSubmit={handleUploadSubmit}>
                                        <div className="mt-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                accept=".xlsx,.xls"
                                                className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            />
                                        </div>

                                        <div className="mt-4 flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                disabled={processing}
                                            >
                                                {processing ? 'Uploading...' : 'Upload'}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AuthenticatedLayout>
    );
}