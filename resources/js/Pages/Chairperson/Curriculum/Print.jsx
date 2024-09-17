import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function PrintableCurriculum({
    auth,
    curriculum,
    program,
    school_year,
    noDataFound,
    chairperson
}) {
    useEffect(() => {
        // Print the document after rendering
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        // Redirect back to the previous page when printing is canceled or completed
        const handleAfterPrint = () => {
            window.history.back(); // Go back to the previous page
        };

        window.addEventListener("afterprint", handleAfterPrint);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    // Group the curriculum by year level and semester
    const groupByYearAndSemester = curriculum.reduce((acc, cur) => {
        const key = `${cur.year_level}-${cur.semester}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);
        return acc;
    }, {});

    // Check if there is no data to display
    const isEmpty =
        noDataFound || Object.keys(groupByYearAndSemester).length === 0;

    return (
        <>
            <Head>
                <title>Printable Curriculum</title>
                <style>{`
                    @media print {
                        @page {
                            size: portrait;
                            margin: 0.5in;
                        }
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        .page-break {
                            {/* page-break-after: always; */}
                        }
                        .print-table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 11px;
                        }
                        .print-table th, .print-table td {
                            border: 1px solid #000;
                            padding: 4px;
                            text-align: left;
                        }
                        .print-table thead {
                            background-color: #f0f0f0 !important;
                        }
                        .print-table tfoot {
                            font-weight: bold;
                            background-color: #f0f0f0 !important;
                        }
                        .print-table {
                            border: 2px solid #000;
                        }
                    }
                `}</style>
            </Head>

            <div className="p-4 max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-9" style={{ fontSize: "11px" }}>
                    <h5 className="font-bold">Republic of the Philippines</h5>
                    <h5 className="font-bold">
                        AGUSAN DEL SUR STATE COLLEGE OF AGRICULTURE AND
                        TECHNOLOGY
                    </h5>
                    <h5 className="font-bold">
                        {program.department_description.toUpperCase()}
                    </h5>
                    <h6>Bunawan, Agusan del Sur</h6>
                    <h6 className="font-bold">
                        {program.course_description.toUpperCase()} ({program.course_name})
                    </h6>
                    <p>Revised Curriculum to conform with</p>
                    <p>CMO NO. 25 Series 2015 and CMO NO. 20 Series 2013</p>
                    <p>Effective AY {school_year}</p>
                </div>

                {isEmpty ? (
                    <div className="text-center text-red-600 font-bold py-5">
                        No data found for the selected course and school year.
                    </div>
                ) : (
                    Object.entries(groupByYearAndSemester).map(
                        ([key, courses], index) => {
                            const [yearLevel, semester] = key.split("-");
                            const totalCMO = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.cmo || 0),
                                0
                            );
                            const totalHEI = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.hei || 0),
                                0
                            );
                            const totalLEC = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.lec || 0),
                                0
                            );
                            const totalLAB = courses.reduce(
                                (sum, cur) => sum + parseFloat(cur.lab || 0),
                                0
                            );

                            return (
                                <div key={index} className="page-break mb-8">
                                    <h2
                                        className="text-xl font-semibold mb-2"
                                        style={{ fontSize: "12px" }}
                                    >
                                        {yearLevel} - {semester}
                                    </h2>
                                    <table className="print-table border-2 border-gray-800">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="border border-gray-800 px-2 py-1">
                                                    Course No.
                                                </th>
                                                <th className="border border-gray-800 px-2 py-1">
                                                    Descriptive Title
                                                </th>
                                                <th
                                                    className="border border-gray-800 px-2 py-1"
                                                    colSpan={2}
                                                >
                                                    CREDIT UNITS
                                                </th>
                                                <th
                                                    className="border border-gray-800 px-2 py-1"
                                                    colSpan={2}
                                                >
                                                    HOURS
                                                </th>
                                                <th className="border border-gray-800 px-2 py-1">
                                                    Pre-requisite
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="border border-gray-800 px-2 py-1"></th>
                                                <th className="border border-gray-800 px-2 py-1"></th>
                                                <th className="border border-gray-800 px-2 py-1">
                                                    CMO
                                                </th>
                                                <th className="border border-gray-800 px-2 py-1">
                                                    HEI
                                                </th>
                                                <th className="border border-gray-800 px-2 py-1">
                                                    LEC
                                                </th>
                                                <th className="border border-gray-800 px-2 py-1">
                                                    LAB
                                                </th>
                                                <th className="border border-gray-800 px-2 py-1"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((cur) => (
                                                <tr key={cur.id}>
                                                    <td className="border border-gray-800 px-2 py-1">
                                                        {cur.course_code}
                                                    </td>
                                                    <td className="border border-gray-800 px-2 py-1">
                                                        {cur.descriptive_title}
                                                    </td>
                                                    <td className="border border-gray-800 px-2 py-1">
                                                        {cur.cmo}
                                                    </td>
                                                    <td className="border border-gray-800 px-2 py-1">
                                                        {cur.hei}
                                                    </td>
                                                    <td className="border border-gray-800 px-2 py-1">
                                                        {cur.lec}
                                                    </td>
                                                    <td className="border border-gray-800 px-2 py-1">
                                                        {cur.lab}
                                                    </td>
                                                    <td className="border border-gray-800 px-2 py-1">
                                                        {cur.pre_requisite ||
                                                            "None"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-200">
                                                <td
                                                    className="border border-gray-800 px-2 py-1 font-semibold"
                                                    colSpan={2}
                                                >
                                                    Total
                                                </td>
                                                <td className="border border-gray-800 px-2 py-1 font-semibold">
                                                    {totalCMO}
                                                </td>
                                                <td className="border border-gray-800 px-2 py-1 font-semibold">
                                                    {totalHEI}
                                                </td>
                                                <td className="border border-gray-800 px-2 py-1 font-semibold">
                                                    {totalLEC}
                                                </td>
                                                <td className="border border-gray-800 px-2 py-1 font-semibold">
                                                    {totalLAB}
                                                </td>
                                                <td className="border border-gray-800 px-2 py-1"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            );
                        }
                    )
                )}
            </div>

            {/* Signature section */}
            <div className="p-6">
                <table
                    className="signature-table w-full"
                    style={{ fontSize: "11px" }}
                >
                    <tbody>
                        <tr>
                            <td className="w-1/2">Prepared by:</td>
                            <td className="w-1/2">Checked by:</td>
                        </tr>
                        <tr>
                            <td className="signature-line pt-8">
                                ____________________________
                            </td>
                            <td className="signature-line pt-8">
                                ____________________________
                            </td>
                        </tr>
                        <tr>
                            <td className="signature-name font-bold">
                                {chairperson.chairperson_name.toUpperCase()}
                            </td>
                            <td className="signature-name font-bold">
                                {program.dean_name.toUpperCase()}
                            </td>
                        </tr>
                        <tr>
                            <td>Chairperson, {program.course_name}</td>
                            <td>Dean, {program.department_name}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="pt-8"></td>
                        </tr>
                        <tr>
                            <td>Recommended by:</td>
                            <td>Approved by:</td>
                        </tr>
                        <tr>
                            <td className="signature-line pt-8">
                                ____________________________
                            </td>
                            <td className="signature-line pt-8">
                                ____________________________
                            </td>
                        </tr>
                        <tr>
                            <td className="signature-name font-bold">
                                CARMELO S. LLANTO, Ph.D.
                            </td>
                            <td className="signature-name font-bold">
                                JOY C. CAPISTRANO
                            </td>
                        </tr>
                        <tr>
                            <td>VP for Academic Affairs & Quality Assurance</td>
                            <td>College President</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
