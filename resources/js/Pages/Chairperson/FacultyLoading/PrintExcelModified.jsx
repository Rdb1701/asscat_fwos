import React, { useEffect, useState } from 'react';
import { Head } from "@inertiajs/react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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

export default function FacultyLoading({ faculty_users, academic_year, department, course, dean, chair }) {
  const [currentDate, setCurrentDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  const handlePrint = () => {
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
  };

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      const workbook = new ExcelJS.Workbook();
    
      for (const faculty of faculty_users) {
        const worksheet = workbook.addWorksheet(faculty.name.slice(0, 30));
        
        // Page Setup
        worksheet.pageSetup.paperSize = 9; // A4
        worksheet.pageSetup.orientation = 'landscape';
        worksheet.pageSetup.margins = {
          left: 0.5, right: 0.5,
          top: 0.5, bottom: 0.5,
          header: 0.3, footer: 0.3
        };
  
        // Common Styles
        const headerStyle = {
          font: { name: 'Times New Roman', bold: true },
          alignment: { horizontal: 'center', vertical: 'middle' }
        };
  
        const tableHeaderStyle = {
          font: { name: 'Times New Roman', bold: true, size: 10 },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC2E0C6' }
          },
          alignment: { horizontal: 'center', vertical: 'middle' },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
  
        const cellBorderStyle = {
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
  
        // Header Section
        worksheet.mergeCells('A1:I1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'AGUSAN DEL SUR STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY';
        titleCell.font = { name: 'Times New Roman', bold: true, size: 14 };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
        worksheet.mergeCells('A2:I2');
        const addressCell = worksheet.getCell('A2');
        addressCell.value = 'San Teodoro, Bunawan, Agusan del Sur';
        addressCell.font = { name: 'Times New Roman', size: 10 };
        addressCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
        worksheet.mergeCells('A3:I3');
        const emailCell = worksheet.getCell('A3');
        emailCell.value = 'e-mail address: asscat.registar@gmail.com; mobile no: +639387031619';
        emailCell.font = { name: 'Times New Roman', size: 10 };
        emailCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
        worksheet.mergeCells('A4:I4');
        const websiteCell = worksheet.getCell('A4');
        websiteCell.value = 'website: www.asscat.edu.ph; mobile no.: +639483679266';
        websiteCell.font = { name: 'Times New Roman', size: 10 };
        websiteCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
        // Document Info
        const docInfoStyle = {
          font: { name: 'Times New Roman', size: 10 },
          border: cellBorderStyle.border
        };
  
        ['H5:I5', 'H6:I6', 'H7:I7', 'H8:I8'].forEach(range => {
          worksheet.mergeCells(range);
          const cell = worksheet.getCell(range.split(':')[0]);
          cell.style = docInfoStyle;
        });
  
        worksheet.getCell('H5').value = 'Doc No.:';
        worksheet.getCell('H6').value = 'Effective Date:';
        worksheet.getCell('I6').value = currentDate;
        worksheet.getCell('H7').value = 'Rev No.:';
        worksheet.getCell('H8').value = 'Page No.:';
        worksheet.getCell('I8').value = `${faculty_users.indexOf(faculty) + 1} of ${faculty_users.length}`;
  
        // Title
        worksheet.mergeCells('A9:I9');
        const formTitleCell = worksheet.getCell('A9');
        formTitleCell.value = 'FACULTY LOADING';
        formTitleCell.font = { name: 'Times New Roman', bold: true, size: 16, underline: true };
        formTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
        // Department and Course Info
        ['A10:I10', 'A11:I11', 'A12:I12'].forEach(range => {
          worksheet.mergeCells(range);
          const cell = worksheet.getCell(range.split(':')[0]);
          cell.font = { name: 'Times New Roman', size: 12 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
  
        worksheet.getCell('A10').value = department?.department_description?.toUpperCase() || 'N/A';
        worksheet.getCell('A11').value = course?.course_description || 'N/A';
        worksheet.getCell('A12').value = `Semester: ${academic_year?.semester || 'N/A'}    Academic Year: ${academic_year?.school_year || 'N/A'}`;
  
        // Table Headers
        const headerRow1 = worksheet.getRow(14);
        const headerRow2 = worksheet.getRow(15);
        
        [headerRow1, headerRow2].forEach(row => {
          row.height = 20;
          row.eachCell(cell => {
            cell.style = tableHeaderStyle;
          });
        });
  
        const headers = [
          ['Name of Instructor', 'Course No.', 'Descriptive Title', 'Program/Yr/Sec', 
           'No. of Units', 'No. of Hours/Week', '', 'Unit Credit', 'Contact Hours', 'Room to be used'],
          ['', '', '', '', '', 'Lec', 'Lab', '', '']
        ];
  
        headers.forEach((headerRow, idx) => {
          const row = idx === 0 ? headerRow1 : headerRow2;
          headerRow.forEach((header, colIdx) => {
            row.getCell(colIdx + 1).value = header;
          });
        });
  
        // Faculty Loads Section
        let currentRow = 16;
        const facultyLoads = faculty.faculty_loads || [];
        
        facultyLoads.forEach((load, index) => {
          const row = worksheet.getRow(currentRow + index);
          row.height = 20;
          row.eachCell(cell => {
            cell.style = {
              font: { name: 'Times New Roman', size: 10 },
              alignment: { horizontal: 'center', vertical: 'middle' },
              border: cellBorderStyle.border
            };
          });
  
          if (index === 0) {
            row.getCell(1).value = faculty.name.toUpperCase();
            row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
          }
          
          row.getCell(2).value = load.curriculum?.course_code || 'N/A';
          row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
          
          row.getCell(3).value = load.curriculum?.descriptive_title || 'N/A';
          row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' };
          
          row.getCell(4).value = load.sections?.section_name || 'N/A';
          row.getCell(5).value = load.curriculum?.units || 'N/A';
          row.getCell(6).value = load.curriculum?.lec || '0';
          row.getCell(7).value = load.curriculum?.lab || '0';
          row.getCell(8).value = ((parseFloat(load.curriculum?.lec || 0) + 
                                  parseFloat(load.curriculum?.lab || 0) * 0.75) || 0).toFixed(2);
          row.getCell(9).value = (parseFloat(load.curriculum?.lec || 0) + 
                                 parseFloat(load.curriculum?.lab || 0)) || 0;
        });
  
        currentRow += facultyLoads.length;
  
        // Academic Load Total Row
        const totalAcademicLoad = facultyLoads.reduce((acc, load) => 
          acc + parseFloat(load.curriculum?.units || 0), 0);
        const academicTotalRow = worksheet.getRow(currentRow);
        academicTotalRow.height = 20;
        
        academicTotalRow.eachCell(cell => {
          cell.style = {
            font: { name: 'Times New Roman', size: 10, bold: true },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: cellBorderStyle.border,
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFC2E0C6' }
            }
          };
        });
  
        academicTotalRow.getCell(1).value = 'Total Academic Load';
        academicTotalRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
        academicTotalRow.getCell(5).value = totalAcademicLoad.toFixed(2);
        academicTotalRow.getCell(6).value = facultyLoads.reduce((acc, load) => 
          acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2);
        academicTotalRow.getCell(7).value = facultyLoads.reduce((acc, load) => 
          acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2);
        academicTotalRow.getCell(8).value = facultyLoads.reduce((acc, load) => 
          acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0).toFixed(2);
        academicTotalRow.getCell(9).value = facultyLoads.reduce((acc, load) => 
          acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0).toFixed(2);
  
        currentRow += 2;
  
        // Administrative Loads Section
        const adminHeaderRow = worksheet.getRow(currentRow);
        adminHeaderRow.height = 20;
        adminHeaderRow.getCell(1).value = 'Administrative Load';
        adminHeaderRow.getCell(1).style = tableHeaderStyle;
        currentRow++;
  
        const administrativeLoads = faculty.administrative_loads || [];
        const administrativeLoad = administrativeLoads.reduce((acc, load) => 
          acc + parseFloat(load.units || 0), 0);
  
        administrativeLoads.forEach((load, index) => {
          const row = worksheet.getRow(currentRow + index);
          row.height = 20;
          
          row.eachCell(cell => {
            cell.style = {
              font: { name: 'Times New Roman', size: 10 },
              alignment: { horizontal: 'center', vertical: 'middle' },
              border: cellBorderStyle.border
            };
          });
  
          row.getCell(1).value = load.load_desc || 'N/A';
          row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
          row.getCell(5).value = load.units || '0';
          row.getCell(6).value = '0';
          row.getCell(7).value = '0';
          row.getCell(8).value = load.units || '0';
          row.getCell(9).value = load.units || '0';
        });
  
        currentRow += administrativeLoads.length;
  
        // Administrative Load Total
        const adminTotalRow = worksheet.getRow(currentRow);
        adminTotalRow.height = 20;
        
        adminTotalRow.eachCell(cell => {
          cell.style = {
            font: { name: 'Times New Roman', size: 10, bold: true },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: cellBorderStyle.border,
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFC2E0C6' }
            }
          };
        });
  
        adminTotalRow.getCell(1).value = 'Total Administrative Load';
        adminTotalRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
        adminTotalRow.getCell(5).value = administrativeLoad.toFixed(2);
        adminTotalRow.getCell(6).value = '0';
        adminTotalRow.getCell(7).value = '0';
        adminTotalRow.getCell(8).value = administrativeLoad.toFixed(2);
        adminTotalRow.getCell(9).value = administrativeLoad.toFixed(2);
  
        currentRow += 2;
  
        // Research Loads Section
        const researchHeaderRow = worksheet.getRow(currentRow);
        researchHeaderRow.height = 20;
        researchHeaderRow.getCell(1).value = 'Research Load';
        researchHeaderRow.getCell(1).style = tableHeaderStyle;
        currentRow++;
  
        const researchLoads = faculty.research_loads || [];
        const researchLoad = researchLoads.reduce((acc, load) => 
          acc + parseFloat(load.units || 0), 0);
  
        researchLoads.forEach((load, index) => {
          const row = worksheet.getRow(currentRow + index);
          row.height = 20;
          
          row.eachCell(cell => {
            cell.style = {
              font: { name: 'Times New Roman', size: 10 },
              alignment: { horizontal: 'center', vertical: 'middle' },
              border: cellBorderStyle.border
            };
          });
  
          row.getCell(1).value = load.load_desc || 'N/A';
          row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
          row.getCell(5).value = load.units || '0';
          row.getCell(6).value = '0';
          row.getCell(7).value = '0';
          row.getCell(8).value = load.units || '0';
          row.getCell(9).value = load.units || '0';
        });
  
        currentRow += researchLoads.length;
  
        // Final Total Row
        const totalLoad = totalAcademicLoad + administrativeLoad + researchLoad;
        const finalTotalRow = worksheet.getRow(currentRow);
        finalTotalRow.height = 20;
        
        finalTotalRow.eachCell(cell => {
          cell.style = {
            font: { name: 'Times New Roman', size: 10, bold: true },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: cellBorderStyle.border,
            fill: {
              type: 'pattern',
              pattern: 'solid',
             fgColor: { argb: 'FFC2E0C6' }
          }
        };
      });

      finalTotalRow.getCell(1).value = 'Total Load';
      finalTotalRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
      finalTotalRow.getCell(5).value = totalLoad.toFixed(2);
      finalTotalRow.getCell(6).value = facultyLoads.reduce((acc, load) => 
        acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2);
      finalTotalRow.getCell(7).value = facultyLoads.reduce((acc, load) => 
        acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2);
      finalTotalRow.getCell(8).value = (facultyLoads.reduce((acc, load) => 
        acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0) + 
        administrativeLoad + researchLoad).toFixed(2);
      finalTotalRow.getCell(9).value = (facultyLoads.reduce((acc, load) => 
        acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0) + 
        administrativeLoad + researchLoad).toFixed(2);

      currentRow += 3;

      // Updated Signature section to match PDF format
      const signatureStyle = {
        font: { name: 'Times New Roman', size: 10 },
        alignment: { horizontal: 'left', vertical: 'middle' }
      };

      // PC's Initial
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = "PC's Initial: _________________";
      worksheet.getCell(`A${currentRow}`).style = signatureStyle;
      
      worksheet.mergeCells(`A${currentRow + 1}:C${currentRow + 1}`);
      worksheet.getCell(`A${currentRow + 1}`).value = "Date: _____/_____/_____";
      worksheet.getCell(`A${currentRow + 1}`).style = signatureStyle;

      // Dean's Initial
      worksheet.mergeCells(`D${currentRow}:F${currentRow}`);
      worksheet.getCell(`D${currentRow}`).value = "Dean's Initial: _________________";
      worksheet.getCell(`D${currentRow}`).style = signatureStyle;
      
      worksheet.mergeCells(`D${currentRow + 1}:F${currentRow + 1}`);
      worksheet.getCell(`D${currentRow + 1}`).value = "Date: _____/_____/_____";
      worksheet.getCell(`D${currentRow + 1}`).style = signatureStyle;

      // Chief Curriculum Planning and Development Initial
      worksheet.mergeCells(`G${currentRow}:I${currentRow}`);
      worksheet.getCell(`G${currentRow}`).value = "Chief Curriculum Planning and Development Initial: _________________";
      worksheet.getCell(`G${currentRow}`).style = signatureStyle;
      
      worksheet.mergeCells(`G${currentRow + 1}:I${currentRow + 1}`);
      worksheet.getCell(`G${currentRow + 1}`).value = "Date: _____/_____/_____";
      worksheet.getCell(`G${currentRow + 1}`).style = signatureStyle;

      // Set column widths
      const columnWidths = [25, 15, 40, 15, 12, 8, 8, 12, 12];
      worksheet.columns.forEach((column, index) => {
        column.width = columnWidths[index];
      });

      // Adjust row heights
      worksheet.eachRow((row, rowNumber) => {
        row.height = rowNumber <= 4 ? 15 : 20;
      });
    }

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `Faculty_Loading_${academic_year?.school_year || 'Report'}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  } finally {
    setIsExporting(false);
  }
};

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
            <th>Room to be used</th>
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
              <td></td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className='text-right total-row'>Total Academic Load</td>
            <td>{totalAcademicLoad.toFixed(2)}</td>
            <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2)}</td>
            <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2)}</td>
            <td>{facultyLoads.reduce((acc, load) => acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0).toFixed(2)}</td>
            <td>{facultyLoads.reduce((acc, load) => acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0).toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className='text-left' colSpan={10}>Administrative Load</th>
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
              <td></td>
            </tr>
          ))}
          <tr>
            <td className='text-right total-row' colSpan={4}>Total Administrative Load</td>
            <td>{administrativeLoad.toFixed(2)}</td>
            <td>0</td>
            <td>0</td>
            <td>{administrativeLoad.toFixed(2)}</td>
            <td>{administrativeLoad.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th colSpan={10} className='text-left'>Research Load</th>
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
              <td></td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className='text-right total-row'>Total Load</td>
            <td>{totalLoad.toFixed(2)}</td>
            <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lec || 0), 0).toFixed(2)}</td>
            <td>{facultyLoads.reduce((acc, load) => acc + parseFloat(load.curriculum?.lab || 0), 0).toFixed(2)}</td>
            <td>{(facultyLoads.reduce((acc, load) => acc + ((parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0) * 0.75) || 0), 0) + administrativeLoad + researchLoad).toFixed(2)}</td>
            <td>{(facultyLoads.reduce((acc, load) => acc + (parseFloat(load.curriculum?.lec || 0) + parseFloat(load.curriculum?.lab || 0)), 0) + administrativeLoad + researchLoad).toFixed(2)}</td>
            <td></td>
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
          .no-print {
            display: none;
          }
        }
      `}</style>
    </Head>

    <div className="no-print mb-4 flex space-x-4">
      <button 
        onClick={handlePrint}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Print
      </button>
      <button 
        onClick={exportToExcel}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isExporting ? 'Exporting...' : 'Export to Excel'}
      </button>
    </div>

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
              .faculty-section {
                margin-bottom: 20px;
                page-break-inside: avoid;
              }
              .faculty-load-table {
                margin-bottom: 15px;
              }
              @media print {
                .no-print {
                  display: none;
                }
                button {
                  display: none;
                }
                .faculty-loading-form {
                  padding: 0;
                }
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
