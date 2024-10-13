import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net/js/dataTables.min.mjs";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { FaTrash, FaEdit, FaPlus, FaKey } from "react-icons/fa";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import Swal from 'sweetalert2';

export default function Index({ auth, faculty, success }) {
    const { data, setData, post, errors, reset } = useForm({
        password: "",
        password_confirmation: "",
        user_id: "",
        _method: "PUT",
    });

    useEffect(() => {
        $("#facultyTable").DataTable();
    }, []);

    const [openModal, setOpenModal] = useState(false);
    const [getEmail, setGetEmail] = useState();

    const handleModal = (user) => {
        setOpenModal(true);
        setData("user_id", user.id);
        setGetEmail(user.email);
    };
    const closeModal = () => {
        setOpenModal(false);
    };

    const handleForm = async (e) => {
        e.preventDefault();

        try {
            await post(route("faculty_account.changepassword", data.user_id), {
                onSuccess: () => {
                    setOpenModal(false);
                },
                onError: () => {
                    console.error("There were validation errors:", errors);
                },
            });
        } catch (error) {
            console.error("There was an error submitting the form:", error);
        }
    };

    const handleDelete = (fac) => {
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
                router.delete(route("faculty_file.destroy", fac.id));
                Swal.fire("Deleted!", "Successfully deleted.", "success");
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Faculty File
                    </h2>

                    <Link
                        href={route("faculty_file.create")}
                        className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-150 ease-in-out flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        <span>Add Faculty</span>
                    </Link>
                </div>
            }
        >
            <Head title="Faculty File" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table
                                    id="facultyTable"
                                    className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                                >
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Faculty Code
                                            </th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Employment</th>
                                            <th className="px-4 py-3">Specialization</th>
                                            <th className="px-4 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {faculty.map((fac) => (
                                            <tr
                                                key={fac.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-3">
                                                    
                                                        {" "}
                                                        {fac.user_code_id}
                                                    
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fac.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fac.email}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fac.employment_status}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fac.specializations}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route(
                                                                "faculty_file.edit",
                                                                fac.id
                                                            )}
                                                            className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Edit ${fac.name}`}
                                                        >
                                                            <FaEdit className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleModal(
                                                                    fac
                                                                )
                                                            }
                                                            className="text-yellow-500 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Changepass ${fac.name}`}
                                                        >
                                                            <FaKey className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    fac
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-2 transition duration-150 ease-in-out"
                                                            aria-label={`Delete ${fac.name}`}
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

            <Modal show={openModal} onClose={closeModal}>
                <form onSubmit={handleForm} className="p-6">
                    <div className="mt-4">
                        <InputLabel htmlFor="email_s" value="Email" />
                        <TextInput
                            id="email_s"
                            type="email"
                            name="email"
                            value={getEmail}
                            className="mt-1 block w-full"
                            disabled="true"
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel
                            htmlFor="user_password"
                            value="New Password"
                        />
                        <TextInput
                            id="user_password"
                            type="Password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel
                            htmlFor="user_password_confirm"
                            value="Confirm Password"
                        />
                        <TextInput
                            id="user_password_confirm"
                            type="Password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton className="ms-3">Update</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
