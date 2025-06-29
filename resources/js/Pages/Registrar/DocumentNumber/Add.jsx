import Authenticatedlayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Add({ auth }) {
    const { data, setData, post, errors, reset } = useForm({
        document_number: "",
        revision_number: "",
        effective_date: "",
        for: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("document_number.store"));
    };

    return (
        <Authenticatedlayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create Doc No.
                    </h2>
                </div>
            }
        >
            <Head title="Document Number" />

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
                                        value="Document Number"
                                    />
                                    <TextInput
                                        id="doc_no"
                                        type="text"
                                        name="document_number"
                                        value={data.document_number}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "document_number",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.document_number}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="revision"
                                        value="Revision Number"
                                    />
                                    <TextInput
                                        id="rev_no"
                                        type="text"
                                        name="revision_number"
                                        value={data.revision_number}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "revision_number",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.revision_number}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="Effective Date"
                                        value="Effectivity Date"
                                    />
                                    <TextInput
                                        id="effective_date"
                                        type="date"
                                        name="effective_date"
                                        value={data.effective_date}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "effective_date",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.effective_date}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="sem" value="For" />
                                    <SelectInput
                                        id="fors"
                                        name="for"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("for", e.target.value)
                                        }
                                        value={data.for}
                                    >
                                        <option value="" selected hidden>
                                            Select
                                        </option>
                                        <option value="Course Offering">
                                            Course Offering
                                        </option>
                                        <option value="Faculty Loads">
                                            Faculty Loads
                                        </option>
                                    </SelectInput>
                                    <InputError
                                        message={errors.for}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 text-right">
                                    <Link
                                        href={route("document_number.index")}
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
