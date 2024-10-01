import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function PrintableFacultyLoad({
    auth,
    faculty_id,
    faculty_info,
    facultyLoad,
    success,
    administrative_faculty_load,
    research_faculty_load
}) {
    useEffect(() => {
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

    const semesterTotalUnits = facultyLoad.reduce((acc, fl) => acc + (parseFloat(fl.lec) + (parseFloat(fl.lab) * 0.75)), 0).toFixed(2);

    return (
        <>
            <Head>
                <title>Printable Faculty Load</title>
                <style>{`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .print-header img {
                            width: 60px;
                            height: auto;
                        }
                        .print-header h1 {
                            font-size: 16px;
                            margin: 5px 0;
                        }
                        .print-header p {
                            font-size: 12px;
                            margin: 2px 0;
                        }
                        .print-title {
                            text-align: center;
                            font-size: 14px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .print-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        .print-table th, .print-table td {
                            border: 1px solid #000;
                            padding: 4px;
                            text-align: left;
                        }
                        .print-table th {
                            background-color: #f0f0f0;
                        }
                        .print-footer {
                            margin-top: 30px;
                        }
                        .print-footer div {
                            display: inline-block;
                            width: 24%;
                            text-align: center;
                        }
                        .print-footer p {
                            margin: 5px 0;
                        }
                        .instructor-name {
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                    }
                `}</style>
            </Head>

            <div className="print-header">
                <img src="/path-to-your-logo.png" alt="College Logo" />
                <h1>AGUSAN DEL SUR STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h1>
                <p>San Teodoro, Bunawan, Agusan del Sur</p>
                <p>e-mail address: asscat.registar@gmail.com; mobile no: +639387031619</p>
                <p>website: www.asscat.edu.ph; mobile no.: +639483679266</p>
            </div>

            <div className="print-title">FACULTY LOADING</div>

            <div className="instructor-name">Name of Instructor (LN, FN, MI): BALIGHOT, BERNIE S.</div>

            <table className="print-table">
                <thead>
                    <tr>
                        <th>Course No.</th>
                        <th>Descriptive Title</th>
                        <th>Program/Yr/Sec</th>
                        <th>No. of Units</th>
                        <th>No. of Hours/Week</th>
                        <th>Unit Credit</th>
                        <th>Contact Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {facultyLoad.map((fl, index) => (
                        <tr key={index}>
                            <td>{fl.course_code}</td>
                            <td>{fl.descriptive_title}</td>
                            <td>{fl.section_name}</td>
                            <td>{parseFloat(fl.lec) + parseFloat(fl.lab)}</td>
                            <td>{fl.lec} / {fl.lab}</td>
                            <td>{(parseFloat(fl.lec) + parseFloat(fl.lab) * 0.75).toFixed(2)}</td>
                            <td>{parseFloat(fl.lec) + parseFloat(fl.lab)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3">Total Academic Load</td>
                        <td>{facultyLoad.reduce((acc, fl) => acc + parseFloat(fl.lec) + parseFloat(fl.lab), 0)}</td>
                        <td>{facultyLoad.reduce((acc, fl) => acc + parseFloat(fl.lec), 0)} / {facultyLoad.reduce((acc, fl) => acc + parseFloat(fl.lab), 0)}</td>
                        <td>{semesterTotalUnits}</td>
                        <td>{facultyLoad.reduce((acc, fl) => acc + parseFloat(fl.lec) + parseFloat(fl.lab), 0)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3">Administrative Load</td>
                        <td colSpan="4">{administrative_faculty_load}</td>
                    </tr>
                    <tr>
                        <td colSpan="3">Research Load</td>
                        <td colSpan="4">{research_faculty_load}</td>
                    </tr>
                    <tr>
                        <td colSpan="3">Total Load</td>
                        <td colSpan="4">{parseFloat(semesterTotalUnits) + parseFloat(administrative_faculty_load) + parseFloat(research_faculty_load)}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="print-footer">
                <div>
                    <p>Prepared by:</p>
                    <p>BERNIE S. BALIGHOT, MIT</p>
                    <p>Chairperson, BSIT Program</p>
                    <p>Date: ___/___/___</p>
                </div>
                <div>
                    <p>Checked by:</p>
                    <p>JEANIE R. DELOS ARCOS, DIT</p>
                    <p>Dean, CCIS</p>
                    <p>Date: ___/___/___</p>
                </div>
                <div>
                    <p>Reviewed by:</p>
                    <p>LIEZL MAY G. PEREZ</p>
                    <p>Chief Curriculum Planning and Development</p>
                    <p>Date: ___/___/___</p>
                </div>
                <div>
                    <p>Approved:</p>
                    <p>CARMELO S. LLANTO, Ph.D.</p>
                    <p>VP for Academic Affairs and Quality Assurance</p>
                    <p>Date: ___/___/___</p>
                </div>
            </div>
        </>
    );
}