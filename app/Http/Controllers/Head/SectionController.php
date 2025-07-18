<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Http\Resources\SectionResource;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user     = Auth::user();
        $query    = Section::query()->where('course_id', $user->course_id);
        $sections = $query->get();

        return inertia("Chairperson/Section/Index", [
            "sections" => SectionResource::collection($sections),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Chairperson/Section/Add");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSectionRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();
        $yearLevel = "";

        //convert String to number of year level
        if ($data['year_level'] == "First Year") {
            $yearLevel = 1;
        } else if ($data['year_level'] == "Second Year") {
            $yearLevel = 2;
        } else if ($data['year_level'] == "Third Year") {
            $yearLevel = 3;
        } else if ($data['year_level'] == "Fourth Year") {
            $yearLevel = 4;
        }

        //Query to take the course
        $course_query = Course::where('id', $user->course_id)->select('course_name')->first();

        //section insertion
        for ($i = 1; $i <= $data['section_count']; $i++) {
            //vonvert number to alphabet using ASCII
            $sectionLetter = chr(64 + $i);

            DB::table('sections')->insert([
                'section_name' => $course_query->course_name . " " . $yearLevel . $sectionLetter,
                'year_level'   => $data['year_level'],
                'course_id'    =>  $user->course_id
            ]);
        }

        return to_route("section.index")
            ->with('success', 'Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section)
    {
        $query = Section::query();
        $sections = $query->get();

        return inertia("Chairperson/Section/Index", [
            "sections" => SectionResource::collection($sections),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section)
    {
        return inertia("Chairperson/Section/Edit", [
            'secs' => new SectionResource($section)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateSectionRequest $request, Section $section)
    {
        $data = $request->validated();
        $section->update($data);

        return to_route('section.index')
            ->with('success', 'Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    
    public function destroy(Section $section)
    {
        $section->delete();

        return to_route('section.index');
    }
}
