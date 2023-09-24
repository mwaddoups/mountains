import { useEffect, useState } from "react";
import { FullReport } from "../../models";
import api from "../../api";
import Loading from "../Loading";
import dateFormat from "dateformat";
import { Link, useParams } from "react-router-dom";
import { Heading, Section, SmallHeading } from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";

export default function SingleReport() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<FullReport | null>(null);

  const { reportId } = useParams();

  useEffect(() => {
    setLoading(true);
    api.get(`reports/${reportId}/`).then(response => {
      setReport(response.data);
      setLoading(false);
    });
  }, [reportId]);

  return (
    <Loading loading={loading}>
      <Link to="../">
        <div className="text-sm text-blue-400 flex mt-1 mb-2 items-center hover:underline">
          <ArrowLeftCircleFill className="display-inline" /> 
          <p className="ml-2"> Back to Reports</p>
        </div>
      </Link>
      <Section>
        <Heading>{report?.title}</Heading>
        <SmallHeading>{dateFormat(report?.report_date, "dd mmmm yyyy")}</SmallHeading>
        <ClydeMarkdown>
          {report?.content}
        </ClydeMarkdown>
      </Section>
    </Loading>
  )

}