import Authenticatedlayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Add({ auth, college, dean_edit }) {
    const { data, setData, post, errors, reset } = useForm({
        name: dean_edit.data.name || "",
        email: dean_edit.data.email ||"",
        role: dean_edit.data.role ||"",
        department_id: dean_edit.data.department_id ||"",
        _method : "PUT"
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("deanAccount.update", dean_edit.data.id));
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
            <Head title="Dean Account" />

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
                                        htmlFor="dean_email"
                                        value="Email"
                                    />
                                    <TextInput
                                        id="dean_email"
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
                                        htmlFor="dean_role"
                                        value="Role"
                                    />
                                    <SelectInput
                                        id="dean_role"
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

                                        <option value="Dean">College Dean</option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.role}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="department"
                                        value="College"
                                    />
                                    <SelectInput
                                        id="department"
                                        name="department_id"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "department_id",
                                                e.target.value
                                            )
                                        }
                                        value={data.department_id}
                                    >
                                        <option value="" selected hidden>
                                            Select College
                                        </option>
                                        {college.map((col) => (
                                            <option value={col.id} key={col.id}>
                                                {col.department_name} -  {col.department_description}
                                            </option>
                                        ))}
                                    </SelectInput>

                                    <InputError
                                        message={errors.department_id}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 text-right">
                                    <Link
                                        href={route("deanAccount.index")}
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
