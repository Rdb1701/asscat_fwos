import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import {
    FaUserTie,
    FaCalendar,
    FaGraduationCap,
    FaBook,
    FaClipboardList,
} from "react-icons/fa";
import { FaSchool, FaClipboardCheck, FaBookOpenReader } from "react-icons/fa6";
import { MdClass } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>
                            {user.role === "Registrar" && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("registrar.dashboard")}
                                        active={route().current(
                                            "registrar.dashboard"
                                        )}
                                    >
                                        <FaCalendar
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Academic Year
                                    </NavLink>

                                    <NavLink
                                        href={route("department.index")}
                                        active={route().current(
                                            "department.index"
                                        )}
                                    >
                                        <FaSchool
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        College Management
                                    </NavLink>

                                    <NavLink
                                        href={route("deanAccount.index")}
                                        active={route().current(
                                            "deanAccount.index"
                                        )}
                                    >
                                        <FaUserTie
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Dean Accounts
                                    </NavLink>

                                    <NavLink
                                        href={route("facultyload.index")}
                                        active={route().current(
                                            "facultyload.index"
                                        )}
                                    >
                                        <FaClipboardList
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Faculty Loading
                                    </NavLink>

                                    <NavLink
                                        href={route("course_offer.index")}
                                        active={route().current(
                                            "course_offer.index"
                                        )}
                                    >
                                        <FaBook
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Course Offering
                                    </NavLink>
                                </div>
                            )}

                            {user.role === "Dean" && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("dean.dashboard")}
                                        active={route().current(
                                            "dean.dashboard"
                                        )}
                                    >
                                        <FaGraduationCap
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Programs
                                    </NavLink>

                                    <NavLink
                                        href={route("chairAccount.index")}
                                        active={route().current(
                                            "chairAccount.index"
                                        )}
                                    >
                                        <FaUserTie
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Chairperson Account
                                    </NavLink>

                                    <NavLink
                                        href={route("facultyload.index")}
                                        active={route().current(
                                            "facultyload.index"
                                        )}
                                    >
                                        <FaClipboardList
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Faculty Loading Reports
                                    </NavLink>

                                    <NavLink
                                        href={route("course_offer.index")}
                                        active={route().current(
                                            "course_offer.index"
                                        )}
                                    >
                                        <FaBook
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Course Offering Reports
                                    </NavLink>
                                </div>
                            )}

                            {user.role === "Chairperson" && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("chairperson.dashboard")}
                                        active={route().current(
                                            "chairperson.dashboard"
                                        )}
                                    >
                                        <MdClass
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Class Management
                                    </NavLink>

                                    <NavLink
                                        href={route("curriculum.index")}
                                        active={route().current(
                                            "curriculum.index"
                                        )}
                                    >
                                        <FaBookOpenReader
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Curriculum File
                                    </NavLink>

                                    <NavLink
                                        href={route("faculty_file.index")}
                                        active={route().current(
                                            "faculty_file.index"
                                        )}
                                    >
                                        <GiTeacher
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Faculty File
                                    </NavLink>
                                    <NavLink
                                        href={route("faculty_load.index")}
                                        active={route().current(
                                            "faculty_load.index"
                                        )}
                                    >
                                        <FaClipboardList
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Faculty Loading
                                    </NavLink>

                                    <NavLink
                                        href={route("course_offering.index")}
                                        active={route().current(
                                            "course_offering.index"
                                        )}
                                    >
                                        <FaBook
                                            style={{ marginRight: "8px" }}
                                        />{" "}
                                        Course Offering
                                    </NavLink>
                                </div>
                            )}

                            {user.role === "Faculty" && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("faculty.dashboard")}
                                        active={route().current("faculty.dashboard")}
                                    >
                                        Faculty Loading
                                    </NavLink>                             
                                </div>
                            )}
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    {user.role === "Registrar" && (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("registrar.dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                    )}

                    {user.role === "Dean" && (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("dean.dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                    )}

                    {user.role === "Chairperson" && (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("chairperson.dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                    )}

                    {user.role === "Faculty" && (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("faculty.dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                    )}

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
