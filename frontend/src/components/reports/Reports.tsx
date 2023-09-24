import { useEffect, useState } from "react";
import { Report } from "../../models";
import api from "../../api";
import Loading from "../Loading";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Array<Report>>([]);

  useEffect(() => {
    setLoading(true);
    api.get("reports/").then(response => {
      setReports(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <Loading loading={loading}>
      <div className="w-full">
        <h1 className="sm:text-3xl text-2xl font-medium m-4 text-gray-900">Trip Reports</h1>
        <div className="mx-8">
          {reports.map(report => (
            <Link key={report.id} to={`../${report.id}`}>
            <div key={report.id} className="h-60 w-full relative my-4 rounded-lg">
              <img className="w-full h-60 object-cover absolute top-0 left-0 rounded-lg hover:opacity-50" src={report.header_image} alt='s' />
              <div className="flex absolute bottom-0 left-5 flex-wrap items-center">
                <p className="text-lg text-white drop-shadow">{report.title}</p>
                <p className="ml-8 text-white drop-shadow">{dateFormat(report.report_date, "dd mmm yyyy")}</p>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </Loading>
  )

}