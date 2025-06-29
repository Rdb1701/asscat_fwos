import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import asscat from '../../../../../public/logo.png'; // Make sure to import your logo image

export default function PrintableCourseOffering({
    auth,
    courseOfferings,
    program,
    noDataFound,
    school_year,
    doc_files
}) {
    const [courseData, setCourseData] = useState(courseOfferings);
    const [currentDate] = useState(() => {
        const now = new Date();
        return `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
    });

    const [selectedDocNumber, setSelectedDocNumber] = useState(doc_files[0]?.document_number || '');
    const [selectedRevNumber, setSelectedRevNumber] = useState(doc_files[0]?.revision_number || '');
    const [selectedEffectiveDate, setSelectedEffectiveDate] = useState(doc_files[0]?.effectivity_date || '');

    const handlePrint = () => {
        window.print();
        window.addEventListener("afterprint", handleAfterPrint);
    };

    const handleAfterPrint = () => {
        window.removeEventListener("afterprint", handleAfterPrint);
        window.history.back();
    };

    const handleCellEdit = (sectionKey, courseId, field, value) => {
        setCourseData(prevData => {
            return prevData.map(course => {
                if (course.id === courseId) {
                    return {
                        ...course,
                        [field]: value
                    };
                }
                return course;
            });
        });
    };

    const EditableCell = ({ content, onEdit, className = '' }) => (
        <td
            contentEditable={true}
            onBlur={(e) => {
                const newValue = e.target.textContent;
                if (newValue.trim() !== content.toString()) {
                    onEdit(newValue.trim());
                }
            }}
            className={`editable-cell ${className}`}
            suppressContentEditableWarning={true}
        >
            {content}
        </td>
    );

    const groupBySection = courseData.reduce((acc, cur) => {
        const key = `${cur.section_name}-${cur.course_name}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);
        return acc;
    }, {});

    const isEmpty = noDataFound || Object.keys(groupBySection).length === 0;

    return (
        <>
            <Head>
            
                <title>Course Offering</title>
                <style>{`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        body {
                            font-family: 'Times New Roman', Times, serif;
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        .page-break {
                            page-break-after: always;
                            position: relative;
                        }
                        .print-button, .doc-controls {
                            display: none !important;
                        }
                        .editable-cell {
                            background-color: transparent !important;
                        }
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
                    .editable-cell {
                        position: relative;
                        min-height: 1em;
                    }
                    .editable-cell:hover:not(:focus) {
                        background-color: #f0f0f0;
                    }
                    .editable-cell:focus {
                        background-color: #e8f0fe;
                        outline: 2px solid #4285f4;
                        outline-offset: -2px;
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
                        right: 0;
                        font-size: 10px;
                        border-collapse: collapse;
                    }
                    .metadata-table td {
                        border: 1px solid #000;
                        padding: 2px 4px;
                    }
                    .print-button {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 10px 20px;
                        background-color: #4285f4;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        z-index: 1000;
                    }
                    .print-button:hover {
                        background-color: #3367d6;
                    }
                    .header-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 10px;
                    }
                    .logo-container {
                        display: flex;
                        align-items: center;
                    }
                    .logo {
                        width: 60px;
                        height: auto;
                        margin-right: 10px;
                    }
                    .college-info {
                        text-align: left;
                    }
                    .college-info h1 {
                        font-size: 14px;
                        margin-bottom: 2px;
                    }
                    .college-info p {
                        font-size: 10px;
                        margin: 1px 0;
                    }
                    .form-title {
                        border: 2px solid black;
                        text-align: center;
                        font-size: 16px;
                        margin: 10px 0;
                        
                    }
                     .doc-controls {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        z-index: 1000;
                        background: white;
                        padding: 10px;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .doc-controls select {
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid #ccc;
                        font-size: 14px;
                        min-width: 200px;
                    }
                    .doc-controls label {
                        font-size: 12px;
                        margin-bottom: 4px;
                        font-weight: bold;
                    }
                    .doc-control-group {
                        display: flex;
                        flex-direction: column;
                    }
                `}</style>
            </Head>

        <div className="doc-controls">
            <div className="doc-control-group">
            <label htmlFor="doc-number">Document Number:</label>
            <select 
                id="doc-number"
                value={selectedDocNumber}
                onChange={(e) => setSelectedDocNumber(e.target.value)}
            >
                {doc_files.map((doc, index) => (
                <option key={index} value={doc.document_number}>
                    {doc.document_number}
                </option>
                ))}
            </select>
            </div>
            
            <div className="doc-control-group">
            <label htmlFor="rev-number">Revision Number:</label>
            <select 
                id="rev-number"
                value={selectedRevNumber}
                onChange={(e) => setSelectedRevNumber(e.target.value)}
            >
                {doc_files.map((doc, index) => (
                <option key={index} value={doc.revision_number}>
                    {doc.revision_number}
                </option>
                ))}
            </select>
            </div>
            
            <div className="doc-control-group">
            <label htmlFor="effective-date">Effective Date:</label>
            <select 
                id="effective-date"
                value={selectedEffectiveDate}
                onChange={(e) => setSelectedEffectiveDate(e.target.value)}
            >
                {doc_files.map((doc, index) => (
                <option key={index} value={doc.effectivity_date}>
                    {doc.effectivity_date}
                </option>
                ))}
            </select>
            </div>
        </div>

            <button onClick={handlePrint} className="print-button">
                Print Form
            </button>

            <div className="p-4" style={{fontFamily: "Times New Roman, Times, serif"}}>
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
                                            <td>{selectedDocNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Effective Date:</td>
                                            <td>{selectedEffectiveDate || currentDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Rev No.:</td>
                                            <td>{selectedRevNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Page No.:</td>
                                            <td>{index + 1} of {Object.keys(groupBySection).length}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <div className="header-container mb-10">
                                    <div className="logo-container">
                                        <img src={asscat} alt="College Logo" className="logo" />
                                        <div className="college-info">
                                            <h1>AGUSAN DEL SUR STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h1>
                                            <p>San Teodoro, Bunawan, Agusan del Sur</p>
                                            <p>e-mail address: asscatregistrar@gmail.com; mobile no: +639387031619</p>
                                            <p>website: www.asscat.edu.ph; mobile no.: +639483679266</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <h2 className="form-title">COURSE OFFERING</h2>
                                
                                <div className="print-header">
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
                                                <EditableCell
                                                    content={cur.course_code}
                                                    onEdit={(value) => handleCellEdit(key, cur.id, 'course_code', value)}
                                                />
                                                <EditableCell
                                                    content={cur.descriptive_title}
                                                    onEdit={(value) => handleCellEdit(key, cur.id, 'descriptive_title', value)}
                                                />
                                                <EditableCell
                                                    content={cur.cmo}
                                                    onEdit={(value) => handleCellEdit(key, cur.id, 'cmo', value)}
                                                />
                                                <EditableCell
                                                    content={cur.lec}
                                                    onEdit={(value) => handleCellEdit(key, cur.id, 'lec', value)}
                                                />
                                                <EditableCell
                                                    content={cur.lab}
                                                    onEdit={(value) => handleCellEdit(key, cur.id, 'lab', value)}
                                                />
                                                <EditableCell
                                                    content={cur.pre_requisite || "None"}
                                                    onEdit={(value) => handleCellEdit(key, cur.id, 'pre_requisite', value)}
                                                />
                                                <EditableCell
                                                    content={cur.faculty_name}
                                                    onEdit={(value) => handleCellEdit(key, cur.id, 'faculty_name', value)}
                                                />
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