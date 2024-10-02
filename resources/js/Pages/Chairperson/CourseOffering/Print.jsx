'use client'

import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";

export default function PrintableCourseOffering({
    auth,
    courseOfferings,
    program,
    noDataFound,
    school_year
}) {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const now = new Date();
        const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
        setCurrentDate(formattedDate);

        const timer = setTimeout(() => {
            window.print();
        }, 500);

        const handleAfterPrint = () => {
            window.history.back();
        };

        window.addEventListener("afterprint", handleAfterPrint);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    const groupBySection = courseOfferings.reduce((acc, cur) => {
        const key = `${cur.section_name}-${cur.course_name}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);
        return acc;
    }, {});

    const isEmpty = noDataFound || Object.keys(groupBySection).length === 0;

    return (
        <>
            <Head>
                <title>Printable Course Offering</title>
                <style>{`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        .page-break {
                            page-break-after: always;
                            position: relative;
                        }
                        .print-table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 12px;
                        }
                        .print-table th, .print-table td {
                            border: 1px solid #000;
                            padding: 4px;
                            text-align: left;
                        }
                        .print-table thead {
                           
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .print-header h1 {
                            font-size: 16px;
                            font-weight: bold;
                            margin-bottom: 5px;
                        }
                        .print-header p {
                            font-size: 12px;
                            margin: 2px 0;
                        }
                        .print-footer {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 20px;
                            font-size: 12px;
                        }
                        .signature-line {
                            border-top: 1px solid #000;
                            width: 200px;
                            text-align: center;
                            padding-top: 5px;
                        }
                        .metadata-table {
                            position: absolute;
                            top: 0;
                            left: 0;
                            font-size: 10px;
                            border-collapse: collapse;
                        }
                        .metadata-table td {
                            border: 1px solid #000;
                            padding: 2px 4px;
                        }
                    }
                `}</style>
            </Head>

            <div className="p-4">
                {isEmpty ? (
                    <div className="text-center text-red-600 font-bold py-5">
                        No data found
                    </div>
                ) : (
                    Object.entries(groupBySection).map(([key, courses], index) => {
                        const [sectionName, courseName] = key.split("-");
                        return (
                            <div key={index} className="page-break">
                                <table className="metadata-table">
                                    <tbody>
                                        <tr>
                                            <td>Doc No.:</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Effective Date:</td>
                                            <td>{currentDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Rev No.:</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Page No.:</td>
                                            <td>{index + 1} of {Object.keys(groupBySection).length}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="print-header">
                                    <h1>AGUSAN DEL SUR STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h1>
                                    <p>San Teodoro, Bunawan, Agusan del Sur</p>
                                    <p>e-mail address: asscatregistrar@gmail.com; mobile no: +639387031619</p>
                                    <p>website: www.asscat.edu.ph; mobile no.: +639483679266</p><br/>
                                    <h1 className="">COURSE OFFERING</h1>
                                    <p>{program.department_description}</p>
                                    <p><b>Semester:</b> <span className="mr-3">{school_year.semester}</span> <b>Year:</b> {school_year.school_year}</p>
                                    <p><b>Program:</b> <span className="mr-3">{program.course_name}</span> <b>Year Level:</b> <span className="mr-3">{courses[0].year_level}</span>  <b>Section: </b>{sectionName}</p>
                                </div>
                                <table className="print-table">
                                    <thead className="bg-green-200">
                                        <tr>
                                            <th>Course No.</th>
                                            <th>Descriptive Title</th>
                                            <th>No. of Units</th>
                                            <th colSpan={2}>No. of Hour/Week</th>
                                            <th>Pre-requisite</th>
                                            <th>Name of Instructor</th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>Lec</th>
                                            <th>Lab</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((cur) => (
                                            <tr key={cur.id}>
                                                <td>{cur.course_code}</td>
                                                <td>{cur.descriptive_title}</td>
                                                <td>{cur.cmo}</td>
                                                <td>{cur.lec}</td>
                                                <td>{cur.lab}</td>
                                                <td>{cur.pre_requisite || "None"}</td>
                                                <td>{cur.faculty_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-green-200">
                                            <td colSpan={2}>Total</td>
                                            <td>{courses.reduce((sum, cur) => sum + parseFloat(cur.cmo || 0), 0)}</td>
                                            <td>{courses.reduce((sum, cur) => sum + parseFloat(cur.lec || 0), 0)}</td>
                                            <td>{courses.reduce((sum, cur) => sum + parseFloat(cur.lab || 0), 0)}</td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tfoot>
                                </table><br/>
                                <div className="print-footer">
                                    <div>
                                        <div className="signature-line">PC's Initial</div>
                                        <div>Date: ____/____/____</div>
                                    </div>
                                    <div>
                                        <div className="signature-line">Dean's Initial</div>
                                        <div>Date: ____/____/____</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}