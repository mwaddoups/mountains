import { useEffect, useState } from "react";
import { FullReport } from "../../models";
import api from "../../api";
import Loading from "../Loading";
import dateFormat from "dateformat";
import { Link, useParams } from "react-router-dom";
import { Heading, Section, SmallHeading } from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { useAuth } from "../Layout";

export default function SingleReport() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<FullReport | null>(null);

  const { reportId } = useParams();

  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get(`reports/${reportId}/`).then((response) => {
      setReport(response.data);
      setLoading(false);
    });
  }, [reportId]);

  return (
    <Loading loading={loading}>
      <div className="flex items-center">
        <Link to="../">
          <div className="text-sm text-blue-400 flex mt-1 mb-2 items-center hover:underline">
            <ArrowLeftCircleFill className="display-inline" />
            <p className="ml-2"> Back to Reports</p>
          </div>
        </Link>

        {currentUser?.is_site_admin && (
          <Link to={`edit`}>
            <button className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-1">
              Edit report
            </button>
          </Link>
        )}
      </div>
      <Section>
        <Heading>{report?.title}</Heading>
        <SmallHeading>
          {dateFormat(report?.report_date, "dd mmmm yyyy")}
        </SmallHeading>
        <ClydeMarkdown>{report?.content}</ClydeMarkdown>
      </Section>
    </Loading>
  );
}
