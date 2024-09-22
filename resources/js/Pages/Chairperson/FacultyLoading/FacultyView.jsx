import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import Swal from 'sweetalert2';

export default function Index({
    auth,
    faculty_id,
    academic_year,
    faculty_info,
    sections,
}) {
    const {  data, setData, post, errors, reset } = useForm({
        user_id : faculty_id || "",
        academic: "",
        curriculum_id: "",
        contact_hours: "",
        section: "",
    });

    const [subjects, setSubjects] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if(data.academic !== ""){
            post(route("faculty_load.store"), {
                onSuccess: ()=>{
                    Swal.fire(
                        'Successfully Added',
                        '',
                        'success'
                    );
                },
                onError: ()=> {
                    console.log("Error Inserting Data")
                }
            });
        }else{
            
            Swal.fire(
                'Please Input Academic Year!',
                '',
                'warning'
            );
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

            <div className="py-4">
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
                                                        {subjects.map(
                                                            (sub) => (
                                                                <option
                                                                    key={
                                                                        sub.id
                                                                    }
                                                                    value={
                                                                        sub.id
                                                                    }
                                                                >
                                                                    {
                                                                        sub.course_code
                                                                    }{" "}
                                                                    |{" "}
                                                                    {
                                                                        sub.descriptive_title
                                                                    }{" "}
                                                                    |{" "}
                                                                    {
                                                                        sub.lec
                                                                    }{" "}
                                                                    |{" "}
                                                                    {
                                                                        sub.lab
                                                                    }{" "}
                                                                    |{" "}
                                                                    {
                                                                        sub.units
                                                                    }
                                                                </option>
                                                            )
                                                        )}
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
                                                    message={errors.contact_hours}
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
        </AuthenticatedLayout>
    );
}
