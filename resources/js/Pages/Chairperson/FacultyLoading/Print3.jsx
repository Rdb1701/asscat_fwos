import React, { useEffect, useState } from 'react';
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

  const renderFacultyLoad = (faculty) => {
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

    return (
      <div key={faculty.id} className="faculty-section">
        {/* <h3>Faculty: {faculty.name}</h3> */}
        <table className="faculty-load-table">
          <thead>
            <tr>
              <th>Name of Instructor</th>
              <th>Course No.</th>
              <th>Descriptive Title</th>
              <th>Program/Yr/Sec</th>
              <th>No. of Units</th>
              <th colSpan={2}>No. of Hours/Week</th>
              <th>Unit Credit</th>
              <th>Contact Hours</th>
            </tr>
            <tr>
              <th colSpan={5}></th>
              <th>Lec</th>
              <th>Lab</th>
              <th colSpan={3}></th>
            </tr>
          </thead>
          <tbody>
            {facultyLoads.map((load, index) => (
              <tr key={index}>
              {index === 0 && <td rowSpan={facultyLoads.length}>{faculty.name.toUpperCase()}</td>}
                <td className='text-left'>{load.curriculum?.course_code || 'N/A'}</td>
                <td className='text-left'>{load.curriculum?.descriptive_title || 'N/A'}</td>
                <td>{load.sections?.section_name || 'N/A'}</td>
                <td>{load.curriculum?.units || 'N/A'}</td>
                <td>{load.curriculum?.lec || '0'}</td>
                <td>{load.curriculum?.lab || '0'}</td>
                <td>{((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0).toFixed(2)}</td>
                <td>{(parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)) || 0}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className='text-right total-row'>Total Academic Load</td>
              <td>{totalAcademicLoad.toFixed(2)}</td>
              <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2)}</td>
              <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2)}</td>
              <td>{facultyLoads.reduce((acc, load) => acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0).toFixed(2)}</td>
              <td>{facultyLoads.reduce((acc, load) => acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0).toFixed(2)}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th className='text-left' colSpan={9}>Administrative Load</th>
            </tr>
          </thead>
          <tbody>
            {administrativeLoads.map((load, index) => (
              <tr key={index}>
                <td className='text-left' colSpan={4}>{load.load_desc || 'N/A'}</td>
                <td>{load.units || '0'}</td>
                <td>0</td>
                <td>0</td>
                <td>{load.units || '0'}</td>
                <td>{load.units || '0'}</td>
              </tr>
            ))}
            <tr>
              <td className='text-right total-row' colSpan={4}>Total Administrative Load</td>
              <td>{administrativeLoad.toFixed(2)}</td>
              <td>0</td>
              <td>0</td>
              <td>{administrativeLoad.toFixed(2)}</td>
              <td>{administrativeLoad.toFixed(2)}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th colSpan={9} className='text-left'>Research Load</th>
            </tr>
          </thead>
          <tbody>
            {researchLoads.map((load, index) => (
              <tr key={index}>
                <td colSpan={4} className='text-left'>{load.load_desc || 'N/A'}</td>
                <td>{load.units || '0'}</td>
                <td>0</td>
                <td>0</td>
                <td>{load.units || '0'}</td>
                <td>{load.units || '0'}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className='text-right total-row'>Total Load</td>
              <td>{totalLoad.toFixed(2)}</td>
              <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2)}</td>
              <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2)}</td>
              <td>{(facultyLoads.reduce((acc, load) => acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0) + administrativeLoad + researchLoad).toFixed(2)}</td>
              <td>{(facultyLoads.reduce((acc, load) => acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0) + administrativeLoad + researchLoad).toFixed(2)}</td>
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
          }
        `}</style>
      </Head>
      {Array.isArray(faculty_users) && faculty_users.length > 0 ? (
        faculty_users.map((faculty, index) => (
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
                <tr><td>Page No.:</td><td>{index + 1} of {faculty_users.length}</td></tr>
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

        {renderFacultyLoad(faculty)}

        <footer>
          <div className="signature-line">
            <p>Prepared by:</p>
            <br/>
            <p className="name">{chair?.name?.toUpperCase() || 'N/A'}</p>
            <p className="position">Chairperson, {course?.course_name?.toUpperCase() || 'N/A'}</p>
            <p className="date">Date: ___/___/___</p>
          </div>
          <div className="signature-line">
            <p>Checked by:</p>
            <br/>
            <p className="name">{dean?.name?.toUpperCase() || 'N/A'}</p>
            <p className="position">Dean, {department?.department_name || 'N/A'}</p>
            <p className="date">Date: ___/___/___</p>
          </div>
          <div className="signature-line">
            <p>Reviewed by:</p>
            <br/>
            <p className="name">LIEZL MAY G. PEREZ</p>
            <p className="position">Chief Curriculum Planning and Development</p>
            <p className="date">Date: ___/___/___</p>
          </div>
          <div className="signature-line">
            <p>Approved:</p>
            <br/>
            <p className="name">CARMELO S. LLANTO, Ph.D.</p>
            <p className="position">VP for Academic Affairs and Quality Assurance</p>
            <p className="date">Date: ___/___/___</p>
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
          .signature-line {
            text-align: center;
            width: 24%;
          }
          .signature-line p {
            margin: 2px 0;
            font-size: 10px;
          }
          .name {
            font-weight: bold;
          }
          .faculty-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
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

