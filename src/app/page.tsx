"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Advocate,
  SortConfig,
  SearchCategory,
  SearchCategoryType,
  categoryPlaceholders
} from "@/types";

import Appbar from "./components/Appbar";
import Button from "./components/ui/Button";
import Select from "./components/ui/Select";
import Pagination from "./components/ui/Pagination";
import SearchInput from "./components/ui/SearchInput";
import InputLabel from "./components/ui/InputLabel";

export default function Home() {
  const [tableHeaders] = useState([
    { id: "name", name: "Name" },
    { id: "city", name: "City" },
    { id: "degree", name: "Degree" },
    { id: "specialities", name: "Specialities" },
    { id: "yearsOfExperience", name: "Years of Experience" },
    { id: "phoneNumber", name: "Phone Number" }
  ]);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<SearchCategoryType>(
    SearchCategory.NAME
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getAdvocates();
  }, []);

  const getAdvocates = async () => {
    setLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/advocates");
      if (!response.ok) throw new Error("Failed to fetch");

      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data || []);
    } catch (err) {
      console.error("Error fetching advocates:", err);
      setServerError("Failed to fetch advocates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const filteredAndSortedAdvocates = useMemo(() => {
    let results = advocates;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      results = results.filter((data) => {
        switch (searchCategory) {
          case SearchCategory.NAME: {
            const fullName = `${data.firstName} ${data.lastName}`;
            return fullName.toLowerCase().includes(q);
          }
          case SearchCategory.CITY:
            return data.city.toLowerCase().includes(q);
          case SearchCategory.DEGREE:
            return data.degree.toLowerCase().includes(q);
          case SearchCategory.SPECIALITIES:
            return data.specialties.some((s) => s.toLowerCase().includes(q));
          case SearchCategory.YEARS_OF_EXPERIENCE:
            return data.yearsOfExperience.toString().includes(searchQuery);
          case SearchCategory.PHONE_NUMBER:
            return data.phoneNumber.toString().includes(searchQuery);
          default:
            return false;
        }
      });
    }

    if (sortConfig !== null) {
      results = [...results].sort((a, b) => {
        let aVal: string | number = "";
        let bVal: string | number = "";

        switch (sortConfig.key) {
          case "name":
            aVal = `${a.firstName} ${a.lastName}`;
            bVal = `${b.firstName} ${b.lastName}`;
            break;
          case "city":
            aVal = a.city;
            bVal = b.city;
            break;
          case "degree":
            aVal = a.degree;
            bVal = b.degree;
            break;
          case "specialities":
            aVal = a.specialties.join(", ");
            bVal = b.specialties.join(", ");
            break;
          case "yearsOfExperience":
            aVal = a.yearsOfExperience;
            bVal = b.yearsOfExperience;
            break;
          case "phoneNumber":
            aVal = a.phoneNumber;
            bVal = b.phoneNumber;
            break;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [advocates, searchQuery, searchCategory, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedAdvocates.length / rowsPerPage);

  const paginatedAdvocates = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedAdvocates.slice(start, start + rowsPerPage);
  }, [filteredAndSortedAdvocates, currentPage, rowsPerPage]);

  const resetFilter = () => {
    setSearchQuery("");
    setSearchCategory(SearchCategory.NAME);
    setSortConfig(null);
    setCurrentPage(1);
    setRowsPerPage(5);
  };

  return (
    <>
      <Appbar />

      <main>
        <div className="flex min-h-screen flex-col bg-gray-100 py-7">
          <div className="container mx-auto grow rounded-md border-gray-300 bg-white p-5 shadow-lg">
            <div className="flex gap-x-3">
              <SearchInput
                className="w-72"
                id="search-input"
                value={searchQuery}
                placeholder={categoryPlaceholders[searchCategory]}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />

              <Select
                className="w-48"
                id="category-filter"
                showLabel={false}
                value={searchCategory}
                onChange={(e) =>
                  setSearchCategory(e.target.value as SearchCategoryType)
                }
              >
                {Object.entries(SearchCategory).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key.charAt(0) +
                      key.slice(1).toLowerCase().replace(/_/g, " ")}
                  </option>
                ))}
              </Select>

              <div className="flex gap-x-2">
                <Button
                  className="px-5 pt-3"
                  onClick={() => getAdvocates()}
                  aria-label="Refresh data"
                >
                  Refresh
                </Button>

                <Button
                  className="bg-red-600 px-5 pt-3 hover:bg-red-700"
                  onClick={resetFilter}
                  aria-label="Reset search filter"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {filteredAndSortedAdvocates.length} record(s) found.
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="text-left">
                    {tableHeaders.map((item) => {
                      const isSorted =
                        sortConfig?.key === item.id
                          ? sortConfig.direction
                          : null;

                      return (
                        <th
                          key={item.id}
                          className="select-none border-b-2 border-gray-300 bg-gray-50 px-3 pb-1.5 pt-2 font-semibold hover:cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSort(item.id)}
                        >
                          <span className="flex items-center gap-1">
                            {item.name}
                            {isSorted === "asc" && " ↑"}
                            {isSorted === "desc" && " ↓"}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-4 text-center text-sm text-gray-500"
                      >
                        Loading advocates...
                      </td>
                    </tr>
                  )}

                  {!loading && serverError && (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-sm">
                        {serverError}{" "}
                        <Button onClick={getAdvocates} className="ml-2">
                          Retry
                        </Button>
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !serverError &&
                    paginatedAdvocates.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-4 text-center text-sm"
                        >
                          No results found.
                        </td>
                      </tr>
                    )}

                  {!loading &&
                    !serverError &&
                    paginatedAdvocates.map((item, idx) => (
                      <tr
                        key={`item.${idx}`}
                        className="text-sm even:bg-gray-50"
                      >
                        <td className="border-b-2 border-gray-300 px-3 py-4">
                          {item.firstName} {item.lastName}
                        </td>

                        <td className="border-b-2 border-gray-300 px-3 py-4">
                          {item.city}
                        </td>

                        <td className="border-b-2 border-gray-300 px-3 py-4">
                          {item.degree}
                        </td>

                        <td className="border-b-2 border-gray-300 px-3 py-4">
                          <ul className="list-disc pl-5">
                            {item.specialties.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        </td>

                        <td className="border-b-2 border-gray-300 px-3 py-4">
                          {item.yearsOfExperience}
                        </td>

                        <td className="border-b-2 border-gray-300 px-3 py-4">
                          {item.phoneNumber}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {!loading &&
              !serverError &&
              filteredAndSortedAdvocates.length > 0 && (
                <div className="mt-5 flex items-center justify-end gap-x-4">
                  <div className="flex items-center gap-x-2">
                    <InputLabel htmlFor="rowsPerPage" className="mb-0 text-sm">
                      Rows per page:
                    </InputLabel>

                    <Select
                      id="rowsPerPage"
                      className="w-24"
                      showLabel={false}
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Pagination
                          key={`page-${page}`}
                          page={page}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>
    </>
  );
}
