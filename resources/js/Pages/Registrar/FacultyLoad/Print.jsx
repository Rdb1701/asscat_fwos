import React, { useEffect, useState } from 'react';
import { Head } from "@inertiajs/react";
import asscat from '../../../../../public/logo.png';

export default function FacultyLoadingForm({ facultyLoad,faculty_info, administrative_faculty_load, research_faculty_load, academic_year, department, chair, admin_load, research_load }) {
  const totalAcademicLoad = facultyLoad.reduce((acc, course) => acc + parseFloat(course.units), 0);
  const totalLoad = totalAcademicLoad + parseFloat(administrative_faculty_load) + parseFloat(research_faculty_load);

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

  return (
    <>
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
            }
          }
        `}</style>
      </Head>
      <div className="faculty-loading-form">
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
                <tr><td>Page No.:</td><td>1 of 1</td></tr>
              </tbody>
            </table>
          </div>
        </header>

        <h2 className="form-title">FACULTY LOADING</h2>

        <div className="college-details">
          <h3>{department.department_description.toUpperCase()}</h3>
          <h4>{department.course_description}</h4>
          <p> Semester: {academic_year.semester} &nbsp;&nbsp;  Academic Year: {academic_year.school_year}</p>
        </div>

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
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {facultyLoad.map((course, index) => (
              <tr key={index}>
                {index === 0 && <td rowSpan={facultyLoad.length}>{faculty_info.name.toUpperCase()}</td>}
                <td className='text-left'>{course.course_code}</td>
                <td className='text-left'>{course.descriptive_title}</td>
                <td>{course.section_name}</td>
                <td>{course.units}</td>
                <td>{course.lec}</td>
                <td>{course.lab}</td>
                <td>{(parseFloat(course.lec) + parseFloat(course.lab) * 0.75).toFixed(2)}</td>
                <td>{parseFloat(course.lec) + parseFloat(course.lab)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className='text-right total-row'>Total Academic Load</td>
              <td>{totalAcademicLoad}</td>
              <td>{facultyLoad.reduce((acc, course) => acc + parseFloat(course.lec), 0)}</td>
              <td>{facultyLoad.reduce((acc, course) => acc + parseFloat(course.lab), 0)}</td>
              <td>{facultyLoad.reduce((acc, course) => acc + (parseFloat(course.lec) + (parseFloat(course.lab) * 0.75)), 0).toFixed(2)}</td>
              <td>{facultyLoad.reduce((acc, course) => acc + parseFloat(course.lec) + parseFloat(course.lab), 0)}</td>
            </tr>
          </tbody>      

            <thead>
            <tr>
              <th className='text-left' colSpan={9}>Administrative Load</th>
            </tr>
          </thead>
          <tbody>
         
            <tr>
              <td className='text-left' colSpan={4}>{admin_load && admin_load.load_desc ? admin_load.load_desc : ""}</td>
              <td>{research_faculty_load}</td>
              <td>0</td>
              <td>0</td>
              <td>{research_faculty_load}</td>
              <td>{research_faculty_load}</td>
            </tr>
       
           
            <tr>
              <td className='text-right total-row' colSpan={4}>Total Administrative Load</td>
              <td>{administrative_faculty_load}</td>
              <td>0</td>
              <td>0</td>
              <td>{administrative_faculty_load}</td>
              <td>{administrative_faculty_load}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th colSpan={9} className='text-left'>Research Load</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className='text-left'>{research_load && research_load.load_desc ? research_load.load_desc : ""}</td>
              <td>{research_faculty_load}</td>
              <td>0</td>
              <td>0</td>
              <td>{research_faculty_load}</td>
              <td>{research_faculty_load}</td>
            </tr>
            <tr>
              <td colSpan={4} className='text-right total-row'>Total Load</td>
              <td>{totalLoad.toFixed(2)}</td>
              <td>{facultyLoad.reduce((acc, course) => acc + parseFloat(course.lec), 0)}</td>
              <td>{facultyLoad.reduce((acc, course) => acc + parseFloat(course.lab), 0)}</td>
              <td>{(facultyLoad.reduce((acc, course) => acc + (parseFloat(course.lec) + (parseFloat(course.lab) * 0.75)), 0) + parseFloat(administrative_faculty_load) + parseFloat(research_faculty_load)).toFixed(2)}</td>
              <td>{facultyLoad.reduce((acc, course) => acc + parseFloat(course.lec) + parseFloat(course.lab), 0) + parseFloat(administrative_faculty_load) + parseFloat(research_faculty_load)}</td>
            </tr>
          </tbody>
        </table><br/><br/>

        <footer>
          <div className="signature-line">
            <p>Prepared by:</p>
            <br/>
            <p className="name">{chair.name.toUpperCase()}</p>
            <p className="position">Chairperson, {department.course_name.toUpperCase()}</p>
            <p className="date">Date: ___/___/___</p>
          </div>
          <div className="signature-line">
            <p>Checked by:</p>
            <br/>
            <p className="name">{department.dean_name.toUpperCase()}</p>
            <p className="position">Dean, {department.department_name}</p>
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
        `}</style>
      </div>
    </>
  );
}