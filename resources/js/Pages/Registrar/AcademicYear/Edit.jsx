import Authenticatedlayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Edit({ auth, academicYear }) {
    const { data, setData, post, errors, reset } = useForm({
        school_year: academicYear.data.school_year || "",
        semester: academicYear.data.semester || "",
        _method : "PUT"
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("academic.update", academicYear.data.id));
    };

    return (
        <Authenticatedlayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Academic Year
                    </h2>
                </div>
            }
        >
            <Head title="Academic year" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={handleSubmit}
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                            >
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="sy"
                                        value="School Year"
                                    />
                                    <SelectInput
                                        id="sy"
                                        name="school_year"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "school_year",
                                                e.target.value
                                            )
                                        }
                                        value={data.school_year} // Control selected value through this
                                    >
                                        <option value="" hidden>
                                            Select School Year
                                        </option>
                                        {Array.from({ length: 11 }, (_, i) => {
                                            const startYear = 2020 + i;
                                            const endYear = startYear + 1;
                                            return (
                                                <option
                                                    key={startYear}
                                                    value={`${startYear}-${endYear}`}
                                                >
                                                    {startYear}-{endYear}
                                                </option>
                                            );
                                        })}
                                    </SelectInput>

                                    <InputError
                                        message={errors.school_year}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="sem"
                                        value="Semester"
                                    />
                                    <SelectInput
                                        id="sem"
                                        name="semester"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("semester", e.target.value)
                                        }
                                        value={data.semester} // Control selected value through this
                                    >
                                        <option value="" hidden>
                                            Select Semester
                                        </option>
                                        <option value="1st Semester">
                                            1st Semester
                                        </option>
                                        <option value="2nd Semester">
                                            2nd Semester
                                        </option>
                                        <option value="Summer">Summer</option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.semester}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 text-right">
                                    <Link
                                        href={route("academic.index")}
                                        className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticatedlayout>
    );
}
