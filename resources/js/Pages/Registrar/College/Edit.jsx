import Authenticatedlayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Edit({ auth, college }) {
    const { data, setData, post, errors, reset } = useForm({
        department_name: college.data.department_name || "",
        department_description: college.data.department_description || "",
        _method : "PUT"
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("department.update", college.data.id));
    };

    return (
        <Authenticatedlayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit College
                    </h2>
                </div>
            }
        >
            <Head title="College Management" />

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
                                        htmlFor="college"
                                        value="College Code"
                                    />
                                    <TextInput
                                        id="college"
                                        type="text"
                                        name="department_name"
                                        value={data.department_name}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "department_name",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.department_name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="college_description"
                                        value="College Description"
                                    />
                                    <TextInput
                                        id="college_description"
                                        type="text"
                                        name="department_description"
                                        value={data.department_description}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "department_description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.department_description}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 text-right">
                                    <Link
                                        href={route("department.index")}
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
