import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Index({
    auth,
    faculty_id,
    academic_year,
    faculty_info,
    sections,
    facultyLoad,
    success,
}) {
    const { data, setData, post, errors, reset } = useForm({
        user_id: faculty_id || "",
        academic: "",
        curriculum_id: "",
        contact_hours: "",
        section: "",
        academic_year_filter: "",
    });

    useEffect(() => {
     
        $(document).ready(function () {
            $("#curTable").DataTable();
        });
    }, []);

    const [subjects, setSubjects] = useState([]);

    //when academic select change
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
    
        // Validation checks
        if (data.academic === "") {
            Swal.fire("Please Input Academic Year!", "", "warning");
            return;
        }
    
        if (data.subject === "") {
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
                // Reset form or redirect as needed
            } else {
                Swal.fire(response.data.message, "", "error");
            }
        } catch (error) {
            console.error("Error Inserting Data", error);
            Swal.fire("The subject and section already have an instructor", "", "error");
        }
    };
    

    const handleSearch = (e) => {
        e.preventDefault();
        if (data.academic_year_filter) {
            router.get(
                route("getSearch.facultyLoad"),
                data.academic_year_filter
            );
        } else {
            Swal.fire("", "Please Select Academic Year", "warning");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Faculty Name: {faculty_info.name} (
                        {faculty_info.user_code_id})
                    </h2>
                </div>
            }
        >
            <Head title="Faculty Loading" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit}>
                                <div className="justify-between items-center mb-1">
                                    <div className="items-center space-x-1">
                                        <div>
                                            <label
                                                htmlFor="acad_year"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Academic Year
                                            </label>
                                            <select
                                                id="acad_year"
                                                name="academic"
                                                className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data.academic}
                                                onChange={handleAcademicChange}
                                            >
                                                <option value="" hidden>
                                                    - Select Academic Year -
                                                </option>
                                                {academic_year.map((acad) => (
                                                    <option
                                                        value={acad.id}
                                                        key={acad.id}
                                                    >
                                                        {acad.school_year} -{" "}
                                                        {acad.semester}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.academic}
                                                className="mt-2"
                                            />
                                        </div>

                                        {subjects.length > 0 && (
                                            <>
                                                <div>
                                                    <InputLabel
                                                        htmlFor="sub"
                                                        value="Subject Code | Description | LEC | LAB | UNITS | "
                                                        className="block text-sm font-medium text-white-700"
                                                    />

                                                    <select
                                                        id="sub"
                                                        name="curriculum_id"
                                                        className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        value={data.subject}
                                                        onChange={(e) =>
                                                            setData(
                                                                "curriculum_id",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="" hidden>
                                                            Select Subject
                                                        </option>
                                                        {subjects.map((sub) => (
                                                            <option
                                                                key={sub.id}
                                                                value={sub.id}
                                                            >
                                                                {
                                                                    sub.course_code
                                                                }{" "}
                                                                |{" "}
                                                                {
                                                                    sub.descriptive_title
                                                                }{" "}
                                                                | {sub.lec} |{" "}
                                                                {sub.lab} |{" "}
                                                                {sub.units}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <InputError
                                                        message={
                                                            errors.curriculum_id
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel
                                                        htmlFor="sub"
                                                        value="Section "
                                                        className="block text-sm font-medium text-white-700"
                                                    />

                                                    <select
                                                        id="sub"
                                                        name="section"
                                                        className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        value={data.section}
                                                        onChange={(e) =>
                                                            setData(
                                                                "section",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="" hidden>
                                                            Select Section
                                                        </option>
                                                        {sections.map((sec) => (
                                                            <option
                                                                key={sec.id}
                                                                value={sec.id}
                                                            >
                                                                {
                                                                    sec.section_name
                                                                }
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <InputError
                                                        message={errors.section}
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel
                                                        htmlFor="hour"
                                                        value="Contact Hours"
                                                        className="block text-sm font-medium text-white-700"
                                                    />

                                                    <input
                                                        id="hour"
                                                        type="number"
                                                        name="contact_hours"
                                                        className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        value={
                                                            data.contact_hours
                                                        }
                                                        placeholder="Enter Hour"
                                                        onChange={(e) =>
                                                            setData(
                                                                "contact_hours",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <InputError
                                                    message={
                                                        errors.contact_hours
                                                    }
                                                    className="mt-2"
                                                />
                                            </>
                                        )}
                                        {/* View List Button */}
                                        <div className="mt-6">
                                            <button className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                Add Subject
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
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Search Bar Section */}
                            <form onSubmit={handleSearch}>
                                <div className=" justify-between items-center mb-1">
                                    <div className=" items-center space-x-1">
                                        <div>
                                            <label
                                                htmlFor="acad_year"
                                                className="block text-sm font-medium text-white-700"
                                            >
                                                Filter:
                                            </label>
                                            <select
                                                id="acad_year"
                                                name="academic"
                                                className="mt-1 text-black block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={
                                                    data.academic_year_filter
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "academic_year_filter",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" hidden>
                                                    - Select Academic Year -
                                                </option>
                                                {academic_year.map((acad) => (
                                                    <option
                                                        value={acad.id}
                                                        key={acad.id}
                                                    >
                                                        {acad.school_year} -{" "}
                                                        {acad.semester}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={
                                                    errors.academic_year_filter
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="mt-6">
                                            <button className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                View Load
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
                    {/* {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )} */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table
                                    id="curTable"
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
                                                Section
                                            </th>
                                            <th className="px-4 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facultyLoad.map((fl) => (
                                            <tr
                                                key={fl.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-3">
                                                    {fl.course_code}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fl.descriptive_title}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fl.cmo}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fl.hei}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fl.lec}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fl.lab}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fl.pre_requisite
                                                        ? fl.pre_requisite
                                                        : "None"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fl.section_name}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(fl)
                                                            }
                                                            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Delete ${fl.course_code}`}
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
