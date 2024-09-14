import Authenticatedlayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Add({ auth, programs,chair_edit }) {
    const { data, setData, post, errors, reset } = useForm({
        name: chair_edit.data.name || "",
        email:chair_edit.data.email || "",
        role: chair_edit.data.role || "",
        course_id: chair_edit.data.course_id || "",
        _method: "PUT"
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("chairAccount.update", chair_edit.data.id));
    };

    return (
        <Authenticatedlayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Dean Account
                    </h2>
                </div>
            }
        >
            <Head title="Chairperson Account" />

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
                                        htmlFor="dean_name"
                                        value="Name"
                                    />
                                    <TextInput
                                        id="dean_name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="chair_email"
                                        value="Email"
                                    />
                                    <TextInput
                                        id="chiar_email"
                                        type="text"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="chair_role"
                                        value="Role"
                                    />
                                    <SelectInput
                                        id="chair_role"
                                        name="role"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        value={data.role}
                                    >
                                        <option value="" selected hidden>
                                            Select Role
                                        </option>

                                        <option value="Chairperson">
                                            Chairperson
                                        </option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.role}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="course"
                                        value="Program"
                                    />
                                    <SelectInput
                                        id="course"
                                        name="course_id"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("course_id", e.target.value)
                                        }
                                        value={data.course_id}
                                    >
                                        <option value="" selected hidden>
                                            Select College
                                        </option>
                                        {programs.map((prog) => (
                                            <option
                                                value={prog.id}
                                                key={prog.id}
                                            >
                                                {prog.course_name} -{" "}
                                                {prog.course_description}
                                            </option>
                                        ))}
                                    </SelectInput>

                                    <InputError
                                        message={errors.course_id}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 text-right">
                                    <Link
                                        href={route("chairAccount.index")}
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
