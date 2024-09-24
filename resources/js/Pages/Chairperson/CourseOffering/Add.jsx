"use client"

import { useState } from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import Authenticatedlayout from "@/Layouts/AuthenticatedLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import SelectInput from "@/Components/SelectInput"

export default function Add({ auth, section, course, academic }) {
  const { data, setData, post, errors } = useForm({
    section_name: [],
    course: "",
    academic_year: "",
    year_level: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("course_offering.store"))
  }

  const handleSectionChange = (e) => {
    const options = e.target.options
    const value = []
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    setData("section_name", value)
  }

  return (
    <Authenticatedlayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Add Course Offering
          </h2>
        </div>
      }
    >
      <Head title="Class Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
              >
                <div className="mt-4">
                  <InputLabel htmlFor="acad" value="Academic year" />
                  <SelectInput
                    id="acad"
                    name="academic_year"
                    value={data.academic_year}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("academic_year", e.target.value)}
                  >
                    <option value="" hidden>
                      - Select Academic Year -
                    </option>
                    {academic.map((acad) => (
                      <option value={acad.id} key={acad.id}>
                        {acad.school_year} - {acad.semester}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.academic_year} className="mt-2" />
                </div>

                <div className="mt-4">
                  <InputLabel htmlFor="course" value="Course" />
                  <SelectInput
                    id="course"
                    name="course"
                    value={data.course}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("course", e.target.value)}
                  >
                    <option value="" hidden>
                      - Select Program -
                    </option>
                    {course.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.course_name} - {c.course_description}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.course} className="mt-2" />
                </div>

                <div className="mt-4">
                  <InputLabel htmlFor="sec" value="Sections" />
                  <SelectInput
                    id="sec"
                    name="section_name"
                    value={data.section_name}
                    className="mt-1 block w-full"
                    onChange={handleSectionChange}
                    multiple
                  >
                    {section.map((sec) => (
                      <option value={sec.id} key={sec.id}>
                        {sec.section_name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.section_name} className="mt-2" />
                  <p className="mt-1 text-sm text-gray-500">
                    Hold Ctrl (Windows) or Command (Mac) to select multiple sections.
                  </p>
                </div>

                <div className="mt-4">
                  <InputLabel htmlFor="year" value="Year Level" />
                  <SelectInput
                    id="year"
                    name="year_level"
                    value={data.year_level}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("year_level", e.target.value)}
                  >
                    <option value="" hidden>
                      - Select Year Level -
                    </option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </SelectInput>
                  <InputError message={errors.year_level} className="mt-2" />
                </div>
                <div className="mt-4 text-right">
                  <Link
                    href={route("course_offering.index")}
                    className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                  >
                    Cancel
                  </Link>
                  <button className="bg-emerald-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-emerald-600">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Authenticatedlayout>
  )
}