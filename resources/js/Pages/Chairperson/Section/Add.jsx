import Authenticatedlayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Add({ auth }) {
    const { data, setData, post, errors, reset } = useForm({
        section_name: "",
        year_level: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("section.store"));
    };

    return (
        <Authenticatedlayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create Section
                    </h2>
                </div>
            }
        >
            <Head title="Class Management" />

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
                                        value="Section Code"
                                    />
                                    <TextInput
                                        id="college"
                                        type="text"
                                        name="section_name"
                                        value={data.section_name}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "section_name",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.section_name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="year" value="Role" />
                                    <SelectInput
                                        id="year"
                                        name="year_level"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "year_level",
                                                e.target.value
                                            )
                                        }
                                        value={data.year_level}
                                    >
                                        <option value="" selected hidden>
                                            Select Year
                                        </option>

                                        <option value="First Year">
                                            First Year
                                        </option>
                                        <option value="Second Year">
                                            Second Year
                                        </option>
                                        <option value="Third Year">
                                            Third Year
                                        </option>
                                        <option value="Fourth Year">
                                            Fourth Year
                                        </option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.year_level}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4 text-right">
                                    <Link
                                        href={route("section.index")}
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
