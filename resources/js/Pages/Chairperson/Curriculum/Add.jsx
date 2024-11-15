import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Add({ auth, academic, courses, specialization, effectivity, semester }) {
    const { data, setData, post, errors, reset } = useForm({
        course_code: "",
        descriptive_title: "",
        cmo: "",
        hei: "",
        lec: "",
        lab: "",
        pre_requisite: "",
        year_level: "",
        course_id : "",
        academic_year : "",
        specialization_id : "",
        efectivity_year : "",
        semester : "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        post(route("curriculum.store"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                reset();
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create Curriculum
                    </h2>
                </div>
            }
        >
            <Head title="Curriculum Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={handleSubmit}
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="code" value="Course Code" />
                                        <TextInput
                                            id="code"
                                            type="text"
                                            name="course_code"
                                            value={data.course_code}
                                            className="mt-1 block w-full"
                                            autoFocus
                                            onChange={(e) => setData("course_code", e.target.value)}
                                        />
                                        <InputError message={errors.course_code} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="title" value="Descriptive Title" />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            name="descriptive_title"
                                            value={data.descriptive_title}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("descriptive_title", e.target.value)}
                                        />
                                        <InputError message={errors.descriptive_title} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="unit1" value="CMO" />
                                        <TextInput
                                            id="unit1"
                                            type="number"
                                            name="cmo"
                                            value={data.cmo}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("cmo", e.target.value)}
                                        />
                                        <InputError message={errors.cmo} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="unit2" value="HEI" />
                                        <TextInput
                                            id="unit2"
                                            type="number"
                                            name="hei"
                                            value={data.hei}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("hei", e.target.value)}
                                        />
                                        <InputError message={errors.hei} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="unit3" value="LEC" />
                                        <TextInput
                                            id="unit3"
                                            type="number"
                                            name="lec"
                                            value={data.lec}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("lec", e.target.value)}
                                        />
                                        <InputError message={errors.lec} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="unit4" value="LAB" />
                                        <TextInput
                                            id="unit4"
                                            type="number"
                                            name="lab"
                                            value={data.lab}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("lab", e.target.value)}
                                        />
                                        <InputError message={errors.lab} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="pre" value="Pre-Requisite" />
                                        <TextInput
                                            id="pre"
                                            name="pre_requisite"
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("pre_requisite", e.target.value)}
                                            value={data.pre_requisite}
                                        />
                                            
                                        
                                        <InputError message={errors.pre_requisite} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="year" value="Year Level" />
                                        <SelectInput
                                            id="year"
                                            name="year_level"
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("year_level", e.target.value)}
                                            value={data.year_level}
                                        >
                                            <option value="" hidden>Select Year</option>
                                            <option value="First Year">First Year</option>
                                            <option value="Second Year">Second Year</option>
                                            <option value="Third Year">Third Year</option>
                                            <option value="Fourth Year">Fourth Year</option>
                                        </SelectInput>
                                        <InputError message={errors.year_level} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="course" value="Select Program" />
                                        <SelectInput
                                            id="course"
                                            name="course_id"
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("course_id", e.target.value)}
                                            value={data.course_id}
                                        >
                                            <option value="" hidden>Select Course</option>
                                            {courses.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.course_name} - {c.course_description} [{c.department_name}]
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.course_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="academic" value="Academic Year" />
                                        <SelectInput
                                            id="academic"
                                            name="academic_id"
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("academic_id", e.target.value)}
                                            value={data.academic_id}
                                        >
                                            <option value="" hidden>Select Academic Year</option>
                                            {academic.map((acad) => (
                                                <option key={acad.id} value={acad.id}>
                                                    {acad.school_year} - {acad.semester}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.academic_id} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="special_" value="Specilization" />
                                        <SelectInput
                                            id="special_"
                                            name="specialization"
                                            value={data.specialization_id}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("specialization_id", e.target.value)}
                                        >
                                            <option value="" hidden>Select Specialization</option>
                                            <option value="" >None</option>
                                            {specialization.map((spec)=>(
                                            <option value={spec.id} >{spec.name}</option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.specialization_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="efectivity" value="Effectivity Year" />
                                        <SelectInput
                                            id="efectivity"
                                            name="efectivity_year"
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("efectivity_year", e.target.value)}
                                            value={data.efectivity_year}
                                        >
                                            <option value="" hidden>Select Effectivity Year</option>
                                            {effectivity.map((acad) => (
                                                <option key={acad.school_year} value={acad.school_year}>
                                                    {acad.school_year}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.efectivity_year} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="Semester" value="Semester" />
                                        <SelectInput
                                            id="Semester"
                                            name="semester"
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("semester", e.target.value)}
                                            value={data.semester}
                                        >
                                            <option value="" hidden>Select Semester</option>
                                            {semester.map((acad) => (
                                                <option key={acad.semester} value={acad.semester}>
                                                    {acad.semester}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.semester} className="mt-2" />
                                    </div>
                                </div>

                                

                                <div className="mt-6 flex items-center justify-end gap-4">
                                    <Link
                                        href={route("curriculum.index")}
                                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className={`inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${
                                            isSubmitting ? 'opacity-25' : ''
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}