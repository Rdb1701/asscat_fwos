import React, { useEffect } from "react";
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx";
import { Head } from "@inertiajs/react";

export default function ExcelCurriculum({
    auth,
    curriculum,
    program,
    school_year,
    noDataFound,
    curriculum_year,
    chairperson
}) {
    const groupByYearAndSemester = curriculum.reduce((acc, cur) => {
        const key = `${cur.year_level}-${cur.semester}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);
        return acc;
    }, {});

    const isEmpty = noDataFound || Object.keys(groupByYearAndSemester).length === 0;

    const exportToExcel = () => {
        if (isEmpty) {
            alert("No data to export");
            window.history.back();
            return;
        }

        const wb = XLSXUtils.book_new();

        // Enhanced styles matching PDF format
        const styles = {
            header: {
                font: { name: "Arial", sz: 11, bold: true },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: { top: 0, right: 0, bottom: 0, left: 0 }
            },
            normalText: {
                font: { name: "Arial", sz: 11 },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: { top: 0, right: 0, bottom: 0, left: 0 }
            },
            tableHeader: {
                font: { name: "Arial", sz: 11, bold: true },
                fill: { patternType: "solid", fgColor: { rgb: "90EE90" } },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: {
                    top: { style: "medium", color: { rgb: "000000" } },
                    right: { style: "medium", color: { rgb: "000000" } },
                    bottom: { style: "medium", color: { rgb: "000000" } },
                    left: { style: "medium", color: { rgb: "000000" } }
                }
            },
            tableCell: {
                font: { name: "Arial", sz: 11 },
                alignment: { horizontal: "left", vertical: "center", wrapText: true },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } }
                }
            },
            tableTotalRow: {
                font: { name: "Arial", sz: 11, bold: true },
                fill: { patternType: "solid", fgColor: { rgb: "90EE90" } },
                alignment: { horizontal: "left", vertical: "center", wrapText: true },
                border: {
                    top: { style: "medium", color: { rgb: "000000" } },
                    right: { style: "medium", color: { rgb: "000000" } },
                    bottom: { style: "medium", color: { rgb: "000000" } },
                    left: { style: "medium", color: { rgb: "000000" } }
                }
            },
            signatureLabel: {
                font: { name: "Arial", sz: 11 },
                alignment: { horizontal: "left", vertical: "bottom" },
                border: { top: 0, right: 0, bottom: 0, left: 0 }
            },
            signatureLine: {
                font: { name: "Arial", sz: 11 },
                alignment: { horizontal: "left", vertical: "center" },
                border: {
                    bottom: { style: "medium", color: { rgb: "000000" } }
                }
            },
            signatureName: {
                font: { name: "Arial", sz: 11, bold: true },
                alignment: { horizontal: "left", vertical: "center" },
                border: { top: 0, right: 0, bottom: 0, left: 0 }
            },
            signatureTitle: {
                font: { name: "Arial", sz: 11 },
                alignment: { horizontal: "left", vertical: "top" },
                border: { top: 0, right: 0, bottom: 0, left: 0 }
            }
        };

        Object.entries(groupByYearAndSemester).forEach(([key, courses]) => {
            const [yearLevel, semester] = key.split("-");
            
            // Calculate totals
            const totalCMO = courses.reduce((sum, cur) => sum + parseFloat(cur.cmo || 0), 0);
            const totalHEI = courses.reduce((sum, cur) => sum + parseFloat(cur.hei || 0), 0);
            const totalLEC = courses.reduce((sum, cur) => sum + parseFloat(cur.lec || 0), 0);
            const totalLAB = courses.reduce((sum, cur) => sum + parseFloat(cur.lab || 0), 0);

            // Header data with proper spacing
            const headerData = [
                [""],
                ["Republic of the Philippines"],
                ["AGUSAN DEL SUR STATE COLLEGE OF AGRICULTURE AND TECHNOLOGY"],
                [program.department_description.toUpperCase()],
                ["Bunawan, Agusan del Sur"],
                [`${program.course_description.toUpperCase()} (${program.course_name})`],
                ["Revised Curriculum to conform with"],
                ["CMO NO. 25 Series 2015 and CMO NO. 20 Series 2013"],
                [`Effective AY ${curriculum_year}`],
                [""],
                [`${yearLevel} - ${semester}`],
                [""]
            ];

            const tableHeaders = [
                ["Course No.", "Descriptive Title", "CREDIT UNITS", "", "HOURS", "", "Pre-requisite"],
                ["", "", "CMO", "HEI", "LEC", "LAB", ""]
            ];

            const courseData = courses.map(cur => [
                cur.course_code,
                cur.descriptive_title,
                cur.cmo,
                cur.hei,
                cur.lec,
                cur.lab,
                cur.pre_requisite || "None"
            ]);

            const totalRow = [
                "Total",
                "",
                totalCMO,
                totalHEI,
                totalLEC,
                totalLAB,
                ""
            ];

            // Enhanced signature section with proper spacing
            const signatureSection = [
                [""],
                [""],
                ["Prepared by:", "", "", "Checked by:"],
                ["____________________________", "", "", "____________________________"],
                [chairperson.chairperson_name.toUpperCase(), "", "", program.dean_name.toUpperCase()],
                [`Chairperson, ${program.course_name}`, "", "", `Dean, ${program.department_name}`],
                [""],
                [""],
                ["Recommended by:", "", "", "Approved by:"],
                ["____________________________", "", "", "____________________________"],
                ["CARMELO S. LLANTO, Ph.D.", "", "", "JOY C. CAPISTRANO"],
                ["VP for Academic Affairs & Quality Assurance", "", "", "College President"]
            ];

            const wsData = [
                ...headerData,
                ...tableHeaders,
                ...courseData,
                totalRow,
                ...signatureSection
            ];

            // Create worksheet
            const ws = XLSXUtils.aoa_to_sheet(wsData);

            // Set optimized column widths
            ws['!cols'] = [
                { wch: 15 },  // Course No.
                { wch: 50 },  // Descriptive Title
                { wch: 8 },   // CMO
                { wch: 8 },   // HEI
                { wch: 8 },   // LEC
                { wch: 8 },   // LAB
                { wch: 30 }   // Pre-requisite
            ];

            // Apply styles with ranges
            const headerLastRow = headerData.length;
            const tableHeaderLastRow = headerLastRow + tableHeaders.length;
            const tableLastRow = tableHeaderLastRow + courseData.length;

            // Apply styles to cells
            for (let cell in ws) {
                if (cell[0] === '!') continue;

                const rowNum = parseInt(cell.substring(1));
                
                if (rowNum <= headerLastRow) {
                    ws[cell].s = rowNum === 1 ? styles.normalText : styles.header;
                }
                else if (rowNum <= tableHeaderLastRow) {
                    ws[cell].s = styles.tableHeader;
                }
                else if (rowNum <= tableLastRow) {
                    ws[cell].s = styles.tableCell;
                }
                else if (rowNum === tableLastRow + 1) {
                    ws[cell].s = styles.tableTotalRow;
                }
                else {
                    const content = ws[cell].v;
                    if (content && content.includes("by:")) {
                        ws[cell].s = styles.signatureLabel;
                    } else if (content && content.includes("_____")) {
                        ws[cell].s = styles.signatureLine;
                    } else if (content && (
                        content === chairperson.chairperson_name.toUpperCase() ||
                        content === program.dean_name.toUpperCase() ||
                        content === "CARMELO S. LLANTO, Ph.D." ||
                        content === "JOY C. CAPISTRANO"
                    )) {
                        ws[cell].s = styles.signatureName;
                    } else if (content) {
                        ws[cell].s = styles.signatureTitle;
                    }
                }
            }

            // Add merged cells for headers
            ws['!merges'] = [
                // Credit Units header
                { s: { r: headerLastRow, c: 2 }, e: { r: headerLastRow, c: 3 } },
                // Hours header
                { s: { r: headerLastRow, c: 4 }, e: { r: headerLastRow, c: 5 } }
            ];

            // Add worksheet to workbook
            XLSXUtils.book_append_sheet(wb, ws, `${yearLevel}-${semester}`);
        });

        // Save the file with custom name
        XLSXWriteFile(wb, `Curriculum-${program.course_name}.xlsx`);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            exportToExcel();
            window.history.back();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head>
                <title>Export Curriculum to Excel</title>
            </Head>

            <div className="p-4 max-w-4xl mx-auto text-center">
                {isEmpty ? (
                    <div className="text-red-600 font-bold py-5">
                        No data available for export
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl mb-4">Generating Excel file...</h2>
                        <p className="text-gray-600">The file will download automatically.</p>
                    </div>
                )}
            </div>
        </>
    );
}