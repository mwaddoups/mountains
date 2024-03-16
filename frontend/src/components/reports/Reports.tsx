import { useEffect, useState } from "react";
import { Report } from "../../models";
import api from "../../api";
import Loading from "../Loading";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import { useAuth } from "../Layout";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Array<Report>>([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get("reports/").then((response) => {
      setReports(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <Loading loading={loading}>
      <div className="w-full">
        <div className="flex items-center">
          <h1 className="sm:text-3xl text-2xl font-medium m-4 text-gray-900">
            Trip Reports
          </h1>
          {currentUser?.is_site_admin && (
            <Link to="../new">
              <button className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-2">
                Create report
              </button>
            </Link>
          )}
        </div>
        <div className="mx-8">
          {reports.map((report) => (
            <Link key={report.id} to={`../${report.id}`}>
              <div
                key={report.id}
                className="h-60 w-full relative my-4 rounded-lg bg-gradient-to-r from-teal-300 hover:opacity-50"
              >
                <img
                  className="w-full h-60 object-cover absolute top-0 left-0 rounded-lg"
                  src={report.header_image}
                  alt=""
                />
                <div className="flex absolute bottom-2 left-5 flex-wrap items-center">
                  <p className="text-lg text-white drop-shadow">
                    {report.title}
                  </p>
                  <p className="ml-8 text-white drop-shadow">
                    {dateFormat(report.report_date, "dd mmmm yyyy")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Loading>
  );
}
