import React, { useState } from 'react';
import { Head } from "@inertiajs/react";
import asscat from '../../../../../public/logo.png';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default function FacultyLoadingPrint({ faculty_users, academic_year, department, course, dean, chair }) {
  const [facultyData, setFacultyData] = useState(faculty_users);
  const [currentDate] = useState(() => {
    const now = new Date();
    return `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
  });

  const handlePrint = () => {
    window.print();
    window.addEventListener("afterprint", handleAfterPrint);
  };

  const handleAfterPrint = () => {
    window.removeEventListener("afterprint", handleAfterPrint);
    window.history.back();
  };

  const handleCellEdit = (facultyIndex, loadType, loadIndex, field, value) => {
    const updatedFacultyData = [...facultyData];
    const faculty = { ...updatedFacultyData[facultyIndex] };

    if (loadType === 'faculty_loads') {
      if (!faculty.faculty_loads[loadIndex]) {
        faculty.faculty_loads[loadIndex] = { curriculum: {} };
      }
      faculty.faculty_loads[loadIndex].curriculum = {
        ...faculty.faculty_loads[loadIndex].curriculum,
        [field]: value
      };
    } else if (loadType === 'administrative_loads' || loadType === 'research_loads') {
      if (!faculty[loadType][loadIndex]) {
        faculty[loadType][loadIndex] = {};
      }
      faculty[loadType][loadIndex] = {
        ...faculty[loadType][loadIndex],
        [field]: value
      };
    } else if (loadType === 'name') {
      faculty.name = value;
    }

    updatedFacultyData[facultyIndex] = faculty;
    setFacultyData(updatedFacultyData);
  };

  const EditableCell = ({ content, onEdit, className = '', colSpan, rowSpan }) => (
    <td 
      contentEditable={true}
      onBlur={(e) => onEdit(e.target.textContent)}
      className={`editable-cell ${className}`}
      colSpan={colSpan}
      rowSpan={rowSpan}
      suppressContentEditableWarning={true}
    >
      {content}
    </td>
  );

  const renderEmptyRow = (facultyIndex, rowIndex) => (
    <tr key={`empty-${rowIndex}`}>
      <EditableCell 
        content=""
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'course_code', value)}
        className="text-left"
      />
      <EditableCell 
        content=""
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'descriptive_title', value)}
        className="text-left"
      />
      <EditableCell 
        content=""
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'section_name', value)}
      />
      <EditableCell 
        content=""
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'units', value)}
      />
      <EditableCell 
        content=""
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'lec', value)}
      />
      <EditableCell 
        content=""
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'lab', value)}
      />
      <EditableCell 
        content="0.00"
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'unit_credit', value)}
      />
      <EditableCell 
        content="0"
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'contact_hours', value)}
      />
      <EditableCell 
        content=""
        onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', rowIndex, 'room', value)}
      />
    </tr>
  );

  const renderFacultyLoad = (faculty, facultyIndex) => {
    if (!faculty) {
      console.error('Invalid faculty data:', faculty);
      return null;
    }

    const facultyLoads = faculty.faculty_loads || [];
    const administrativeLoads = faculty.administrative_loads || [];
    const researchLoads = faculty.research_loads || [];

    const totalAcademicLoad = facultyLoads.reduce((acc, course) => acc + parseFloat(course.curriculum?.units || 0), 0);
    const administrativeLoad = administrativeLoads.reduce((acc, load) => acc + parseFloat(load.units || 0), 0);
    const researchLoad = researchLoads.reduce((acc, load) => acc + parseFloat(load.units || 0), 0);
    const totalLoad = totalAcademicLoad + administrativeLoad + researchLoad;

    const totalRows = facultyLoads.length + 2 + administrativeLoads.length + researchLoads.length + 5; // +2 for empty rows, +5 for header and total rows

    return (
      <div key={faculty.id} className="faculty-section">
        <table className="faculty-load-table">
          <thead>
            <tr>
              <th style={{ border: '1px solid black' }}>Name of Instructor</th>
              <th style={{ border: '1px solid black' }}>Course No.</th>
              <th style={{ border: '1px solid black' }}>Descriptive Title</th>
              <th style={{ border: '1px solid black' }}>Program/Yr/Sec</th>
              <th style={{ border: '1px solid black' }}>No. of Units</th>
              <th style={{ border: '1px solid black' }} colSpan={2}>No. of Hours/Week</th>
              <th style={{ border: '1px solid black' }}>Unit Credit</th>
              <th style={{ border: '1px solid black' }}>Contact Hours</th>
              <th style={{ border: '1px solid black' }}>Room to be used</th>
            </tr>
            <tr>
              <th style={{ border: '1px solid black' }} colSpan={5}></th>
              <th style={{ border: '1px solid black' }}>Lec</th>
              <th style={{ border: '1px solid black' }}>Lab</th>
              <th style={{ border: '1px solid black' }} colSpan={3}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <EditableCell 
                content={faculty.name?.toUpperCase() || 'N/A'}
                onEdit={(value) => handleCellEdit(facultyIndex, 'name', 0, 'name', value)}
                rowSpan={totalRows}
              />
              <EditableCell 
                content={facultyLoads[0]?.curriculum?.course_code || ''}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'course_code', value)}
                className="text-left"
              />
              <EditableCell 
                content={facultyLoads[0]?.curriculum?.descriptive_title || ''}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'descriptive_title', value)}
                className="text-left"
              />
              <EditableCell 
                content={facultyLoads[0]?.sections?.section_name || ''}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'section_name', value)}
              />
              <EditableCell 
                content={facultyLoads[0]?.curriculum?.units || ''}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'units', value)}
              />
              <EditableCell 
                content={facultyLoads[0]?.curriculum?.lec || ''}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'lec', value)}
              />
              <EditableCell 
                content={facultyLoads[0]?.curriculum?.lab || ''}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'lab', value)}
              />
              <EditableCell 
                content={((parseFloat(facultyLoads[0]?.curriculum?.lec || 0) + parseFloat(facultyLoads[0]?.curriculum?.lab || 0) * 0.75) || 0).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'unit_credit', value)}
              />
              <EditableCell 
                content={(parseFloat(facultyLoads[0]?.curriculum?.lec || 0) + parseFloat(facultyLoads[0]?.curriculum?.lab || 0)) || 0}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'contact_hours', value)}
              />
              <EditableCell 
                content={facultyLoads[0]?.room || ''}
                onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', 0, 'room', value)}
              />
            </tr>
            {facultyLoads.slice(1).map((load, index) => (
              <tr key={index + 1}>
                <EditableCell 
                  content={load.curriculum?.course_code || 'N/A'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'course_code', value)}
                  className="text-left"
                />
                <EditableCell 
                  content={load.curriculum?.descriptive_title || 'N/A'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'descriptive_title', value)}
                  className="text-left"
                />
                <EditableCell 
                  content={load.sections?.section_name || 'N/A'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'section_name', value)}
                />
                <EditableCell 
                  content={load.curriculum?.units || 'N/A'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'units', value)}
                />
                <EditableCell 
                  content={load.curriculum?.lec || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'lec', value)}
                />
                <EditableCell 
                  content={load.curriculum?.lab || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'lab', value)}
                />
                <EditableCell 
                  content={((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0).toFixed(2)}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'unit_credit', value)}
                />
                <EditableCell 
                  content={(parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)) || 0}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'contact_hours', value)}
                />
                <EditableCell 
                  content={load.room || ''}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'faculty_loads', index + 1, 'room', value)}
                />
              </tr>
            ))}
            {renderEmptyRow(facultyIndex, facultyLoads.length + 1)}
            {renderEmptyRow(facultyIndex, facultyLoads.length + 2)}
            <tr>
              <EditableCell 
                content="Total Academic Load"
                onEdit={() => {}}
                className='text-right total-row'
                colSpan={3}
              />
              <EditableCell 
                content={totalAcademicLoad.toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_academic_load', 0, 'units', value)}
              />
              <EditableCell 
                content={facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_academic_load', 0, 'lec', value)}
              />
              <EditableCell 
                content={facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_academic_load', 0, 'lab', value)}
              />
              <EditableCell 
                content={facultyLoads.reduce((acc, load) => acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_academic_load', 0, 'unit_credit', value)}
              />
              <EditableCell 
                content={facultyLoads.reduce((acc, load) => acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_academic_load', 0, 'contact_hours', value)}
              />
              <EditableCell 
                content=""
                onEdit={() => {}}
              />
            </tr>
            <tr>
              <EditableCell 
                content="Administrative Load"
                onEdit={() => {}}
                className='text-left'
                colSpan={9}
              />
            </tr>
            {administrativeLoads.map((load, index) => (
              <tr key={index}>
                <EditableCell 
                  content={load.load_desc || 'N/A'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'administrative_loads', index, 'load_desc', value)}
                  className="text-left"
                  colSpan={3}
                />
                <EditableCell 
                  content={load.units || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'administrative_loads', index, 'units', value)}
                />
                <EditableCell 
                  content="0"
                  onEdit={(value) => handleCellEdit(facultyIndex, 'administrative_loads', index, 'lec', value)}
                />
                <EditableCell 
                  content="0"
                  onEdit={(value) => handleCellEdit(facultyIndex, 'administrative_loads', index, 'lab', value)}
                />
                <EditableCell 
                  content={load.units || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'administrative_loads', index, 'unit_credit', value)}
                />
                <EditableCell 
                  content={load.units || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'administrative_loads', index, 'contact_hours', value)}
                />
                <EditableCell 
                  content=""
                  onEdit={(value) => handleCellEdit(facultyIndex, 'administrative_loads', index, 'room', value)}
                />
              </tr>
            ))}
            <tr>
              <EditableCell 
                content="Total Administrative Load"
                onEdit={() => {}}
                className='text-right total-row'
                colSpan={3}
              />
              <EditableCell 
                content={administrativeLoad.toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_administrative_load', 0, 'units', value)}
              />
              <EditableCell 
                content="0"
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_administrative_load', 0, 'lec', value)}
              />
              <EditableCell 
                content="0"
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_administrative_load', 0, 'lab', value)}
              />
              <EditableCell 
                content={administrativeLoad.toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_administrative_load', 0, 'unit_credit', value)}
              />
              <EditableCell 
                content={administrativeLoad.toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_administrative_load', 0, 'contact_hours', value)}
              />
              <EditableCell 
                content=""
                onEdit={() => {}}
              />
            </tr>
            <tr>
              <EditableCell 
                content="Research Load"
                onEdit={() => {}}
                className='text-left'
                colSpan={9}
              />
            </tr>
            {researchLoads.map((load, index) => (
              <tr key={index}>
                <EditableCell 
                  content={load.load_desc || 'N/A'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'research_loads', index, 'load_desc', value)}
                  className="text-left"
                  colSpan={3}
                />
                <EditableCell 
                  content={load.units || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'research_loads', index, 'units', value)}
                />
                <EditableCell 
                  content="0"
                  onEdit={(value) => handleCellEdit(facultyIndex, 'research_loads', index, 'lec', value)}
                />
                <EditableCell 
                  content="0"
                  onEdit={(value) => handleCellEdit(facultyIndex, 'research_loads', index, 'lab', value)}
                />
                <EditableCell 
                  content={load.units || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'research_loads', index, 'unit_credit', value)}
                />
                <EditableCell 
                  content={load.units || '0'}
                  onEdit={(value) => handleCellEdit(facultyIndex, 'research_loads', index, 'contact_hours', value)}
                />
                <EditableCell 
                  content=""
                  onEdit={(value) => handleCellEdit(facultyIndex, 'research_loads', index, 'room', value)}
                />
              </tr>
            ))}
            <tr>
              <EditableCell 
                content="Total Load"
                onEdit={() => {}}
                className='text-right total-row'
                colSpan={3}
              />
              <EditableCell 
                content={totalLoad.toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_load', 0, 'units', value)}
              />
              <EditableCell 
                content={facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_load', 0, 'lec', value)}
              />
              <EditableCell 
                content={facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_load', 0, 'lab', value)}
              />
              <EditableCell 
                content={(facultyLoads.reduce((acc, load) => acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0) + administrativeLoad + researchLoad).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_load', 0, 'unit_credit', value)}
              />
              <EditableCell 
                content={(facultyLoads.reduce((acc, load) => acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0) + administrativeLoad + researchLoad).toFixed(2)}
                onEdit={(value) => handleCellEdit(facultyIndex, 'total_load', 0, 'contact_hours', value)}
              />
              <EditableCell 
                content=""
                onEdit={() => {}}
              />
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <Head>
        <title>Faculty Loading Form</title>
        <style>{`
          @page {
            size: landscape;
            margin: 0.5cm;
          }
          @media print {
            body {
              width: 100%;
              height: 100%;
              font-family: 'Times New Roman', Times, serif;
            }
            .faculty-loading-form {
              page-break-after: always;
            }
            .faculty-loading-form:last-of-type {
              page-break-after: auto;
            }
            .editable-cell {
              background-color: transparent !important;
            }
            .print-button {
              display: none;
            }
          }
          .editable-cell {
            position: relative;
            min-height: 1em;
            border: 1px solid black;
          }
          .editable-cell:hover:not(:focus) {
            background-color: #f0f0f0;
          }
          .editable-cell:focus {
            background-color: #e8f0fe;
            outline: 2px solid #4285f4;
            outline-offset: -2px;
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
        `}</style>
      </Head>
      <button onClick={handlePrint} className="print-button">
        Print Form
      </button>
      {Array.isArray(facultyData) && facultyData.length > 0 ? (
        facultyData.map((faculty, index) => (
          <div className="faculty-loading-form" key={faculty.id} style={{fontFamily: "Times New Roman, Times, serif"}}>
            <header>
              <div className="logo-container">
                <img src={asscat} alt="College Logo" className="logo" />
                <div className="college-info">
                  <h1>AGUSAN DEL SUR STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY</h1>
                  <p>San Teodoro, Bunawan, Agusan del Sur</p>
                  <p>e-mail address: asscat.registar@gmail.com; mobile no: +639387031619</p>
                  <p>website: www.asscat.edu.ph; mobile no.: +639483679266</p>
                </div>
              </div>
              <div className="document-info">
                <table>
                  <tbody>
                    <tr><td>Doc No.:</td><td></td></tr>
                    <tr><td>Effective Date:</td><td>{currentDate}</td></tr>
                    <tr><td>Rev No.:</td><td></td></tr>
                    <tr><td>Page No.:</td><td>{index + 1} of {facultyData.length}</td></tr>
                  </tbody>
                </table>
              </div>
            </header>

            <h2 className="form-title">FACULTY LOADING</h2>

            <div className="college-details">
              <h3>{department?.department_description?.toUpperCase() || 'N/A'}</h3>
              <h4>{course?.course_description || 'N/A'}</h4>
              <p>Semester: {academic_year?.semester || 'N/A'} &nbsp;&nbsp; Academic Year: {academic_year?.school_year || 'N/A'}</p>
            </div>

            {renderFacultyLoad(faculty, index)}

            <footer>
              <div className="signature-section">
                <div className="signature-line">
                  <p>PC's Initial: _________________</p>
                  <p>Date: _____/_____/_____</p>
                </div>
                <div className="signature-line">
                  <p>Dean's Initial: _________________</p>
                  <p>Date: _____/_____/_____</p>
                </div>
                <div className="signature-line">
                  <p>Chief Curriculum Planning and Development Initial: _________________</p>
                  <p>Date: _____/_____/_____</p>
                </div>
              </div>
            </footer>

            <style jsx>{`
              .faculty-loading-form {
                font-family: Arial, sans-serif;
                width: 100%;
                height: 100%;
                padding: 0.5cm;
                box-sizing: border-box;
              }
              header {
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
              .college-info h1 {
                font-size: 14px;
                margin-bottom: 2px;
              }
              .college-info p {
                font-size: 10px;
                margin: 1px 0;
              }
              .document-info table {
                border-collapse: collapse;
              }
              .document-info td {
                border: 1px solid black;
                padding: 1px 3px;
                font-size: 10px;
              }
              .form-title {
                text-align: center;
                font-size: 16px;
                margin: 10px 0;
                text-decoration: underline;
              }
              .college-details {
                text-align: center;
                margin-bottom: 10px;
              }
              .college-details h3, .college-details h4 {
                margin: 2px 0;
                font-size: 12px;
              }
              .college-details p {
                font-size: 10px;
                margin: 2px 0;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
              }
              th, td {
                border: 1px solid black;
                padding: 2px;
                text-align: center;
                font-size: 10px;
              }
              th {
                background-color: #c2e0c6;
              }
              .text-left {
                text-align: left;
              }
              .text-right {
                text-align: right;
              }
              .total-row {
                background-color: #c2e0c6;
                font-weight: bold;
              }
              footer {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
              }
              .faculty-section {
                margin-bottom: 20px;
                page-break-inside: avoid;
              }
              .signature-section {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                width: 100%;
              }
              .signature-line {
                text-align: left;
                margin: 0 10px;
              }
              .signature-line p {
                margin: 5px 0;
                font-size: 10px;
              }
            `}</style>
          </div>
        ))
      ) : (
        <p>No faculty data available.</p>
      )}
    </ErrorBoundary>
  );
}

