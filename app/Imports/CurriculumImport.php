<?php

namespace App\Imports;

use App\Models\Curriculum;
use App\Models\Course;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class CurriculumImport implements ToModel, WithValidation, WithHeadingRow
{
    private $rowCount = 0;

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $this->rowCount++;

        // Find the course by its name in the 'courses' table
        $course = Course::where('course_name', $row['course_name'])->first();

        if (!$course) {
            throw new \Exception("Course '{$row['course_name']}' not found in the courses table.");
        }

        // Check if a curriculum already exists with the same course_code and efectivity_year
        $existingCurriculum = Curriculum::where('course_code', $row['course_code'])
                                        ->where('efectivity_year', $row['efectivity_year'])
                                        ->first();

        if ($existingCurriculum) {
            throw new \Exception("A curriculum with course code '{$row['course_code']}' and effectivity year '{$row['efectivity_year']}' already exists.");
        }

        $semester = $row['semester'];
        if ($semester === 'First Semester') {
            $semester = '1st Semester';
        } elseif ($semester === 'Second Semester') {
            $semester = '2nd Semester';
        } elseif ($semester === 'Summer') {
            $semester = 'Summer';
        }

        return new Curriculum([
            'course_code'      => $row['course_code'],
            'descriptive_title'=> $row['descriptive_title'],
            'lec'              => $row['lec'],
            'lab'              => $row['lab'],
            'cmo'              => $row['cmo'],
            'hei'              => $row['hei'],
            'pre_requisite'    => $row['pre_requisite'] ?? 'None',
            'course_id'        => $course->id, // Use the course ID from the lookup
            'year_level'       => $row['year_level'],
            'efectivity_year'  => $row['efectivity_year'],
            'semester'         => $semester,
        ]);
    }

    /**
     * Validation rules for each row
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'course_code'      => 'required|string|max:255',
            'descriptive_title'=> 'required|string|max:255',
            'units'            => 'nullable|integer|min:0',
            'lec'              => 'nullable|integer|min:0',
            'lab'              => 'nullable|integer|min:0',
            'cmo'              => 'nullable|integer|min:0',
            'hei'              => 'nullable|integer|min:0',
            'pre_requisite'    => 'nullable|string|max:255',
            'course_name'      => 'required|string|exists:courses,course_name', // Ensure the course name exists
            'year_level'       => 'required|string|max:255',
            'efectivity_year'  => 'required|string|max:255',
            'semester'         => 'required|string|max:255',
        ];
    }

    public function getRowCount()
    {
        return $this->rowCount;
    }
}
